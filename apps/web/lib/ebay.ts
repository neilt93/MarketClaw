// eBay Browse API integration for price comparisons

const EBAY_TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const EBAY_SEARCH_URL =
  "https://api.ebay.com/buy/browse/v1/item_summary/search";

interface EbayComp {
  title: string;
  price: number; // cents
  condition: string;
  url: string;
}

interface EbayCompResult {
  median: number; // cents
  low: number;
  high: number;
  count: number;
  comps: EbayComp[];
}

async function getEbayAppToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(EBAY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });

  const data = await res.json();
  return data.access_token;
}

export async function getEbayPriceComps(
  itemName: string,
  brand: string | null,
  model: string | null,
): Promise<EbayCompResult> {
  const query = [brand, model, itemName]
    .filter(Boolean)
    .join(" ")
    .slice(0, 200);

  const token = await getEbayAppToken();

  const url = new URL(EBAY_SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("filter", "buyingOptions:{FIXED_PRICE}");
  url.searchParams.set("sort", "price");
  url.searchParams.set("limit", "50");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });

  if (!res.ok) {
    return { median: 0, low: 0, high: 0, count: 0, comps: [] };
  }

  const data = await res.json();
  const items = data.itemSummaries || [];

  const comps: EbayComp[] = items.map(
    (item: {
      title: string;
      price?: { value?: string };
      condition?: string;
      itemWebUrl?: string;
    }) => ({
      title: item.title,
      price: Math.round(parseFloat(item.price?.value || "0") * 100),
      condition: item.condition || "unknown",
      url: item.itemWebUrl || "",
    }),
  );

  const prices = comps.map((c) => c.price).filter((p) => p > 0).sort((a, b) => a - b);

  if (prices.length === 0) {
    return { median: 0, low: 0, high: 0, count: 0, comps: [] };
  }

  const mid = Math.floor(prices.length / 2);
  const median =
    prices.length % 2 !== 0
      ? prices[mid]!
      : Math.round((prices[mid - 1]! + prices[mid]!) / 2);

  return {
    median,
    low: prices[0]!,
    high: prices[prices.length - 1]!,
    count: prices.length,
    comps: comps.slice(0, 10), // Keep top 10 for storage
  };
}
