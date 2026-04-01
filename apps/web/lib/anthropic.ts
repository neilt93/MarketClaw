import Anthropic from "@anthropic-ai/sdk";
import { type ReceiptExtraction, receiptExtractionSchema, formatPrice } from "@declutter/shared";
import type { ParsedEmail } from "./gmail";

const anthropic = new Anthropic();

const EXTRACTION_SYSTEM_PROMPT = `You are a purchase receipt data extractor. Given the text content of an email receipt or order confirmation, extract all purchased items with their details.

Rules:
1. Only extract if this is genuinely a purchase receipt or order confirmation. Set is_receipt=false for shipping updates, return confirmations, marketing emails, wishlists, or promotional offers.
2. Extract EVERY item in a multi-item order as separate entries in the items array.
3. For category, classify based on the item itself:
   - "electronics": phones, laptops, tablets, TVs, headphones, cameras, gaming consoles, smart home devices
   - "appliances": kitchen appliances, washers, dryers, vacuums, air purifiers
   - "furniture": tables, chairs, sofas, beds, shelving, desks
   - "home_improvement": fixtures, hardware, paint, plumbing, electrical supplies
   - "sports_equipment": exercise equipment, bikes, weights, outdoor gear
   - "tools": power tools, hand tools, tool sets
   - "toys_games": board games, video games (physical), toys, puzzles
   - "musical_instruments": guitars, keyboards, drums, accessories
   - "outdoor": grills, patio furniture, garden equipment, lawn mowers
   - "office": monitors, printers, office chairs, desks
   - "food_grocery": any food, beverages, groceries, supplements
   - "subscription": recurring services, memberships, subscriptions
   - "service": installations, repairs, warranties, insurance
   - "digital_download": apps, ebooks, digital music, software licenses
   - "clothing_apparel": shoes, clothing, accessories, jewelry, watches
   - "consumable": batteries, ink cartridges, cleaning supplies
   - "other_resalable": anything physical and resalable not fitting above categories
   - "non_resalable_other": anything that cannot be resold
4. For price_paid, use the per-item price in USD (not total with tax/shipping). If only a total is visible for multiple items, set null.
5. Parse dates into YYYY-MM-DD format. If only a relative date is visible, set null.
6. Set extraction_confidence to "low" if the email is ambiguous or you are guessing at fields.`;

const EXTRACTION_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    is_receipt: {
      type: "boolean" as const,
      description:
        "Whether this email is actually a purchase receipt/order confirmation",
    },
    items: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          item_name: { type: "string" as const },
          brand: { type: ["string", "null"] as const },
          model: { type: ["string", "null"] as const },
          category: {
            type: "string" as const,
            enum: [
              "electronics",
              "appliances",
              "furniture",
              "home_improvement",
              "sports_equipment",
              "tools",
              "toys_games",
              "musical_instruments",
              "outdoor",
              "office",
              "other_resalable",
              "food_grocery",
              "subscription",
              "service",
              "digital_download",
              "clothing_apparel",
              "consumable",
              "non_resalable_other",
            ],
          },
          price_paid: {
            type: ["number", "null"] as const,
            description: "Price in USD",
          },
          quantity: { type: "integer" as const },
          condition_hint: {
            type: "string" as const,
            enum: ["new", "refurbished", "used", "unknown"],
          },
        },
        required: [
          "item_name",
          "category",
          "quantity",
          "condition_hint",
        ] as const,
        additionalProperties: false,
      },
    },
    retailer: { type: "string" as const },
    order_id: { type: ["string", "null"] as const },
    purchase_date: {
      type: ["string", "null"] as const,
      description: "YYYY-MM-DD format",
    },
    extraction_confidence: {
      type: "string" as const,
      enum: ["high", "medium", "low"],
    },
  },
  required: [
    "is_receipt",
    "items",
    "retailer",
    "extraction_confidence",
  ] as const,
  additionalProperties: false,
};

/** Extract structured item data from a receipt email using Claude */
export async function extractReceiptData(
  email: ParsedEmail,
): Promise<ReceiptExtraction | null> {
  const userMessage = `Retailer hint: ${email.retailer}
Email subject: ${email.subject}
Email date: ${email.date}

--- EMAIL CONTENT ---
${email.text}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 2048,
        system: EXTRACTION_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") return null;

      // Parse and validate with Zod
      const parsed = JSON.parse(textBlock.text);
      const result = receiptExtractionSchema.parse(parsed);

      // Skip low-confidence non-receipts
      if (!result.is_receipt && result.extraction_confidence === "low") {
        return null;
      }

      return result;
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 429 || status === 529) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw err;
    }
  }

  return null;
}

// --- Listing Generation ---

const LISTING_SYSTEM_PROMPT = `You are a marketplace listing copywriter. Given item details and pricing data, generate a compelling resale listing.

Rules:
1. Title: max 80 characters. Include brand, model, and key spec. Capitalize key words, no filler.
2. Description: 2-3 short paragraphs. Mention original retail context, key features, and a condition disclaimer based on age.
3. For condition, infer from age and category:
   - Items < 6 months old: "like_new"
   - Items 6-18 months: "very_good"
   - Items 18-36 months: "good"
   - Items > 36 months: "acceptable"
4. Never fabricate specs not present in the input data.
5. Include a brief "What's included" note if relevant (e.g., "Original packaging not guaranteed").
6. Keep the tone friendly and honest — no hype or fake urgency.`;

export interface ListingGenerationInput {
  itemName: string;
  brand: string | null;
  model: string | null;
  category: string;
  purchasePriceCents: number | null;
  purchaseDate: string | null;
  retailer: string | null;
  suggestedPriceCents: number;
  ebayMedianCents: number | null;
  ebayCompCount: number;
}

export interface GeneratedListing {
  title: string;
  description: string;
  condition: string;
}

export async function generateListingCopy(
  input: ListingGenerationInput,
): Promise<GeneratedListing> {
  const userMessage = `Generate a resale listing for this item:

Item: ${input.itemName}
Brand: ${input.brand ?? "Unknown"}
Model: ${input.model ?? "N/A"}
Category: ${input.category}
Original price: ${input.purchasePriceCents ? formatPrice(input.purchasePriceCents) : "Unknown"}
Purchase date: ${input.purchaseDate ?? "Unknown"}
Retailer: ${input.retailer ?? "Unknown"}
Suggested resale price: ${formatPrice(input.suggestedPriceCents)}
eBay comparable median: ${input.ebayMedianCents ? formatPrice(input.ebayMedianCents) : "No data"} (${input.ebayCompCount} active listings found)

Respond with exactly this JSON format:
{"title": "...", "description": "...", "condition": "like_new|very_good|good|acceptable"}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 1024,
        system: LISTING_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text in response");
      }

      // Extract JSON from response (handles markdown code blocks too)
      let jsonStr = textBlock.text;
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const parsed = JSON.parse(jsonStr);

      return {
        title: String(parsed.title).slice(0, 200),
        description: String(parsed.description),
        condition: ["like_new", "very_good", "good", "acceptable"].includes(
          parsed.condition,
        )
          ? parsed.condition
          : "good",
      };
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 429 || status === 529) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      if (attempt === 2) {
        // Fallback: generate a basic listing ourselves
        return {
          title: [input.brand, input.model, input.itemName]
            .filter(Boolean)
            .join(" ")
            .slice(0, 80),
          description: `${input.itemName} originally purchased${input.retailer ? ` from ${input.retailer}` : ""}${input.purchaseDate ? ` on ${input.purchaseDate}` : ""}. In good condition and ready for a new home.`,
          condition: "good",
        };
      }
    }
  }

  // Should not reach here, but fallback
  return {
    title: input.itemName.slice(0, 80),
    description: input.itemName,
    condition: "good",
  };
}
