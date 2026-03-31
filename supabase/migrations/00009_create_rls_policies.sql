-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Users: own profile only
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Receipts: private to owner
CREATE POLICY "Users can manage own receipts"
    ON public.receipts FOR ALL
    USING (auth.uid() = user_id);

-- Items: private to owner
CREATE POLICY "Users can manage own items"
    ON public.items FOR ALL
    USING (auth.uid() = user_id);

-- Listings: owner full access + public read for active
CREATE POLICY "Users can manage own listings"
    ON public.listings FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Active listings are publicly readable"
    ON public.listings FOR SELECT
    USING (status = 'active');

-- Offers: seller can read/update their offers
-- INSERT is done via service_role from MCP server (bypasses RLS)
CREATE POLICY "Sellers can view offers on their listings"
    ON public.offers FOR SELECT
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update offers on their listings"
    ON public.offers FOR UPDATE
    USING (auth.uid() = seller_id);

-- Affiliate clicks: service_role only (MCP server inserts, no user access needed)
