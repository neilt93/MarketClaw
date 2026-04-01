"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  email: string;
  full_name: string | null;
  gmail_connected: boolean;
  gmail_last_sync: string | null;
  stripe_connect_onboarded: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select(
          "email, full_name, gmail_connected, gmail_last_sync, stripe_connect_onboarded",
        )
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    }
    load();

    // Check for Stripe redirect params
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe") === "success") {
      setStripeStatus("Stripe account connected successfully!");
      // Refresh status
      refreshStripeStatus();
      window.history.replaceState({}, "", "/dashboard/settings");
    } else if (params.get("stripe") === "refresh") {
      setStripeStatus(
        "Stripe onboarding incomplete. Please try again.",
      );
      window.history.replaceState({}, "", "/dashboard/settings");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshStripeStatus = async () => {
    const res = await fetch("/api/stripe/connect");
    const data = await res.json();
    if (data.status === "onboarded") {
      setProfile((prev) =>
        prev ? { ...prev, stripe_connect_onboarded: true } : prev,
      );
    }
  };

  const handleStripeConnect = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();

      if (data.status === "onboarded") {
        setStripeStatus("Stripe already connected!");
        setProfile((prev) =>
          prev ? { ...prev, stripe_connect_onboarded: true } : prev,
        );
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setStripeStatus("Failed to connect Stripe. Try again.");
    }
    setStripeLoading(false);
  };

  const handleConnectGmail = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
        scopes: "https://www.googleapis.com/auth/gmail.readonly",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!profile) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>

      {stripeStatus && (
        <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {stripeStatus}
        </p>
      )}

      <div className="mt-6 space-y-6">
        {/* Account */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Account</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Email:</span> {profile.email}
            </p>
            <p>
              <span className="text-gray-500">Name:</span>{" "}
              {profile.full_name ?? "Not set"}
            </p>
          </div>
        </div>

        {/* Gmail Connection */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Gmail Connection</h2>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  {profile.gmail_connected ? (
                    <span className="text-green-600">Connected</span>
                  ) : (
                    <span className="text-gray-400">Not connected</span>
                  )}
                </p>
                {profile.gmail_last_sync && (
                  <p className="text-gray-400">
                    Last sync:{" "}
                    {new Date(profile.gmail_last_sync).toLocaleString()}
                  </p>
                )}
              </div>
              {!profile.gmail_connected && (
                <button
                  onClick={handleConnectGmail}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Connect Gmail
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stripe Payments */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Payments</h2>
          <p className="mt-1 text-sm text-gray-500">
            Connect Stripe to receive payments when buyers purchase your items.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              <p>
                <span className="text-gray-500">Status:</span>{" "}
                {profile.stripe_connect_onboarded ? (
                  <span className="text-green-600">
                    Connected &mdash; ready to receive payments
                  </span>
                ) : (
                  <span className="text-gray-400">Not set up</span>
                )}
              </p>
            </div>
            {!profile.stripe_connect_onboarded && (
              <button
                onClick={handleStripeConnect}
                disabled={stripeLoading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {stripeLoading ? "Setting up..." : "Connect Stripe"}
              </button>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
