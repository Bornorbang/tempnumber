import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function fwdHeaders(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) h["Authorization"] = auth;
  return h;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(`${PHP}/fivesim/finish.php`, {
      method: "POST",
      headers: fwdHeaders(req),
      body,
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Could not reach number provider." }, { status: 502 });
  }
}
