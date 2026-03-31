import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Store the Gmail refresh token for background sync
  const providerRefreshToken = data.session.provider_refresh_token;
  if (providerRefreshToken) {
    await supabase
      .from("users")
      .update({
        gmail_connected: true,
        gmail_refresh_token: providerRefreshToken,
      })
      .eq("id", data.session.user.id);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
