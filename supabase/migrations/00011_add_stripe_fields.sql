-- Add Stripe fields to users table
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
    ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT,
    ADD COLUMN IF NOT EXISTS stripe_connect_onboarded BOOLEAN NOT NULL DEFAULT FALSE;

-- Add payment tracking to offers
ALTER TABLE public.offers
    ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'none'
        CHECK (payment_status IN ('none', 'pending', 'paid', 'refunded'));

-- Index for Stripe lookups
CREATE INDEX IF NOT EXISTS users_stripe_customer_idx ON public.users (stripe_customer_id)
    WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS users_stripe_connect_idx ON public.users (stripe_connect_id)
    WHERE stripe_connect_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS offers_payment_intent_idx ON public.offers (payment_intent_id)
    WHERE payment_intent_id IS NOT NULL;
