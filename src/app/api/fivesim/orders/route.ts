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
    const res = await fetch(`${PHP}/fivesim/orders.php`, {
      headers: fwdHeaders(req),
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json([], { status: 200 });
    }
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
