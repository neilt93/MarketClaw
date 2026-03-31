import { createClient } from "@supabase/supabase-js";

// MCP server uses service_role key to bypass RLS
// This is intentional: buyer agents are unauthenticated
export const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
