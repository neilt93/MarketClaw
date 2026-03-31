import Anthropic from "@anthropic-ai/sdk";
import { type ReceiptExtraction, receiptExtractionSchema } from "@declutter/shared";
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
