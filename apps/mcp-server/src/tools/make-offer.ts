import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import { sendOfferNotification } from "../lib/email.js";
import { formatPrice } from "@declutter/shared";

export const makeOfferSchema = {
  listing_id: z.string().uuid().describe("The listing UUID to make an offer on"),
  amount_dollars: z
    .number()
    .positive()
    .describe("Offer amount in dollars"),
  buyer_name: z.string().optional().describe("Buyer's name"),
  buyer_email: z
    .string()
    .email()
    .describe("Buyer's email (required for seller to respond)"),
  message: z
    .string()
    .max(1000)
    .optional()
    .describe("Optional message to the seller"),
};

export async function makeOffer({
  listing_id,
  amount_dollars,
  buyer_name,
  buyer_email,
  message,
}: {
  listing_id: string;
  amount_dollars: number;
  buyer_name?: string;
  buyer_email: string;
  message?: string;
}) {
  // Verify listing exists and is active
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, user_id, asking_price, title")
    .eq("id", listing_id)
    .eq("status", "active")
    .single();

  if (listingError || !listing) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Listing not found or no longer active.",
        },
      ],
      isError: true,
    };
  }

  const amountCents = Math.round(amount_dollars * 100);

  // Insert offer (service_role bypasses RLS)
  const { data: offer, error } = await supabase
    .from("offers")
    .insert({
      listing_id,
      seller_id: listing.user_id,
      buyer_name,
      buyer_email,
      amount: amountCents,
      message,
    })
    .select("id, status, expires_at")
    .single();

  if (error) {
    return {
      content: [
        { type: "text" as const, text: `Failed to create offer: ${error.message}` },
      ],
      isError: true,
    };
  }

  // Send email notification to seller
  const { data: seller } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", listing.user_id)
    .single();

  if (seller) {
    await sendOfferNotification({
      sellerEmail: seller.email,
      sellerName: seller.full_name ?? "there",
      listingTitle: listing.title,
      offerAmount: formatPrice(amountCents),
      buyerName: buyer_name ?? null,
      buyerEmail: buyer_email,
      message: message ?? null,
      offerId: offer.id,
    });
  }

  return {
    content: [
      {
        type: "text" as const,
        text: `Offer submitted successfully!\n\nOffer ID: ${offer.id}\nListing: ${listing.title}\nYour offer: $${amount_dollars.toFixed(2)} (asking: $${(listing.asking_price / 100).toFixed(2)})\nStatus: ${offer.status}\nExpires: ${offer.expires_at}\n\nThe seller has been notified via email. You'll receive a response at ${buyer_email}.`,
      },
    ],
  };
}
