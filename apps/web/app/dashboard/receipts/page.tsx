"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@declutter/shared";

interface ReceiptRow {
  id: string;
  subject: string | null;
  sender_email: string | null;
  status: string;
  created_at: string;
  items: ItemRow[];
}

interface ItemRow {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  purchase_price: number | null;
  retailer: string | null;
  purchase_date: string | null;
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const supabase = createClient();

  const loadReceipts = useCallback(async () => {
    const { data } = await supabase
      .from("receipts")
      .select("*, items(*)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (data) setReceipts(data as ReceiptRow[]);
  }, [supabase]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/gmail/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(
          `Found ${data.total_found} emails, ${data.new_receipts} new receipts added.`,
        );
        await loadReceipts();
      } else {
        setSyncResult(`Error: ${data.error}`);
      }
    } catch {
      setSyncResult("Failed to sync. Please try again.");
    }
    setSyncing(false);
  };

  const handleParseAll = async () => {
    const pendingIds = receipts
      .filter((r) => r.status === "pending")
      .map((r) => r.id);

    if (pendingIds.length === 0) return;

    setParsing(true);
    try {
      const res = await fetch("/api/receipts/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_ids: pendingIds }),
      });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(
          `Parsed ${data.parsed} receipts. Found ${data.items_found} items (${data.resalable_items} resalable).`,
        );
        await loadReceipts();
      }
    } catch {
      setSyncResult("Failed to parse receipts.");
    }
    setParsing(false);
  };

  const pendingCount = receipts.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <div className="flex gap-3">
          {pendingCount > 0 && (
            <button
              onClick={handleParseAll}
              disabled={parsing}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {parsing
                ? "Parsing..."
                : `Parse ${pendingCount} Pending`}
            </button>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {syncing ? "Scanning Gmail..." : "Sync Receipts"}
          </button>
        </div>
      </div>

      {syncResult && (
        <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {syncResult}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {receipts.length === 0 ? (
          <p className="text-gray-500">
            No receipts yet. Click &quot;Sync Receipts&quot; to scan your Gmail.
          </p>
        ) : (
          receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {receipt.subject ?? "No subject"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {receipt.sender_email}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    receipt.status === "parsed"
                      ? "bg-green-100 text-green-700"
                      : receipt.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : receipt.status === "parsing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {receipt.status}
                </span>
              </div>

              {receipt.items.length > 0 && (
                <div className="mt-3 border-t pt-3">
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Extracted Items
                  </p>
                  <div className="mt-2 space-y-1">
                    {receipt.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.name}
                          {item.brand && (
                            <span className="text-gray-400">
                              {" "}
                              ({item.brand})
                            </span>
                          )}
                        </span>
                        <span className="text-gray-600">
                          {item.purchase_price
                            ? formatPrice(item.purchase_price)
                            : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
