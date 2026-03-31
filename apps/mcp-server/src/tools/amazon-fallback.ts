import { z } from "zod";
import { searchAmazon } from "../lib/amazon.js";
import { supabase } from "../lib/supabase.js";

export const amazonFallbackSchema = {
  query: z.string().describe("Product search query"),
  category: z
    .string()
    .optional()
    .describe("Amazon search category, e.g. 'Electronics'"),
};

export async function amazonFallback({
  query,
  category,
}: {
  query: string;
  category?: string;
}) {
  const results = await searchAmazon(query, category);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No Amazon results found for "${query}". The Amazon integration is pending API approval.`,
        },
      ],
    };
  }

  // Track affiliate clicks
  for (const result of results) {
    await supabase.from("affiliate_clicks").insert({
      search_query: query,
      amazon_asin: result.asin,
      amazon_url: result.url,
      amazon_title: result.title,
      amazon_price: result.price,
    });
  }

  const formatted = results
    .map(
      (r, i) =>
        `${i + 1}. **${r.title}**\n   $${(r.price / 100).toFixed(2)}${r.primeEligible ? " (Prime)" : ""}\n   ${r.url}`,
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `Amazon results for "${query}":\n\n${formatted}`,
      },
    ],
  };
}
