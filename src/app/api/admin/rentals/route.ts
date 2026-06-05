import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function GET(req: NextRequest) {
  const sp     = req.nextUrl.searchParams;
  const search = sp.get("search") ?? "";
  const limit  = sp.get("limit")  ?? "200";
  const offset = sp.get("offset") ?? "0";
  const qs = new URLSearchParams({ search, limit, offset }).toString();
  const auth = req.headers.get("authorization") ?? "";
  const res = await fetch(`${PHP}/admin/rentals.php?${qs}`, {
    headers: auth ? { Authorization: auth } : {},
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
