CREATE TABLE public.affiliate_clicks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_query    TEXT NOT NULL,
    amazon_asin     TEXT NOT NULL,
    amazon_url      TEXT NOT NULL,
    amazon_title    TEXT,
    amazon_price    INTEGER,           -- cents
    agent_id        TEXT,
    clicked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
