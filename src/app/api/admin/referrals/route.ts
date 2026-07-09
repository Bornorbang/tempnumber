import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function fwdHeaders(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) h["Authorization"] = auth;
  return h;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString();
  const url = `${PHP}/admin/referrals.php${search ? `?${search}` : ""}`;

  try {
    const res = await fetch(url, { headers: fwdHeaders(req) });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 502 });
  }
}
