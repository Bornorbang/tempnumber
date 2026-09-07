import { NextRequest, NextResponse } from "next/server";

const PHP = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;
    const leaf = path.join("/");
    if (!['services', 'orders', 'order'].includes(leaf)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const query = req.nextUrl.search;
    const headers: Record<string, string> = { Authorization: req.headers.get("authorization") ?? "", Accept: "application/json" };
    const idempotency = req.headers.get("idempotency-key");
    if (idempotency) headers["Idempotency-Key"] = idempotency;
    let body: string | undefined;
    if (req.method === "POST") { headers["Content-Type"] = "application/json"; body = await req.text(); }
    const upstream = await fetch(`${PHP}/smm/${leaf}.php${query}`, { method: req.method, headers, body, cache: "no-store", signal: AbortSignal.timeout(40000) });
    const text = await upstream.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = { error: "Invalid response from boost service." }; }
    return NextResponse.json(data, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to reach the boost service." }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
