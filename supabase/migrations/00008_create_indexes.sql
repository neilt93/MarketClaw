-- Vector similarity search (HNSW)
CREATE INDEX listings_embedding_idx ON public.listings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Full-text trigram search on generated column
CREATE INDEX listings_search_text_trgm_idx ON public.listings
    USING gin (search_text gin_trgm_ops);

-- Active listings filter (most common query)
CREATE INDEX listings_status_active_idx ON public.listings (status)
    WHERE status = 'active';

-- User's listings
CREATE INDEX listings_user_id_idx ON public.listings (user_id);

-- Offers by listing
CREATE INDEX offers_listing_id_idx ON public.offers (listing_id);

-- Offers by seller + status (dashboard view)
CREATE INDEX offers_seller_id_status_idx ON public.offers (seller_id, status);

-- Receipts by user
CREATE INDEX receipts_user_id_idx ON public.receipts (user_id);

-- Items by receipt
CREATE INDEX items_receipt_id_idx ON public.items (receipt_id);

-- Affiliate clicks by date
CREATE INDEX affiliate_clicks_date_idx ON public.affiliate_clicks (clicked_at DESC);
