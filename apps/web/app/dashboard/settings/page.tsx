"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  email: string;
  full_name: string | null;
  gmail_connected: boolean;
  gmail_last_sync: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("email, full_name, gmail_connected, gmail_last_sync")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    }
    load();
  }, [supabase]);

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

      <div className="mt-6 space-y-6">
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

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Gmail Connection</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Status:</span>{" "}
              {profile.gmail_connected ? (
                <span className="text-green-600">Connected</span>
              ) : (
                <span className="text-red-600">Not connected</span>
              )}
            </p>
            {profile.gmail_last_sync && (
              <p>
                <span className="text-gray-500">Last sync:</span>{" "}
                {new Date(profile.gmail_last_sync).toLocaleString()}
              </p>
            )}
          </div>
        </div>

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
