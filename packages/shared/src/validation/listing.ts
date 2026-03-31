import { z } from "zod";

export const createListingSchema = z.object({
  item_id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string().optional(),
  condition: z.enum(["like_new", "very_good", "good", "acceptable"]),
  asking_price: z.number().int().positive(), // cents
  currency: z.string().default("USD"),
  image_urls: z.array(z.string().url()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const approveListingsSchema = z.object({
  listing_ids: z.array(z.string().uuid()).min(1),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
