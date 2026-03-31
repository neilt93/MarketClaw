-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;       -- pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- trigram indexes for fuzzy text search
CREATE EXTENSION IF NOT EXISTS moddatetime;  -- auto-update updated_at columns
