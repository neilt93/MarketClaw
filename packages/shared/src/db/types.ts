// Auto-generated types will go here via `supabase gen types typescript`
// For now, define the core types manually to unblock development.

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  gmail_connected: boolean;
  gmail_refresh_token: string | null;
  gmail_last_sync: string | null;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: string;
  user_id: string;
  source: "gmail" | "manual";
  source_message_id: string | null;
  subject: string | null;
  sender_email: string | null;
  raw_text: string | null;
  status: "pending" | "parsing" | "parsed" | "failed";
  parsed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  receipt_id: string;
  user_id: string;
  name: string;
  brand: string | null;
  model_number: string | null;
  category: string;
  purchase_price: number | null; // cents
  quantity: number;
  purchase_date: string | null;
  retailer: string | null;
  raw_extraction: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  item_id: string | null;
  title: string;
  description: string;
  category: string | null;
  condition: string;
  asking_price: number; // cents
  currency: string;
  image_urls: string[] | null;
  ebay_avg_price: number | null;
  ebay_comps: Record<string, unknown> | null;
  embedding: number[] | null;
  status: "draft" | "active" | "sold" | "expired" | "withdrawn";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  listing_id: string;
  seller_id: string;
  buyer_name: string | null;
  buyer_email: string;
  amount: number; // cents
  message: string | null;
  status: "pending" | "accepted" | "rejected" | "expired" | "withdrawn";
  responded_at: string | null;
  seller_message: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  search_query: string;
  amazon_asin: string;
  amazon_url: string;
  amazon_title: string | null;
  amazon_price: number | null; // cents
  agent_id: string | null;
  clicked_at: string;
}
