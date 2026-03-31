import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { respondOfferSchema } from "@declutter/shared";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = respondOfferSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { status, seller_message } = parsed.data;

  const { data, error } = await supabase
    .from("offers")
    .update({
      status,
      seller_message,
      responded_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("seller_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send email notification to buyer about acceptance/rejection

  return NextResponse.json(data);
}
