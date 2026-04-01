import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createConnectAccount,
  createConnectOnboardingLink,
  isConnectOnboarded,
} from "@/lib/stripe";

// POST: Start or resume Stripe Connect onboarding for a seller
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_connect_id, stripe_connect_onboarded, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  let connectId = profile.stripe_connect_id;

  // Create Connect account if doesn't exist
  if (!connectId) {
    connectId = await createConnectAccount(profile.email);
    await supabase
      .from("users")
      .update({ stripe_connect_id: connectId })
      .eq("id", user.id);
  }

  // Check if already onboarded
  if (profile.stripe_connect_onboarded) {
    const stillOnboarded = await isConnectOnboarded(connectId);
    if (stillOnboarded) {
      return NextResponse.json({ status: "onboarded", connect_id: connectId });
    }
  }

  // Generate onboarding link
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const onboardingUrl = await createConnectOnboardingLink(
    connectId,
    `${appUrl}/dashboard/settings?stripe=success`,
    `${appUrl}/dashboard/settings?stripe=refresh`,
  );

  return NextResponse.json({ url: onboardingUrl });
}

// GET: Check Connect account status
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_connect_id, stripe_connect_onboarded")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_connect_id) {
    return NextResponse.json({ status: "not_connected" });
  }

  // Refresh onboarding status
  const onboarded = await isConnectOnboarded(profile.stripe_connect_id);

  if (onboarded !== profile.stripe_connect_onboarded) {
    await supabase
      .from("users")
      .update({ stripe_connect_onboarded: onboarded })
      .eq("id", user.id);
  }

  return NextResponse.json({
    status: onboarded ? "onboarded" : "pending",
    connect_id: profile.stripe_connect_id,
  });
}
