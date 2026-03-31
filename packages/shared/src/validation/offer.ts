import { z } from "zod";

export const createOfferSchema = z.object({
  listing_id: z.string().uuid(),
  amount: z.number().int().positive(), // cents
  buyer_name: z.string().optional(),
  buyer_email: z.string().email(),
  message: z.string().max(1000).optional(),
});

export const respondOfferSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
  seller_message: z.string().max(1000).optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
