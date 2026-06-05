import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function forwardHeaders(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;
  return headers;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const url = `${PHP}/admin/users.php${search ? `?search=${encodeURIComponent(search)}` : ""}`;
  const res = await fetch(url, { headers: forwardHeaders(req) });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${PHP}/admin/users.php`, {
    method: "POST",
    headers: forwardHeaders(req),
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
