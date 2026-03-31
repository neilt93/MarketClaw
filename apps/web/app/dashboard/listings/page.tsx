import { createClient } from "@/lib/supabase/server";
import { formatPrice, CATEGORY_LABELS } from "@declutter/shared";
import Link from "next/link";

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const drafts = listings?.filter((l) => l.status === "draft") ?? [];
  const active = listings?.filter((l) => l.status === "active") ?? [];
  const sold = listings?.filter((l) => l.status === "sold") ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Listings</h1>
        {drafts.length > 0 && (
          <Link
            href="/dashboard/listings/review"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Review {drafts.length} Drafts
          </Link>
        )}
      </div>

      {(!listings || listings.length === 0) && (
        <p className="mt-6 text-gray-500">
          No listings yet. Scan your receipts to generate listings.
        </p>
      )}

      {active.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Active ({active.length})</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((listing) => (
              <div
                key={listing.id}
                className="rounded-lg bg-white p-4 shadow-sm"
              >
                <p className="font-medium">{listing.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {CATEGORY_LABELS[listing.category ?? ""] ?? listing.category}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatPrice(listing.asking_price)}
                </p>
                <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  {listing.condition}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {sold.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Sold ({sold.length})</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sold.map((listing) => (
              <div
                key={listing.id}
                className="rounded-lg bg-white p-4 opacity-60 shadow-sm"
              >
                <p className="font-medium">{listing.title}</p>
                <p className="mt-2 text-lg font-semibold line-through">
                  {formatPrice(listing.asking_price)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
