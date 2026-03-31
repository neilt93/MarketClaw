import { ItemCategory } from "../db/enums.js";

export const RESALABLE_CATEGORIES = new Set<string>([
  ItemCategory.ELECTRONICS,
  ItemCategory.APPLIANCES,
  ItemCategory.FURNITURE,
  ItemCategory.HOME_IMPROVEMENT,
  ItemCategory.SPORTS_EQUIPMENT,
  ItemCategory.TOOLS,
  ItemCategory.TOYS_GAMES,
  ItemCategory.MUSICAL_INSTRUMENTS,
  ItemCategory.OUTDOOR,
  ItemCategory.OFFICE,
  ItemCategory.OTHER_RESALABLE,
]);

export const NON_RESALABLE_CATEGORIES = new Set<string>([
  ItemCategory.FOOD_GROCERY,
  ItemCategory.SUBSCRIPTION,
  ItemCategory.SERVICE,
  ItemCategory.DIGITAL_DOWNLOAD,
  ItemCategory.CLOTHING_APPAREL,
  ItemCategory.CONSUMABLE,
  ItemCategory.NON_RESALABLE_OTHER,
]);

export function isResalable(category: string): boolean {
  return RESALABLE_CATEGORIES.has(category);
}

export const CATEGORY_LABELS: Record<string, string> = {
  [ItemCategory.ELECTRONICS]: "Electronics",
  [ItemCategory.APPLIANCES]: "Appliances",
  [ItemCategory.FURNITURE]: "Furniture",
  [ItemCategory.HOME_IMPROVEMENT]: "Home Improvement",
  [ItemCategory.SPORTS_EQUIPMENT]: "Sports & Equipment",
  [ItemCategory.TOOLS]: "Tools",
  [ItemCategory.TOYS_GAMES]: "Toys & Games",
  [ItemCategory.MUSICAL_INSTRUMENTS]: "Musical Instruments",
  [ItemCategory.OUTDOOR]: "Outdoor",
  [ItemCategory.OFFICE]: "Office",
  [ItemCategory.OTHER_RESALABLE]: "Other",
};
