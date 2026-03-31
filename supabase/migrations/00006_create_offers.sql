CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'expired', 'withdrawn');

CREATE TABLE public.offers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id      UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    seller_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    buyer_name      TEXT,
    buyer_email     TEXT NOT NULL,

    amount          INTEGER NOT NULL,      -- cents
    currency        TEXT NOT NULL DEFAULT 'USD',
    message         TEXT,

    status          offer_status NOT NULL DEFAULT 'pending',
    responded_at    TIMESTAMPTZ,
    seller_message  TEXT,

    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER offers_updated_at
    BEFORE UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
