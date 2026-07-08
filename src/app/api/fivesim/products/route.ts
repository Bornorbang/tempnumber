import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function fwdHeaders(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const h: Record<string, string> = {};
  if (auth) h["Authorization"] = auth;
  return h;
}

export async function GET(req: NextRequest) {
  try {
    const country = req.nextUrl.searchParams.get("country") ?? "";
    const res = await fetch(
      `${PHP}/fivesim/products.php?country=${encodeURIComponent(country)}`,
      { headers: fwdHeaders(req) }
    );
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      console.error("[fivesim/products] non-JSON from PHP:", text.slice(0, 400));
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[fivesim/products] fetch error:", err);
    return NextResponse.json({ error: "Could not reach number provider." }, { status: 502 });
  }
}
