import { NextRequest, NextResponse } from "next/server";
const PHP = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
async function proxy(request: NextRequest) {
  try {
    const body = request.method === "POST" ? await request.text() : undefined;
    const response = await fetch(`${PHP}/admin/boost-orders.php${request.method === "GET" ? `?${request.nextUrl.searchParams}` : ""}`, { method: request.method, headers: { Authorization: request.headers.get("authorization") ?? "", ...(body ? { "Content-Type": "application/json" } : {}) }, body, cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ error: "Boost orders are temporarily unavailable." }, { status: 502 }); }
}
export const GET = proxy;
export const POST = proxy;
