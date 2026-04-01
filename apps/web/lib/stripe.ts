import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Create a Stripe customer for a new user.
 */
export async function getOrCreateCustomer(
  email: string,
  name: string | null,
  existingCustomerId: string | null,
): Promise<string> {
  if (existingCustomerId) return existingCustomerId;

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { source: "declutter" },
  });

  return customer.id;
}

/**
 * Create a Stripe Connect account for a seller.
 * Uses Express accounts for simpler onboarding.
 */
export async function createConnectAccount(
  email: string,
): Promise<string> {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { source: "declutter" },
  });

  return account.id;
}

/**
 * Generate an onboarding link for a seller's Connect account.
 */
export async function createConnectOnboardingLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string,
): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return link.url;
}

/**
 * Check if a Connect account has completed onboarding.
 */
export async function isConnectOnboarded(
  accountId: string,
): Promise<boolean> {
  const account = await stripe.accounts.retrieve(accountId);
  return account.charges_enabled && account.payouts_enabled;
}

/**
 * Create a PaymentIntent for an accepted offer.
 * Uses Stripe Connect destination charges so the seller gets paid directly.
 */
export async function createPaymentForOffer(params: {
  amountCents: number;
  currency: string;
  buyerEmail: string;
  sellerConnectId: string;
  listingTitle: string;
  offerId: string;
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  // Platform fee: 5% of transaction
  const platformFee = Math.round(params.amountCents * 0.05);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: params.currency,
    receipt_email: params.buyerEmail,
    description: `Declutter: ${params.listingTitle}`,
    metadata: {
      offer_id: params.offerId,
      listing_title: params.listingTitle,
    },
    application_fee_amount: platformFee,
    transfer_data: {
      destination: params.sellerConnectId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}
