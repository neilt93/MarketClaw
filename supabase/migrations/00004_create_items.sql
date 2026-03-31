CREATE TABLE public.items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id      UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    brand           TEXT,
    model_number    TEXT,
    category        TEXT NOT NULL,
    purchase_price  INTEGER,          -- cents
    quantity        INTEGER NOT NULL DEFAULT 1,
    purchase_date   DATE,
    retailer        TEXT,
    raw_extraction  JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER items_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
