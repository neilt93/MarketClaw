import { ItemCategory } from "../db/enums";

/** Annual depreciation rates by category (fraction per year) */
const DEPRECIATION_RATES: Record<string, number> = {
  [ItemCategory.ELECTRONICS]: 0.4,
  [ItemCategory.APPLIANCES]: 0.2,
  [ItemCategory.FURNITURE]: 0.15,
  [ItemCategory.HOME_IMPROVEMENT]: 0.15,
  [ItemCategory.SPORTS_EQUIPMENT]: 0.2,
  [ItemCategory.TOOLS]: 0.15,
  [ItemCategory.TOYS_GAMES]: 0.25,
  [ItemCategory.MUSICAL_INSTRUMENTS]: 0.1,
  [ItemCategory.OUTDOOR]: 0.2,
  [ItemCategory.OFFICE]: 0.3,
  [ItemCategory.OTHER_RESALABLE]: 0.25,
};

const DEFAULT_RATE = 0.25;
const MIN_VALUE_FRACTION = 0.1; // Floor at 10% of original price

/**
 * Calculate depreciated value using declining balance method.
 * Returns value in the same unit (cents) as pricePaid.
 */
export function calculateDepreciatedValue(
  pricePaidCents: number,
  purchaseDate: Date,
  category: string,
): number {
  const now = new Date();
  const yearsOwned =
    (now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  if (yearsOwned <= 0) return pricePaidCents;

  const rate = DEPRECIATION_RATES[category] ?? DEFAULT_RATE;
  const depreciatedValue = pricePaidCents * Math.pow(1 - rate, yearsOwned);

  return Math.max(
    Math.round(depreciatedValue),
    Math.round(pricePaidCents * MIN_VALUE_FRACTION),
  );
}

/**
 * Suggest a resale price combining eBay comps and depreciation.
 * All prices in cents.
 */
export function suggestPrice(
  pricePaidCents: number | null,
  purchaseDate: Date | null,
  category: string,
  ebayMedianCents: number | null,
  ebayCompCount: number,
): { suggestedPriceCents: number; method: string } {
  const depreciated =
    pricePaidCents != null && purchaseDate != null
      ? calculateDepreciatedValue(pricePaidCents, purchaseDate, category)
      : null;

  const ebayValid = ebayCompCount >= 3 && ebayMedianCents != null;

  if (depreciated != null && ebayValid) {
    // Weighted average: 60% eBay comps, 40% depreciation
    const suggested = Math.round(ebayMedianCents! * 0.6 + depreciated * 0.4);
    return { suggestedPriceCents: suggested, method: "hybrid" };
  }

  if (ebayValid) {
    // 15% discount since item is used
    return {
      suggestedPriceCents: Math.round(ebayMedianCents! * 0.85),
      method: "ebay_comps",
    };
  }

  if (depreciated != null) {
    return { suggestedPriceCents: depreciated, method: "depreciation" };
  }

  // Fallback: 50% of original price
  return {
    suggestedPriceCents: pricePaidCents
      ? Math.round(pricePaidCents * 0.5)
      : 0,
    method: "fallback",
  };
}

/** Format cents to dollar string */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
