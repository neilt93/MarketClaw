import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TODO: Implement in Week 3
// 1. Fetch items by IDs
// 2. Get eBay price comps for each
// 3. Calculate suggested price via depreciation + comps
// 4. Generate listing title + description via Claude
// 5. Create draft listings

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { item_ids } = await request.json();

  if (!item_ids || item_ids.length === 0) {
    return NextResponse.json(
      { error: "item_ids required" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { error: "Not implemented yet — coming in Week 3" },
    { status: 501 },
  );
}
