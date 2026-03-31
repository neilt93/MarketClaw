-- Hybrid search combining vector similarity and trigram text matching
-- Uses Reciprocal Rank Fusion (RRF) to merge the two ranking signals
CREATE OR REPLACE FUNCTION match_listings(
    query_text TEXT,
    query_embedding vector(1536),
    match_count INT DEFAULT 20,
    filter_category TEXT DEFAULT NULL,
    filter_max_price INTEGER DEFAULT NULL,
    full_text_weight FLOAT DEFAULT 1.0,
    semantic_weight FLOAT DEFAULT 1.0,
    rrf_k INT DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    condition TEXT,
    asking_price INTEGER,
    currency TEXT,
    image_urls TEXT[],
    user_id UUID,
    similarity_score FLOAT,
    created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE
AS $$
WITH filtered AS (
    SELECT l.*
    FROM public.listings l
    WHERE l.status = 'active'
        AND l.embedding IS NOT NULL
        AND (filter_category IS NULL OR l.category ILIKE '%' || filter_category || '%')
        AND (filter_max_price IS NULL OR l.asking_price <= filter_max_price)
),
full_text AS (
    SELECT
        f.id,
        ROW_NUMBER() OVER (
            ORDER BY similarity(f.search_text, query_text) DESC
        ) AS rank_ix
    FROM filtered f
    WHERE f.search_text % query_text
    LIMIT match_count * 2
),
semantic AS (
    SELECT
        f.id,
        ROW_NUMBER() OVER (
            ORDER BY f.embedding <=> query_embedding
        ) AS rank_ix
    FROM filtered f
    ORDER BY rank_ix
    LIMIT match_count * 2
)
SELECT
    f.id,
    f.title,
    f.description,
    f.category,
    f.condition,
    f.asking_price,
    f.currency,
    f.image_urls,
    f.user_id,
    (
        COALESCE(1.0 / (rrf_k + ft.rank_ix), 0.0) * full_text_weight +
        COALESCE(1.0 / (rrf_k + sem.rank_ix), 0.0) * semantic_weight
    ) AS similarity_score,
    f.created_at
FROM full_text ft
FULL OUTER JOIN semantic sem ON ft.id = sem.id
JOIN filtered f ON COALESCE(ft.id, sem.id) = f.id
ORDER BY similarity_score DESC
LIMIT match_count;
$$;
