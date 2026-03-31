import { z } from "zod";
import { ItemCategory } from "../db/enums.js";

const itemCategoryValues = Object.values(ItemCategory) as [string, ...string[]];

export const extractedItemSchema = z.object({
  item_name: z.string(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  category: z.enum(itemCategoryValues),
  price_paid: z.number().nullable(),
  quantity: z.number().int().default(1),
  condition_hint: z.enum(["new", "refurbished", "used", "unknown"]),
});

export const receiptExtractionSchema = z.object({
  is_receipt: z.boolean(),
  items: z.array(extractedItemSchema),
  retailer: z.string(),
  order_id: z.string().nullable(),
  purchase_date: z.string().nullable(),
  extraction_confidence: z.enum(["high", "medium", "low"]),
});

export type ExtractedItem = z.infer<typeof extractedItemSchema>;
export type ReceiptExtraction = z.infer<typeof receiptExtractionSchema>;
