import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { respondOfferSchema, formatPrice } from "@declutter/shared";
import { sendEmail, buildOfferResponseEmail } from "@/lib/email";

export async function GET(
  _request: Request,
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

  const { data, error } = await supabase
    .from("offers")
    .select("*, listings(title, asking_price)")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

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

  // Fetch the offer with listing details before updating
  const { data: offer, error: fetchError } = await supabase
    .from("offers")
    .select("*, listings(title, asking_price)")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (fetchError || !offer) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  if (offer.status !== "pending") {
    return NextResponse.json(
      { error: "Offer already responded to" },
      { status: 400 },
    );
  }

  // Update offer status
  const { data: updated, error: updateError } = await supabase
    .from("offers")
    .update({
      status,
      seller_message,
      responded_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 },
    );
  }

  // If accepted, mark listing as sold
  if (status === "accepted") {
    await supabase
      .from("listings")
      .update({ status: "sold" })
      .eq("id", offer.listing_id);
  }

  // Send email notification to buyer
  const listing = offer.listings as { title: string; asking_price: number } | null;
  const sellerProfile = await supabase
    .from("users")
    .select("email")
    .eq("id", user.id)
    .single();

  if (listing && sellerProfile.data) {
    const emailContent = buildOfferResponseEmail({
      buyerEmail: offer.buyer_email,
      buyerName: offer.buyer_name,
      listingTitle: listing.title,
      offerAmount: formatPrice(offer.amount),
      accepted: status === "accepted",
      sellerMessage: seller_message ?? null,
      sellerEmail: sellerProfile.data.email,
    });

    await sendEmail({
      to: offer.buyer_email,
      subject:
        status === "accepted"
          ? `Your offer on "${listing.title}" was accepted!`
          : `Update on your offer for "${listing.title}"`,
      htmlBody: emailContent.htmlBody,
      textBody: emailContent.textBody,
      tag: "offer-response",
    });
  }

  return NextResponse.json(updated);
}
