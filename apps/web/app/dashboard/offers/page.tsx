"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@declutter/shared";

interface OfferRow {
  id: string;
  listing_id: string;
  buyer_name: string | null;
  buyer_email: string;
  amount: number;
  message: string | null;
  status: string;
  seller_message: string | null;
  expires_at: string;
  created_at: string;
  listings: { title: string; asking_price: number } | null;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [responding, setResponding] = useState<string | null>(null);

  const supabase = createClient();

  const loadOffers = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("offers")
      .select("*, listings(title, asking_price)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setOffers(data as OfferRow[]);
  }, [supabase]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Handle URL params for email accept/reject links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    const id = params.get("id");
    if (action && id) {
      handleRespond(
        id,
        action === "accept" ? "accepted" : "rejected",
      );
      // Clean URL
      window.history.replaceState({}, "", "/dashboard/offers");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRespond = async (
    offerId: string,
    status: "accepted" | "rejected",
  ) => {
    setResponding(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await loadOffers();
      }
    } catch {
      // Silently fail
    }
    setResponding(null);
  };

  const pending = offers.filter((o) => o.status === "pending");
  const resolved = offers.filter((o) => o.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold">Offers</h1>

      {offers.length === 0 && (
        <p className="mt-6 text-gray-500">
          No offers yet. When buyers make offers through OpenClaw agents,
          they&apos;ll appear here.
        </p>
      )}

      {pending.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">
            Pending ({pending.length})
          </h2>
          <div className="mt-3 space-y-4">
            {pending.map((offer) => {
              const isExpired = new Date(offer.expires_at) < new Date();
              return (
                <div
                  key={offer.id}
                  className="rounded-lg bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {offer.listings?.title ?? "Unknown listing"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        From: {offer.buyer_name ?? offer.buyer_email}
                      </p>
                      {offer.message && (
                        <p className="mt-2 text-sm italic text-gray-600">
                          &ldquo;{offer.message}&rdquo;
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400">
                        {isExpired
                          ? "Expired"
                          : `Expires ${new Date(offer.expires_at).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatPrice(offer.amount)}
                      </p>
                      {offer.listings && (
                        <p className="text-xs text-gray-400">
                          Asking: {formatPrice(offer.listings.asking_price)}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isExpired && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleRespond(offer.id, "accepted")}
                        disabled={responding === offer.id}
                        className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(offer.id, "rejected")}
                        disabled={responding === offer.id}
                        className="rounded-lg border border-red-300 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {resolved.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">History</h2>
          <div className="mt-3 space-y-3">
            {resolved.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium">
                    {offer.listings?.title ?? "Unknown listing"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {offer.buyer_name ?? offer.buyer_email} &middot;{" "}
                    {new Date(offer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">
                    {formatPrice(offer.amount)}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      offer.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : offer.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
