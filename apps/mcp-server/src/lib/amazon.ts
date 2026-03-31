// Amazon Product Advertising API 5.0 client
// TODO: Implement when Amazon PA API credentials are approved

export interface AffiliateResult {
  asin: string;
  title: string;
  price: number; // cents
  url: string; // affiliate URL with tag
  imageUrl: string | null;
  rating: number | null;
  primeEligible: boolean;
}

export async function searchAmazon(
  _query: string,
  _category?: string,
): Promise<AffiliateResult[]> {
  // TODO: Implement Amazon PA API 5.0 SearchItems call
  // For now return empty results
  return [];
}
