import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { approveListingsSchema } from "@declutter/shared";
import { generateEmbedding } from "@/lib/embeddings";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = approveListingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { listing_ids } = parsed.data;

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .in("id", listing_ids)
    .eq("user_id", user.id)
    .eq("status", "draft");

  if (error || !listings) {
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }

  let approved = 0;
  let failed = 0;

  for (const listing of listings) {
    try {
      const embeddingText = `${listing.title} ${listing.description} ${listing.category ?? ""}`;
      const embedding = await generateEmbedding(embeddingText);

      await supabase
        .from("listings")
        .update({
          status: "active",
          published_at: new Date().toISOString(),
          embedding: JSON.stringify(embedding),
        })
        .eq("id", listing.id);

      approved++;
    } catch {
      // Approve without embedding if embedding generation fails
      await supabase
        .from("listings")
        .update({
          status: "active",
          published_at: new Date().toISOString(),
        })
        .eq("id", listing.id);

      approved++;
      failed++;
    }
  }

  return NextResponse.json({ approved, embeddings_failed: failed });
}
