import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) return NextResponse.json({ error: "Wholesale prices are unavailable." }, { status: 503 });
  try {
    const response = await fetch(`${base}/developer/catalog.php`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(25000),
    });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data)) {
      return NextResponse.json({ error: "Could not load wholesale prices. Please try again." }, { status: 503 });
    }
    return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=30" } });
  } catch {
    return NextResponse.json({ error: "Could not load wholesale prices. Please try again." }, { status: 503 });
  }
}
