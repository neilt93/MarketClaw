CREATE TYPE listing_status AS ENUM ('draft', 'active', 'sold', 'expired', 'withdrawn');

CREATE TABLE public.listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_id         UUID REFERENCES public.items(id) ON DELETE SET NULL,

    title           TEXT NOT NULL,
    description     TEXT NOT NULL,
    category        TEXT,
    condition       TEXT NOT NULL DEFAULT 'like_new',
    image_urls      TEXT[],

    asking_price    INTEGER NOT NULL,      -- cents
    currency        TEXT NOT NULL DEFAULT 'USD',

    ebay_avg_price  INTEGER,               -- cents
    ebay_comp_count INTEGER,
    ebay_comps      JSONB,

    embedding       vector(1536),

    search_text     TEXT GENERATED ALWAYS AS (
        title || ' ' || COALESCE(description, '') || ' ' || COALESCE(category, '')
    ) STORED,

    status          listing_status NOT NULL DEFAULT 'draft',
    published_at    TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
