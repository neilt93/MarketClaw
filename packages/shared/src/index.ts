// Database types
export type {
  User,
  Receipt,
  Item,
  Listing,
  Offer,
  AffiliateClick,
} from "./db/types.js";

// Enums
export {
  ReceiptSource,
  ReceiptStatus,
  ListingStatus,
  OfferStatus,
  ListingCondition,
  ItemCategory,
  ExtractionConfidence,
} from "./db/enums.js";

// Validation schemas
export {
  extractedItemSchema,
  receiptExtractionSchema,
  type ExtractedItem,
  type ReceiptExtraction,
} from "./validation/receipt.js";
export {
  createListingSchema,
  updateListingSchema,
  approveListingsSchema,
  type CreateListingInput,
  type UpdateListingInput,
} from "./validation/listing.js";
export {
  createOfferSchema,
  respondOfferSchema,
  type CreateOfferInput,
  type RespondOfferInput,
} from "./validation/offer.js";

// Utils
export {
  calculateDepreciatedValue,
  suggestPrice,
  formatPrice,
} from "./utils/pricing.js";
export {
  RESALABLE_CATEGORIES,
  NON_RESALABLE_CATEGORIES,
  isResalable,
  CATEGORY_LABELS,
} from "./utils/categories.js";
