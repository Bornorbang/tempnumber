import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const PAYSTACK_SECRET     = process.env.PAYSTACK_SECRET_KEY;
const PHP_API             = process.env.NEXT_PUBLIC_API_URL;
const JWT_SECRET          = process.env.JWT_SECRET;
const PHP_INTERNAL_SECRET = process.env.PHP_INTERNAL_SECRET;

/**
 * Verify an HS256 JWT and return its payload.
 * Returns null if the signature is invalid or the token is expired.
 */
function verifyJWT(token: string, secret: string): { sub?: number; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, sig] = parts;
    const expected = createHmac("sha256", secret)
      .update(`${h}.${p}`)
      .digest("base64url");
    if (expected !== sig) return null;
    const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
  }
  if (!PHP_API) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 500 });
  }

  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { reference } = body;
  if (!reference || typeof reference !== "string") {
    return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
  }

  // ── 1. Verify with Paystack ─────────────────────────────────────────────────
  let psRes: Response;
  try {
    psRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach Paystack to verify payment. Please try again." },
      { status: 502 }
    );
  }

  const psData = await psRes.json();

  if (!psData.status || psData.data?.status !== "success") {
    return NextResponse.json(
      { error: "Payment was not successful according to Paystack. No charge has been made." },
      { status: 400 }
    );
  }

  const amountNGN = psData.data.amount / 100; // kobo → naira

  // ── 2. Identify the user from their JWT ────────────────────────────────────
  const authHeader = req.headers.get("authorization") ?? "";
  const rawToken   = authHeader.replace(/^Bearer\s+/i, "").trim();

  // Try local JWT verification first (fast, no network hop).
  // If JWT_SECRET is missing or mismatched, fall back to asking PHP /auth/me.php
  // so a JWT_SECRET misconfiguration never blocks a legitimate payment.
  let userId: number | undefined;

  if (JWT_SECRET && rawToken) {
    const jwtPayload = verifyJWT(rawToken, JWT_SECRET);
    userId = jwtPayload?.sub;
  }

  // Fallback: ask PHP to validate the token when local check fails
  if (!userId && rawToken && PHP_API) {
    try {
      const meRes = await fetch(`${PHP_API}/auth/me.php`, {
        headers: { Authorization: `Bearer ${rawToken}` },
      });
      if (meRes.ok) {
        const meData = await meRes.json().catch(() => ({})) as { id?: number };
        if (meData.id) userId = meData.id;
      }
    } catch { /* network error — fall through to the error below */ }
  }

  if (!userId) {
    return NextResponse.json(
      {
        error:
          "Your session could not be verified. Your payment was received. " +
          "Contact support with reference: " + reference,
      },
      { status: 401 }
    );
  }

  // ── 3. Credit wallet in PHP ─────────────────────────────────────────────────
  // Send BOTH the Authorization header (works in production / non-XAMPP)
  // AND X-Internal-Key + _user_id in body (bypasses Apache Authorization
  // stripping that happens on XAMPP server-to-server requests).
  const CRON_SECRET = process.env.CRON_SECRET;

  const phpHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...(PHP_INTERNAL_SECRET ? { "X-Internal-Key": PHP_INTERNAL_SECRET } : {}),
    ...(CRON_SECRET ? { "X-Cron-Secret": CRON_SECRET } : {}),
  };

  try {
    const phpRes = await fetch(`${PHP_API}/wallet/topups.php`, {
      method: "POST",
      headers: phpHeaders,
      body: JSON.stringify({
        _user_id:  userId,     // trusted — JWT signature verified above
        amount:    amountNGN,
        method:    "paystack",
        reference,
        status:    "completed",
      }),
    });

    const phpData = await phpRes.json().catch(() => ({})) as { error?: string; new_balance?: number };

    if (!phpRes.ok) {
      return NextResponse.json(
        {
          error:
            phpData.error ??
            "Wallet credit failed. Your payment was received. Contact support with reference: " + reference,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success:     true,
      amount:      amountNGN,
      new_balance: phpData.new_balance,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach the payment backend. Your payment was received. " +
          "Contact support with reference: " + reference,
      },
      { status: 502 }
    );
  }
}
