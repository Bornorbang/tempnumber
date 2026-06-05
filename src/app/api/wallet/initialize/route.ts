import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
  }

  let body: { amount?: number; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, email } = body;

  if (!amount || typeof amount !== "number" || amount < 100) {
    return NextResponse.json({ error: "Minimum top-up amount is ₦100" }, { status: 400 });
  }
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "User email is required" }, { status: 400 });
  }

  // Build callback URL from the incoming request origin
  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const callback_url = `${origin}/payment/callback`;

  let psRes: Response;
  try {
    psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack uses kobo
        callback_url,
        channels: ["card", "bank", "ussd", "bank_transfer"],
        metadata: { amount_ngn: amount },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach Paystack. Check your internet connection." }, { status: 502 });
  }

  const psData = await psRes.json();

  if (!psData.status) {
    return NextResponse.json({ error: psData.message ?? "Paystack initialisation failed" }, { status: 500 });
  }

  return NextResponse.json({
    authorization_url: psData.data.authorization_url,
    reference: psData.data.reference,
  });
}
