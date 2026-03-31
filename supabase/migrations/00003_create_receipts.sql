CREATE TYPE receipt_source AS ENUM ('gmail', 'manual');
CREATE TYPE receipt_status AS ENUM ('pending', 'parsing', 'parsed', 'failed');

CREATE TABLE public.receipts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source              receipt_source NOT NULL,
    source_message_id   TEXT,
    subject             TEXT,
    sender_email        TEXT,
    raw_text            TEXT,
    status              receipt_status NOT NULL DEFAULT 'pending',
    parsed_at           TIMESTAMPTZ,
    error_message       TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, source_message_id)
);

CREATE TRIGGER receipts_updated_at
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
