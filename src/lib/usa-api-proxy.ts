import { NextRequest, NextResponse } from "next/server";

type Endpoint = "balance" | "prices" | "rent" | "rentals" | "status" | "cancel";

export async function proxyUsaApi(req: NextRequest, endpoint: Endpoint) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const headers = { "Cache-Control": "no-store" };
  if (!base) return NextResponse.json({ error: "API temporarily unavailable", code: "api_unavailable" }, { status: 503, headers });
  const key = req.headers.get("x-api-key") ?? "";
  if (!/^tn_[0-9a-f]{64}$/.test(key)) {
    return NextResponse.json({ error: "Send a valid X-API-Key header.", code: "invalid_api_key" }, { status: 401, headers });
  }
  try {
    const body = req.method === "POST" ? await req.text() : undefined;
    if (body && new TextEncoder().encode(body).length > 8192) {
      return NextResponse.json({ error: "Request body exceeds 8 KB.", code: "request_too_large" }, { status: 413, headers });
    }
    const response = await fetch(`${base}/developer/${endpoint}.php${req.nextUrl.search}`, {
      method: req.method,
      headers: {
        "X-API-Key": key,
        "Content-Type": req.headers.get("content-type") ?? "application/json",
        "Idempotency-Key": req.headers.get("idempotency-key") ?? "",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(45000),
    });
    const forwarded = new Headers(headers);
    for (const name of ["Retry-After", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset", "Idempotency-Replayed"]) {
      const value = response.headers.get(name);
      if (value) forwarded.set(name, value);
    }
    return NextResponse.json(await response.json(), { status: response.status, headers: forwarded });
  } catch {
    return NextResponse.json({ error: "API temporarily unavailable. Retry orders with the SAME Idempotency-Key and body.", code: "api_unavailable" }, { status: 503, headers });
  }
}
