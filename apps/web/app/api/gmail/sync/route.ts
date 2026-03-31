import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  refreshGoogleToken,
  listPurchaseEmails,
  getMessage,
  parseGmailMessage,
} from "@/lib/gmail";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's Gmail refresh token
  const { data: profile } = await supabase
    .from("users")
    .select("gmail_refresh_token, gmail_last_sync")
    .eq("id", user.id)
    .single();

  if (!profile?.gmail_refresh_token) {
    return NextResponse.json(
      { error: "Gmail not connected. Please reconnect your Google account." },
      { status: 400 },
    );
  }

  // Get a fresh access token
  const accessToken = await refreshGoogleToken(profile.gmail_refresh_token);

  // Scan last 12 months
  const afterDate = new Date();
  afterDate.setMonth(afterDate.getMonth() - 12);

  // List all purchase emails
  const messageStubs = await listPurchaseEmails(accessToken, afterDate);

  // Get existing message IDs to avoid re-processing
  const { data: existingReceipts } = await supabase
    .from("receipts")
    .select("source_message_id")
    .eq("user_id", user.id);

  const existingIds = new Set(
    existingReceipts?.map((r) => r.source_message_id) ?? [],
  );
  const newStubs = messageStubs.filter((s) => !existingIds.has(s.id));

  // Process in batches of 10
  let processed = 0;
  const batchSize = 10;

  for (let i = 0; i < newStubs.length; i += batchSize) {
    const batch = newStubs.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map(async (stub) => {
        const fullMessage = await getMessage(accessToken, stub.id);
        const parsed = parseGmailMessage(fullMessage);

        // Skip emails with no extractable text
        if (!parsed.text.trim()) return null;

        // Insert receipt into database
        const { error } = await supabase.from("receipts").insert({
          user_id: user.id,
          source: "gmail",
          source_message_id: parsed.messageId,
          subject: parsed.subject,
          sender_email: parsed.from,
          raw_text: parsed.text,
          status: "pending",
        });

        if (error) {
          // Duplicate check — skip if already exists
          if (error.code === "23505") return null;
          throw error;
        }

        return parsed.messageId;
      }),
    );

    processed += results.filter(
      (r) => r.status === "fulfilled" && r.value !== null,
    ).length;

    // Small delay between batches
    if (i + batchSize < newStubs.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Update last sync time
  await supabase
    .from("users")
    .update({ gmail_last_sync: new Date().toISOString() })
    .eq("id", user.id);

  return NextResponse.json({
    total_found: messageStubs.length,
    new_receipts: processed,
    already_synced: messageStubs.length - newStubs.length,
  });
}
