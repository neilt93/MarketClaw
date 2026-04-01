"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, CATEGORY_LABELS } from "@declutter/shared";

interface DraftListing {
  id: string;
  title: string;
  description: string;
  category: string | null;
  condition: string;
  asking_price: number;
  ebay_avg_price: number | null;
}

export default function ReviewPage() {
  const [drafts, setDrafts] = useState<DraftListing[]>([]);
  const [approving, setApproving] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  const loadDrafts = useCallback(async () => {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    if (data) setDrafts(data as DraftListing[]);
  }, [supabase]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleApprove = async (listingId: string) => {
    setApproving(true);
    await fetch("/api/listings/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_ids: [listingId] }),
    });
    setDrafts((prev) => prev.filter((d) => d.id !== listingId));
    setApproving(false);
  };

  const handleApproveAll = async () => {
    setApproving(true);
    await fetch("/api/listings/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_ids: drafts.map((d) => d.id) }),
    });
    setDrafts([]);
    setApproving(false);
  };

  const handleSkip = async (listingId: string) => {
    await supabase
      .from("listings")
      .update({ status: "withdrawn" })
      .eq("id", listingId);
    setDrafts((prev) => prev.filter((d) => d.id !== listingId));
  };

  if (drafts.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Review Listings</h1>
        <p className="mt-4 text-gray-500">No draft listings to review.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Review Listings ({drafts.length})
        </h1>
        <button
          onClick={handleApproveAll}
          disabled={approving}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          Approve All
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {drafts.map((draft) => (
          <div key={draft.id} className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{draft.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {CATEGORY_LABELS[draft.category ?? ""] ?? draft.category} &middot;{" "}
                  {draft.condition}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {draft.description}
                </p>
              </div>
              <div className="ml-6 text-right">
                <p className="text-2xl font-bold">
                  {formatPrice(draft.asking_price)}
                </p>
                {draft.ebay_avg_price && (
                  <p className="text-xs text-gray-400">
                    eBay avg: {formatPrice(draft.ebay_avg_price)}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleApprove(draft.id)}
                disabled={approving}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  router.push(`/dashboard/listings/${draft.id}/edit`)
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleSkip(draft.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
