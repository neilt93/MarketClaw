"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_LABELS } from "@declutter/shared";

interface ListingData {
  id: string;
  title: string;
  description: string;
  category: string | null;
  condition: string;
  asking_price: number;
  status: string;
  ebay_avg_price: number | null;
  items: {
    name: string;
    brand: string | null;
    purchase_price: number | null;
    purchase_date: string | null;
    retailer: string | null;
  } | null;
}

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [listing, setListing] = useState<ListingData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("good");
  const [askingPrice, setAskingPrice] = useState("");
  const [saving, setSaving] = useState(false);

  const loadListing = useCallback(async () => {
    const { data } = await supabase
      .from("listings")
      .select("*, items(name, brand, purchase_price, purchase_date, retailer)")
      .eq("id", params.id as string)
      .single();

    if (data) {
      const l = data as ListingData;
      setListing(l);
      setTitle(l.title);
      setDescription(l.description);
      setCondition(l.condition);
      setAskingPrice((l.asking_price / 100).toFixed(2));
    }
  }, [supabase, params.id]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const handleSave = async () => {
    setSaving(true);
    const priceCents = Math.round(parseFloat(askingPrice) * 100);

    await supabase
      .from("listings")
      .update({
        title,
        description,
        condition,
        asking_price: priceCents,
      })
      .eq("id", params.id as string);

    setSaving(false);
    router.push("/dashboard/listings");
  };

  if (!listing) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Edit Listing</h1>

      {listing.items && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
          <p className="font-medium">Original Purchase</p>
          <p className="text-gray-600">
            {listing.items.name}
            {listing.items.brand && ` (${listing.items.brand})`}
            {listing.items.retailer && ` from ${listing.items.retailer}`}
            {listing.items.purchase_date &&
              ` on ${listing.items.purchase_date}`}
            {listing.items.purchase_price &&
              ` for $${(listing.items.purchase_price / 100).toFixed(2)}`}
          </p>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <p className="mt-1 text-xs text-gray-400">
            {title.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {listing.ebay_avg_price && (
              <p className="mt-1 text-xs text-gray-400">
                eBay avg: ${(listing.ebay_avg_price / 100).toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="like_new">Like New</option>
              <option value="very_good">Very Good</option>
              <option value="good">Good</option>
              <option value="acceptable">Acceptable</option>
            </select>
          </div>
        </div>

        {listing.category && (
          <p className="text-sm text-gray-500">
            Category: {CATEGORY_LABELS[listing.category] ?? listing.category}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !title || !description || !askingPrice}
            className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => router.push("/dashboard/listings")}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
