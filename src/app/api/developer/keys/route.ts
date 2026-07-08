import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function forwardHeaders(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) h["Authorization"] = auth;
  return h;
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${PHP}/developer/keys.php`, {
      headers: forwardHeaders(req),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(`${PHP}/developer/keys.php`, {
      method: "POST",
      headers: forwardHeaders(req),
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
