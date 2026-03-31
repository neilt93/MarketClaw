import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import { formatPrice } from "@declutter/shared";

export const getListingSchema = {
  listing_id: z.string().uuid().describe("The listing UUID"),
};

export async function getListing({ listing_id }: { listing_id: string }) {
  const { data, error } = await supabase
    .from("listings")
    .select("*, items(name, brand, model_number, purchase_price, purchase_date, retailer)")
    .eq("id", listing_id)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return {
      content: [{ type: "text" as const, text: "Listing not found or not active." }],
      isError: true,
    };
  }

  const item = Array.isArray(data.items) ? data.items[0] : data.items;

  const details = {
    title: data.title,
    description: data.description,
    price: formatPrice(data.asking_price),
    condition: data.condition,
    category: data.category,
    ...(item && {
      original_price: item.purchase_price
        ? formatPrice(item.purchase_price)
        : null,
      purchase_date: item.purchase_date,
      brand: item.brand,
      model: item.model_number,
      retailer: item.retailer,
    }),
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(details, null, 2),
      },
    ],
  };
}
