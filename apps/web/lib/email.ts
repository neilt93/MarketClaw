const POSTMARK_API_URL = "https://api.postmarkapp.com/email";

interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  replyTo?: string;
  tag?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    console.warn("POSTMARK_SERVER_TOKEN not configured — skipping email send");
    return false;
  }

  const fromEmail = process.env.POSTMARK_FROM_EMAIL ?? "noreply@declutter.so";

  const res = await fetch(POSTMARK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: fromEmail,
      To: params.to,
      Subject: params.subject,
      HtmlBody: params.htmlBody,
      TextBody: params.textBody,
      ReplyTo: params.replyTo,
      Tag: params.tag,
      MessageStream: "outbound",
    }),
  });

  return res.ok;
}

export function buildNewOfferEmail(params: {
  sellerName: string;
  listingTitle: string;
  offerAmount: string;
  buyerName: string | null;
  buyerEmail: string;
  message: string | null;
  offerId: string;
  acceptUrl: string;
  rejectUrl: string;
}) {
  const buyerDisplay = params.buyerName ?? params.buyerEmail;

  const textBody = `Hi ${params.sellerName},

You have a new offer on "${params.listingTitle}"!

Offer: ${params.offerAmount} from ${buyerDisplay}
${params.message ? `Message: "${params.message}"` : ""}

To accept, reply to this email with "ACCEPT" or visit:
${params.acceptUrl}

To decline, reply with "DECLINE" or visit:
${params.rejectUrl}

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
    <a href="${params.acceptUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-right: 8px;">Accept Offer</a>
    <a href="${params.rejectUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Decline</a>
  </div>

  <p style="color: #999; font-size: 13px;">Or reply to this email with "ACCEPT" or "DECLINE". This offer expires in 48 hours.</p>
</div>`;

  return { textBody, htmlBody };
}

export function buildOfferResponseEmail(params: {
  buyerEmail: string;
  buyerName: string | null;
  listingTitle: string;
  offerAmount: string;
  accepted: boolean;
  sellerMessage: string | null;
  sellerEmail: string;
}) {
  const buyerDisplay = params.buyerName ?? "there";
  const status = params.accepted ? "accepted" : "declined";

  const textBody = `Hi ${buyerDisplay},

Your offer of ${params.offerAmount} on "${params.listingTitle}" has been ${status}.

${params.accepted ? `Great news! Contact the seller at ${params.sellerEmail} to arrange payment and pickup.` : ""}
${params.sellerMessage ? `Seller's message: "${params.sellerMessage}"` : ""}

— Declutter`;

  const htmlBody = `
<div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
  <h2>Your offer has been ${status}</h2>
  <div style="background: ${params.accepted ? "#f0fdf4" : "#fef2f2"}; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0;"><strong>${params.offerAmount}</strong> on "${params.listingTitle}"</p>
    ${params.sellerMessage ? `<p style="margin: 12px 0 0; font-style: italic;">"${params.sellerMessage}"</p>` : ""}
  </div>
  ${params.accepted ? `<p>Contact the seller at <a href="mailto:${params.sellerEmail}">${params.sellerEmail}</a> to arrange payment and pickup.</p>` : ""}
</div>`;

  return { textBody, htmlBody };
}
