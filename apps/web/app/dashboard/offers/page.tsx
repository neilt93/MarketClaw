import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@declutter/shared";

export default async function OffersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: offers } = await supabase
    .from("offers")
    .select("*, listings(title, asking_price)")
    .eq("seller_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Offers</h1>

      {(!offers || offers.length === 0) ? (
        <p className="mt-6 text-gray-500">
          No offers yet. Offers from buyers will appear here.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium">
                  {(offer.listings as { title: string } | null)?.title ?? "Unknown listing"}
                </p>
                <p className="text-sm text-gray-500">
                  From: {offer.buyer_name ?? offer.buyer_email}
                </p>
                {offer.message && (
                  <p className="mt-1 text-sm text-gray-600 italic">
                    &ldquo;{offer.message}&rdquo;
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {formatPrice(offer.amount)}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    offer.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : offer.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {offer.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
