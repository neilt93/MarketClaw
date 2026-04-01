import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { formatPrice } from "@declutter/shared";
import { sendEmail, buildOfferResponseEmail } from "@/lib/email";

// Postmark inbound email webhook
// Sellers can reply to offer notification emails with "ACCEPT" or "DECLINE"
// The reply-to address encodes the offer ID: offer-{id}@inbound.declutter.so

export async function POST(request: Request) {
  // Postmark doesn't send a server token header on inbound webhooks,
  // but we can verify by checking the source or using a secret path.
  // For V1, accept all inbound posts (the webhook URL itself is the secret).

  const body = await request.json();

  // Postmark inbound webhook payload shape
  const fromEmail: string = body.FromFull?.Email ?? body.From ?? "";
  const textBody: string = body.TextBody ?? "";
  const toEmail: string = body.ToFull?.[0]?.Email ?? body.To ?? "";

  // Extract offer ID from the To address: offer-{uuid}@inbound.declutter.so
  const offerIdMatch = toEmail.match(/offer-([a-f0-9-]{36})@/i);
  if (!offerIdMatch) {
    return NextResponse.json(
      { error: "Could not parse offer ID from recipient address" },
      { status: 400 },
    );
  }

  const offerId = offerIdMatch[1];

  // Determine accept or decline from the body
  const bodyLower = textBody.toLowerCase().trim();
  let decision: "accepted" | "rejected" | null = null;

  if (
    bodyLower.startsWith("accept") ||
    bodyLower.includes("yes") ||
    bodyLower.includes("i accept")
  ) {
    decision = "accepted";
  } else if (
    bodyLower.startsWith("decline") ||
    bodyLower.startsWith("reject") ||
    bodyLower.includes("no thanks") ||
    bodyLower.includes("i decline")
  ) {
    decision = "rejected";
  }

  if (!decision) {
    // Can't determine intent — ignore silently
    return NextResponse.json({ received: true, action: "ignored" });
  }

  // Use service role to update offer (this is a webhook, no user session)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  // Fetch the offer
  const { data: offer, error: fetchError } = await supabase
    .from("offers")
    .select("*, listings(title, asking_price, user_id)")
    .eq("id", offerId)
    .single();

  if (fetchError || !offer) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  if (offer.status !== "pending") {
    return NextResponse.json({
      received: true,
      action: "already_responded",
    });
  }

  // Verify the reply is from the seller
  const { data: seller } = await supabase
    .from("users")
    .select("email")
    .eq("id", offer.seller_id)
    .single();

  if (!seller || seller.email.toLowerCase() !== fromEmail.toLowerCase()) {
    return NextResponse.json(
      { error: "Reply not from listing seller" },
      { status: 403 },
    );
  }

  // Update the offer
  await supabase
    .from("offers")
    .update({
      status: decision,
      responded_at: new Date().toISOString(),
    })
    .eq("id", offerId);

  // If accepted, mark listing as sold
  if (decision === "accepted") {
    await supabase
      .from("listings")
      .update({ status: "sold" })
      .eq("id", offer.listing_id);
  }

  // Notify the buyer
  const listing = offer.listings as {
    title: string;
    asking_price: number;
  } | null;
  if (listing) {
    const emailContent = buildOfferResponseEmail({
      buyerEmail: offer.buyer_email,
      buyerName: offer.buyer_name,
      listingTitle: listing.title,
      offerAmount: formatPrice(offer.amount),
      accepted: decision === "accepted",
      sellerMessage: null,
      sellerEmail: seller.email,
    });

    await sendEmail({
      to: offer.buyer_email,
      subject:
        decision === "accepted"
          ? `Your offer on "${listing.title}" was accepted!`
          : `Update on your offer for "${listing.title}"`,
      htmlBody: emailContent.htmlBody,
      textBody: emailContent.textBody,
      tag: "offer-response",
    });
  }

  return NextResponse.json({
    received: true,
    action: decision,
    offer_id: offerId,
  });
}
