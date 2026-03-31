import { NextResponse } from "next/server";

// TODO: Implement Postmark inbound email webhook
// This handles seller reply-to-accept/decline offers via email

export async function POST(request: Request) {
  const token = request.headers.get("x-postmark-server-token");

  if (token !== process.env.POSTMARK_SERVER_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const _body = await request.json();

  // TODO: Parse inbound email, match to offer, update status

  return NextResponse.json({ received: true });
}
