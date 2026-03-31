import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractReceiptData } from "@/lib/anthropic";
import { isResalable } from "@declutter/shared";
import type { ParsedEmail } from "@/lib/gmail";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const receiptIds: string[] = body.receipt_ids;

  if (!receiptIds || receiptIds.length === 0) {
    return NextResponse.json(
      { error: "receipt_ids required" },
      { status: 400 },
    );
  }

  // Fetch the receipts
  const { data: receipts, error } = await supabase
    .from("receipts")
    .select("*")
    .in("id", receiptIds)
    .eq("user_id", user.id)
    .eq("status", "pending");

  if (error || !receipts) {
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 500 },
    );
  }

  const results = {
    parsed: 0,
    items_found: 0,
    resalable_items: 0,
    failed: 0,
  };

  // Process in batches of 10
  const batchSize = 10;
  for (let i = 0; i < receipts.length; i += batchSize) {
    const batch = receipts.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map(async (receipt) => {
        // Mark as parsing
        await supabase
          .from("receipts")
          .update({ status: "parsing" })
          .eq("id", receipt.id);

        const email: ParsedEmail = {
          messageId: receipt.source_message_id ?? receipt.id,
          subject: receipt.subject ?? "",
          from: receipt.sender_email ?? "",
          date: receipt.created_at,
          retailer: "Unknown",
          text: receipt.raw_text ?? "",
        };

        // Detect retailer from sender
        if (receipt.sender_email) {
          const { detectRetailer } = await import("@/lib/gmail");
          email.retailer = detectRetailer(receipt.sender_email);
        }

        const extraction = await extractReceiptData(email);

        if (!extraction || !extraction.is_receipt) {
          await supabase
            .from("receipts")
            .update({ status: "parsed", parsed_at: new Date().toISOString() })
            .eq("id", receipt.id);
          return { items: 0, resalable: 0 };
        }

        // Filter to resalable items and insert
        let resalableCount = 0;
        for (const item of extraction.items) {
          const itemRow = {
            receipt_id: receipt.id,
            user_id: user.id,
            name: item.item_name,
            brand: item.brand,
            model_number: item.model,
            category: item.category,
            purchase_price: item.price_paid
              ? Math.round(item.price_paid * 100)
              : null, // Convert dollars to cents
            quantity: item.quantity,
            purchase_date: extraction.purchase_date,
            retailer: extraction.retailer,
            raw_extraction: item as unknown as Record<string, unknown>,
          };

          await supabase.from("items").insert(itemRow);

          if (isResalable(item.category)) {
            resalableCount++;
          }
        }

        await supabase
          .from("receipts")
          .update({ status: "parsed", parsed_at: new Date().toISOString() })
          .eq("id", receipt.id);

        return {
          items: extraction.items.length,
          resalable: resalableCount,
        };
      }),
    );

    for (const r of batchResults) {
      if (r.status === "fulfilled") {
        results.parsed++;
        results.items_found += r.value.items;
        results.resalable_items += r.value.resalable;
      } else {
        results.failed++;
        // Mark failed receipts
        const receipt = batch[batchResults.indexOf(r)];
        if (receipt) {
          await supabase
            .from("receipts")
            .update({
              status: "failed",
              error_message:
                r.reason instanceof Error
                  ? r.reason.message
                  : "Unknown error",
            })
            .eq("id", receipt.id);
        }
      }
    }

    // Delay between batches
    if (i + batchSize < receipts.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return NextResponse.json(results);
}
