// Database types
export type {
  User,
  Receipt,
  Item,
  Listing,
  Offer,
  AffiliateClick,
} from "./db/types";

// Enums
export {
  ReceiptSource,
  ReceiptStatus,
  ListingStatus,
  OfferStatus,
  ListingCondition,
  ItemCategory,
  ExtractionConfidence,
} from "./db/enums";

// Validation schemas
export {
  extractedItemSchema,
  receiptExtractionSchema,
  type ExtractedItem,
  type ReceiptExtraction,
} from "./validation/receipt";
export {
  createListingSchema,
  updateListingSchema,
  approveListingsSchema,
  type CreateListingInput,
  type UpdateListingInput,
} from "./validation/listing";
export {
  createOfferSchema,
  respondOfferSchema,
  type CreateOfferInput,
  type RespondOfferInput,
} from "./validation/offer";

// Utils
export {
  calculateDepreciatedValue,
  suggestPrice,
  formatPrice,
} from "./utils/pricing";
export {
  RESALABLE_CATEGORIES,
  NON_RESALABLE_CATEGORIES,
  isResalable,
  CATEGORY_LABELS,
} from "./utils/categories";
