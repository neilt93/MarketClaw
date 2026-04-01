import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

// Stripe webhook handler
// Listens for payment_intent.succeeded and account.updated events
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook verification failed: ${message}` },
      { status: 400 },
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const offerId = paymentIntent.metadata.offer_id;

      if (offerId) {
        // Mark offer as paid
        await supabase
          .from("offers")
          .update({ payment_status: "paid" })
          .eq("id", offerId);

        // Mark listing as sold
        const { data: offer } = await supabase
          .from("offers")
          .select("listing_id")
          .eq("id", offerId)
          .single();

        if (offer) {
          await supabase
            .from("listings")
            .update({ status: "sold" })
            .eq("id", offer.listing_id);
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const offerId = paymentIntent.metadata.offer_id;

      if (offerId) {
        await supabase
          .from("offers")
          .update({ payment_status: "none" })
          .eq("id", offerId);
      }
      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;

      if (account.charges_enabled && account.payouts_enabled) {
        // Mark seller as onboarded
        await supabase
          .from("users")
          .update({ stripe_connect_onboarded: true })
          .eq("stripe_connect_id", account.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
