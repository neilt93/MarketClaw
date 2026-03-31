import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  searchListingsSchema,
  searchListings,
} from "./tools/search-listings.js";
import { getListingSchema, getListing } from "./tools/get-listing.js";
import { makeOfferSchema, makeOffer } from "./tools/make-offer.js";
import {
  amazonFallbackSchema,
  amazonFallback,
} from "./tools/amazon-fallback.js";

export function createServer() {
  const server = new McpServer({
    name: "declutter-marketplace",
    version: "0.1.0",
  });

  server.tool(
    "search_listings",
    "Search the Declutter marketplace for secondhand items. Returns listings ranked by relevance with prices and conditions. Use this first before searching Amazon.",
    searchListingsSchema,
    searchListings,
  );

  server.tool(
    "get_listing",
    "Get full details of a specific listing including original purchase info and seller details.",
    getListingSchema,
    getListing,
  );

  server.tool(
    "make_offer",
    "Make a purchase offer on a listing. The seller will be notified via email and can accept or reject. Offers expire after 48 hours.",
    makeOfferSchema,
    makeOffer,
  );

  server.tool(
    "search_amazon_fallback",
    "Search Amazon for items when no suitable secondhand listings are found on Declutter. Returns affiliate purchase links.",
    amazonFallbackSchema,
    amazonFallback,
  );

  return server;
}
