import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch counts
  const [receiptsRes, itemsRes, listingsRes, offersRes] = await Promise.all([
    supabase
      .from("receipts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id),
    supabase
      .from("items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id),
    supabase
      .from("offers")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", user!.id)
      .eq("status", "pending"),
  ]);

  const stats = [
    { label: "Receipts Scanned", value: receiptsRes.count ?? 0 },
    { label: "Items Found", value: itemsRes.count ?? 0 },
    { label: "Active Listings", value: listingsRes.count ?? 0 },
    { label: "Pending Offers", value: offersRes.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
