import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEbayPriceComps } from "@/lib/ebay";
import { generateListingCopy } from "@/lib/anthropic";
import { suggestPrice, isResalable } from "@declutter/shared";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { item_ids } = await request.json();

  if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
    return NextResponse.json(
      { error: "item_ids required (array of UUIDs)" },
      { status: 400 },
    );
  }

  // Fetch items
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .in("id", item_ids)
    .eq("user_id", user.id);

  if (error || !items) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }

  // Filter to resalable only
  const resalableItems = items.filter((item) => isResalable(item.category));

  if (resalableItems.length === 0) {
    return NextResponse.json(
      { error: "No resalable items in the provided IDs" },
      { status: 400 },
    );
  }

  const results = {
    generated: 0,
    failed: 0,
    listing_ids: [] as string[],
  };

  // Process in batches of 5 (concurrent eBay + Claude calls)
  const batchSize = 5;
  for (let i = 0; i < resalableItems.length; i += batchSize) {
    const batch = resalableItems.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map(async (item) => {
        // 1. Check if listing already exists for this item
        const { data: existing } = await supabase
          .from("listings")
          .select("id")
          .eq("item_id", item.id)
          .limit(1);

        if (existing && existing.length > 0) {
          return existing[0]!.id; // Already generated
        }

        // 2. Get eBay price comps
        let ebayComps = { median: 0, low: 0, high: 0, count: 0, comps: [] as { title: string; price: number; condition: string; url: string }[] };
        try {
          ebayComps = await getEbayPriceComps(
            item.name,
            item.brand,
            item.model_number,
          );
        } catch {
          // eBay API may not be configured yet — continue without comps
        }

        // 3. Calculate suggested price
        const purchaseDate = item.purchase_date
          ? new Date(item.purchase_date)
          : null;
        const { suggestedPriceCents } = suggestPrice(
          item.purchase_price,
          purchaseDate,
          item.category,
          ebayComps.median || null,
          ebayComps.count,
        );

        // 4. Generate listing copy via Claude
        const listing = await generateListingCopy({
          itemName: item.name,
          brand: item.brand,
          model: item.model_number,
          category: item.category,
          purchasePriceCents: item.purchase_price,
          purchaseDate: item.purchase_date,
          retailer: item.retailer,
          suggestedPriceCents,
          ebayMedianCents: ebayComps.median || null,
          ebayCompCount: ebayComps.count,
        });

        // 5. Insert draft listing
        const { data: newListing, error: insertError } = await supabase
          .from("listings")
          .insert({
            user_id: user.id,
            item_id: item.id,
            title: listing.title,
            description: listing.description,
            category: item.category,
            condition: listing.condition,
            asking_price: suggestedPriceCents,
            ebay_avg_price: ebayComps.median || null,
            ebay_comp_count: ebayComps.count,
            ebay_comps: ebayComps.comps.length > 0 ? ebayComps.comps : null,
            status: "draft",
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        return newListing.id;
      }),
    );

    for (const r of batchResults) {
      if (r.status === "fulfilled") {
        results.generated++;
        results.listing_ids.push(r.value);
      } else {
        results.failed++;
      }
    }

    // Delay between batches
    if (i + batchSize < resalableItems.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return NextResponse.json(results);
}
