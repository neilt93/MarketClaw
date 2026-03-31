import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import { generateQueryEmbedding } from "../lib/embeddings.js";
import { formatPrice } from "@declutter/shared";

export const searchListingsSchema = {
  query: z
    .string()
    .describe(
      'Natural language search query, e.g. "Sony noise cancelling headphones"',
    ),
  category: z
    .string()
    .optional()
    .describe("Filter by category, e.g. 'electronics'"),
  max_price: z
    .number()
    .optional()
    .describe("Maximum price in dollars"),
  limit: z
    .number()
    .min(1)
    .max(50)
    .default(10)
    .describe("Number of results to return"),
};

export async function searchListings({
  query,
  category,
  max_price,
  limit,
}: {
  query: string;
  category?: string;
  max_price?: number;
  limit: number;
}) {
  // Generate embedding for semantic search
  const queryEmbedding = await generateQueryEmbedding(query);

  // Call the hybrid search RPC function
  const { data: results, error } = await supabase.rpc("match_listings", {
    query_text: query,
    query_embedding: JSON.stringify(queryEmbedding),
    match_count: limit,
    filter_category: category ?? null,
    filter_max_price: max_price ? Math.round(max_price * 100) : null,
  });

  if (error) {
    return {
      content: [{ type: "text" as const, text: `Search failed: ${error.message}` }],
      isError: true,
    };
  }

  if (!results || results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No listings found for "${query}". Try broadening your search or check Amazon using the search_amazon_fallback tool.`,
        },
      ],
    };
  }

  const formatted = results
    .map(
      (r: {
        id: string;
        title: string;
        asking_price: number;
        condition: string;
        category: string | null;
        description: string;
      }, i: number) =>
        [
          `**${i + 1}. ${r.title}**`,
          `   Price: ${formatPrice(r.asking_price)} | Condition: ${r.condition} | Category: ${r.category ?? "N/A"}`,
          `   ${r.description.slice(0, 200)}${r.description.length > 200 ? "..." : ""}`,
          `   Listing ID: ${r.id}`,
        ].join("\n"),
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `Found ${results.length} listings for "${query}":\n\n${formatted}`,
      },
    ],
  };
}
