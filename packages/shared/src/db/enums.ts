export const ReceiptSource = {
  GMAIL: "gmail",
  MANUAL: "manual",
} as const;
export type ReceiptSource = (typeof ReceiptSource)[keyof typeof ReceiptSource];

export const ReceiptStatus = {
  PENDING: "pending",
  PARSING: "parsing",
  PARSED: "parsed",
  FAILED: "failed",
} as const;
export type ReceiptStatus = (typeof ReceiptStatus)[keyof typeof ReceiptStatus];

export const ListingStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  SOLD: "sold",
  EXPIRED: "expired",
  WITHDRAWN: "withdrawn",
} as const;
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

export const OfferStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EXPIRED: "expired",
  WITHDRAWN: "withdrawn",
} as const;
export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export const ListingCondition = {
  LIKE_NEW: "like_new",
  VERY_GOOD: "very_good",
  GOOD: "good",
  ACCEPTABLE: "acceptable",
} as const;
export type ListingCondition =
  (typeof ListingCondition)[keyof typeof ListingCondition];

export const ItemCategory = {
  ELECTRONICS: "electronics",
  APPLIANCES: "appliances",
  FURNITURE: "furniture",
  HOME_IMPROVEMENT: "home_improvement",
  SPORTS_EQUIPMENT: "sports_equipment",
  TOOLS: "tools",
  TOYS_GAMES: "toys_games",
  MUSICAL_INSTRUMENTS: "musical_instruments",
  OUTDOOR: "outdoor",
  OFFICE: "office",
  OTHER_RESALABLE: "other_resalable",
  FOOD_GROCERY: "food_grocery",
  SUBSCRIPTION: "subscription",
  SERVICE: "service",
  DIGITAL_DOWNLOAD: "digital_download",
  CLOTHING_APPAREL: "clothing_apparel",
  CONSUMABLE: "consumable",
  NON_RESALABLE_OTHER: "non_resalable_other",
} as const;
export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory];

export const ExtractionConfidence = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;
export type ExtractionConfidence =
  (typeof ExtractionConfidence)[keyof typeof ExtractionConfidence];
