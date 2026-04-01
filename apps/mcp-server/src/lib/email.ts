const POSTMARK_API_URL = "https://api.postmarkapp.com/email";

export async function sendOfferNotification(params: {
  sellerEmail: string;
  sellerName: string;
  listingTitle: string;
  offerAmount: string;
  buyerName: string | null;
  buyerEmail: string;
  message: string | null;
  offerId: string;
}): Promise<boolean> {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    console.error("POSTMARK_SERVER_TOKEN not set — skipping offer notification");
    return false;
  }

  const fromEmail = process.env.POSTMARK_FROM_EMAIL ?? "noreply@declutter.so";
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const inboundDomain =
    process.env.POSTMARK_INBOUND_DOMAIN ?? "inbound.declutter.so";
  const buyerDisplay = params.buyerName ?? params.buyerEmail;

  const acceptUrl = `${appUrl}/dashboard/offers?action=accept&id=${params.offerId}`;
  const rejectUrl = `${appUrl}/dashboard/offers?action=reject&id=${params.offerId}`;
  const replyTo = `offer-${params.offerId}@${inboundDomain}`;

  const textBody = `Hi ${params.sellerName},

You have a new offer on "${params.listingTitle}"!

Offer: ${params.offerAmount} from ${buyerDisplay}
${params.message ? `Message: "${params.message}"` : ""}

To accept, reply to this email with "ACCEPT" or visit:
${acceptUrl}

To decline, reply with "DECLINE" or visit:
${rejectUrl}

This offer expires in 48 hours.

— Declutter`;

  const htmlBody = `
<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
  <h2 style="margin-bottom: 4px;">New offer on your listing</h2>
  <p style="color: #666; margin-top: 0;">"${params.listingTitle}"</p>
  <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0; font-size: 24px; font-weight: bold;">${params.offerAmount}</p>
    <p style="margin: 4px 0 0; color: #666;">from ${buyerDisplay}</p>
    ${params.message ? `<p style="margin: 12px 0 0; font-style: italic;">"${params.message}"</p>` : ""}
  </div>
  <div style="margin: 20px 0;">
    <a href="${acceptUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-right: 8px;">Accept Offer</a>
    <a href="${rejectUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Decline</a>
  </div>
  <p style="color: #999; font-size: 13px;">Or reply to this email with "ACCEPT" or "DECLINE". This offer expires in 48 hours.</p>
</div>`;

  const res = await fetch(POSTMARK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: fromEmail,
      To: params.sellerEmail,
      Subject: `New offer on "${params.listingTitle}" — ${params.offerAmount}`,
      HtmlBody: htmlBody,
      TextBody: textBody,
      ReplyTo: replyTo,
      Tag: "new-offer",
      MessageStream: "outbound",
    }),
  });

  return res.ok;
}
