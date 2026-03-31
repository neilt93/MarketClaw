import * as cheerio from "cheerio";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

/** Retailer detection patterns */
const RETAILER_PATTERNS: {
  retailer: string;
  domains: string[];
}[] = [
  { retailer: "Amazon", domains: ["amazon.com"] },
  { retailer: "Best Buy", domains: ["bestbuy.com"] },
  { retailer: "Target", domains: ["target.com"] },
  { retailer: "IKEA", domains: ["ikea.com"] },
  { retailer: "Apple", domains: ["apple.com", "email.apple.com"] },
  { retailer: "Costco", domains: ["costco.com"] },
  { retailer: "Home Depot", domains: ["homedepot.com"] },
  { retailer: "Walmart", domains: ["walmart.com"] },
  { retailer: "Wayfair", domains: ["wayfair.com", "email.wayfair.com"] },
  { retailer: "Nike", domains: ["nike.com"] },
];

export function detectRetailer(from: string): string {
  const fromLower = from.toLowerCase();
  for (const p of RETAILER_PATTERNS) {
    if (p.domains.some((d) => fromLower.includes(d))) return p.retailer;
  }
  return "Unknown";
}

/** Exchange a refresh token for a fresh access token */
export async function refreshGoogleToken(
  refreshToken: string,
): Promise<string> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to refresh Google token: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

interface GmailMessageStub {
  id: string;
  threadId: string;
}

interface GmailListResponse {
  messages?: GmailMessageStub[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
}

/** List purchase emails from the last N months */
export async function listPurchaseEmails(
  accessToken: string,
  afterDate: Date,
): Promise<GmailMessageStub[]> {
  const afterStr = `${afterDate.getFullYear()}/${String(afterDate.getMonth() + 1).padStart(2, "0")}/${String(afterDate.getDate()).padStart(2, "0")}`;
  const query = `category:purchases after:${afterStr}`;
  const messages: GmailMessageStub[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`${GMAIL_API_BASE}/messages`);
    url.searchParams.set("q", query);
    url.searchParams.set("maxResults", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Gmail API error: ${res.status} ${await res.text()}`);
    }

    const data: GmailListResponse = await res.json();
    if (data.messages) {
      messages.push(...data.messages);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return messages;
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailPayloadPart {
  mimeType: string;
  headers?: GmailHeader[];
  body?: { data?: string; size: number };
  parts?: GmailPayloadPart[];
}

interface GmailFullMessage {
  id: string;
  threadId: string;
  payload: GmailPayloadPart;
}

/** Fetch a single message with full content */
export async function getMessage(
  accessToken: string,
  messageId: string,
): Promise<GmailFullMessage> {
  const res = await fetch(`${GMAIL_API_BASE}/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Gmail API error: ${res.status}`);
  }

  return res.json();
}

/** Extract a header value from a Gmail message payload */
export function getHeader(
  payload: GmailPayloadPart,
  name: string,
): string | undefined {
  return payload.headers?.find(
    (h) => h.name.toLowerCase() === name.toLowerCase(),
  )?.value;
}

/** Recursively find the text/html body part and decode it */
function findHtmlBody(part: GmailPayloadPart): string | null {
  if (part.mimeType === "text/html" && part.body?.data) {
    return Buffer.from(part.body.data, "base64url").toString("utf-8");
  }
  if (part.parts) {
    for (const child of part.parts) {
      const result = findHtmlBody(child);
      if (result) return result;
    }
  }
  return null;
}

/** Recursively find text/plain body */
function findTextBody(part: GmailPayloadPart): string | null {
  if (part.mimeType === "text/plain" && part.body?.data) {
    return Buffer.from(part.body.data, "base64url").toString("utf-8");
  }
  if (part.parts) {
    for (const child of part.parts) {
      const result = findTextBody(child);
      if (result) return result;
    }
  }
  return null;
}

/** Strip HTML to clean text for LLM processing */
export function stripHtml(html: string): string {
  const $ = cheerio.load(html);

  // Remove noise
  $("script, style, img, head, meta, link, noscript").remove();

  // Convert tables to pipe-delimited text (important for receipts)
  $("table").each((_, table) => {
    $(table)
      .find("tr")
      .each((_, row) => {
        const cells = $(row)
          .find("td, th")
          .map((_, cell) => $(cell).text().trim())
          .get();
        $(row).replaceWith(cells.join(" | ") + "\n");
      });
  });

  let text = $("body").text();
  // Normalize whitespace
  text = text.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim();
  // Truncate to ~4000 chars
  return text.slice(0, 4000);
}

/** Extract readable text from a Gmail message */
export function extractEmailText(message: GmailFullMessage): string {
  const html = findHtmlBody(message.payload);
  if (html) return stripHtml(html);

  const text = findTextBody(message.payload);
  if (text) return text.slice(0, 4000);

  return "";
}

export interface ParsedEmail {
  messageId: string;
  subject: string;
  from: string;
  date: string;
  retailer: string;
  text: string;
}

/** Parse a Gmail message into a structured format for LLM extraction */
export function parseGmailMessage(message: GmailFullMessage): ParsedEmail {
  const from = getHeader(message.payload, "From") ?? "";
  const subject = getHeader(message.payload, "Subject") ?? "";
  const date = getHeader(message.payload, "Date") ?? "";
  const text = extractEmailText(message);
  const retailer = detectRetailer(from);

  return {
    messageId: message.id,
    subject,
    from,
    date,
    retailer,
    text,
  };
}
