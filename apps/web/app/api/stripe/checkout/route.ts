import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createPaymentForOffer } from "@/lib/stripe";

// POST: Create a payment session for an accepted offer
// Called by the MCP server or buyer-facing payment page
export async function POST(request: Request) {
  const body = await request.json();
  const { offer_id } = body;

  if (!offer_id) {
    return NextResponse.json(
      { error: "offer_id required" },
      { status: 400 },
    );
  }

  // Use service role — this can be called from MCP server context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  // Fetch offer with listing and seller info
  const { data: offer, error } = await supabase
    .from("offers")
    .select(
      "*, listings(title, asking_price, user_id), users:seller_id(stripe_connect_id, stripe_connect_onboarded)",
    )
    .eq("id", offer_id)
    .eq("status", "accepted")
    .single();

  if (error || !offer) {
    return NextResponse.json(
      { error: "Offer not found or not accepted" },
      { status: 404 },
    );
  }

  const listing = offer.listings as {
    title: string;
    user_id: string;
  } | null;
  const seller = offer.users as {
    stripe_connect_id: string | null;
    stripe_connect_onboarded: boolean;
  } | null;

  if (!seller?.stripe_connect_id || !seller.stripe_connect_onboarded) {
    return NextResponse.json(
      {
        error:
          "Seller has not set up payments yet. The seller needs to connect Stripe in their settings.",
      },
      { status: 400 },
    );
  }

  // Check if payment already created
  if (offer.payment_intent_id) {
    return NextResponse.json({
      payment_intent_id: offer.payment_intent_id,
      status: offer.payment_status,
    });
  }

  // Create PaymentIntent
  const { paymentIntentId, clientSecret } = await createPaymentForOffer({
    amountCents: offer.amount,
    currency: offer.currency ?? "usd",
    buyerEmail: offer.buyer_email,
    sellerConnectId: seller.stripe_connect_id,
    listingTitle: listing?.title ?? "Listing",
    offerId: offer.id,
  });

  // Store payment intent ID on the offer
  await supabase
    .from("offers")
    .update({
      payment_intent_id: paymentIntentId,
      payment_status: "pending",
    })
    .eq("id", offer_id);

  return NextResponse.json({
    client_secret: clientSecret,
    payment_intent_id: paymentIntentId,
  });
}
