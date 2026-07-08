import { NextRequest, NextResponse } from "next/server";

// Public proxy to 5sim guest products endpoint — no auth required.
// Used by the public /pricing page to show All Countries pricing.
export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country") ?? "england";

  try {
    const res = await fetch(
      `https://5sim.net/v1/guest/products/${encodeURIComponent(country)}/any`,
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
    );
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ error: "Unexpected response from provider." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Could not reach number provider." }, { status: 502 });
  }
}
