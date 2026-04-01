"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, isResalable, CATEGORY_LABELS } from "@declutter/shared";

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
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "info" | "success" | "error";
  } | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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
    setMessage(null);
    try {
      const res = await fetch("/api/gmail/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          text: `Found ${data.total_found} emails, ${data.new_receipts} new receipts added.`,
          type: "success",
        });
        await loadReceipts();
      } else {
        setMessage({ text: `Error: ${data.error}`, type: "error" });
      }
    } catch {
      setMessage({ text: "Failed to sync. Please try again.", type: "error" });
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
        setMessage({
          text: `Parsed ${data.parsed} receipts. Found ${data.items_found} items (${data.resalable_items} resalable).`,
          type: "success",
        });
        await loadReceipts();
      }
    } catch {
      setMessage({ text: "Failed to parse receipts.", type: "error" });
    }
    setParsing(false);
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const selectAllResalable = () => {
    const allResalable = receipts
      .flatMap((r) => r.items)
      .filter((item) => isResalable(item.category))
      .map((item) => item.id);
    setSelectedItems(new Set(allResalable));
  };

  const handleGenerateListings = async () => {
    if (selectedItems.size === 0) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/listings/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_ids: Array.from(selectedItems) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          text: `Generated ${data.generated} draft listings! Go to Listings > Review to approve them.`,
          type: "success",
        });
        setSelectedItems(new Set());
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch {
      setMessage({
        text: "Failed to generate listings.",
        type: "error",
      });
    }
    setGenerating(false);
  };

  const pendingCount = receipts.filter((r) => r.status === "pending").length;
  const resalableItemCount = receipts
    .flatMap((r) => r.items)
    .filter((item) => isResalable(item.category)).length;

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
              {parsing ? "Parsing..." : `Parse ${pendingCount} Pending`}
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

      {message && (
        <p
          className={`mt-4 rounded-lg p-3 text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Listing generation bar */}
      {resalableItemCount > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <span className="text-sm text-indigo-700">
            {selectedItems.size} of {resalableItemCount} resalable items
            selected
          </span>
          <button
            onClick={selectAllResalable}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Select All
          </button>
          <button
            onClick={() => setSelectedItems(new Set())}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
          <div className="flex-1" />
          <button
            onClick={handleGenerateListings}
            disabled={selectedItems.size === 0 || generating}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating
              ? "Generating..."
              : `Generate ${selectedItems.size} Listings`}
          </button>
        </div>
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
                    {receipt.sender_email} &middot;{" "}
                    {new Date(receipt.created_at).toLocaleDateString()}
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
                  <div className="mt-2 space-y-2">
                    {receipt.items.map((item) => {
                      const resalable = isResalable(item.category);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 text-sm ${!resalable ? "opacity-50" : ""}`}
                        >
                          {resalable && (
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItem(item.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          )}
                          <div className="flex flex-1 items-center justify-between">
                            <span>
                              {item.name}
                              {item.brand && (
                                <span className="text-gray-400">
                                  {" "}
                                  ({item.brand})
                                </span>
                              )}
                              <span className="ml-2 text-xs text-gray-400">
                                {CATEGORY_LABELS[item.category] ??
                                  item.category}
                              </span>
                            </span>
                            <span className="text-gray-600">
                              {item.purchase_price
                                ? formatPrice(item.purchase_price)
                                : "—"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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
