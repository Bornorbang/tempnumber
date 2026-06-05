import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function fwd(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;
  return headers;
}

export async function GET() {
  const res = await fetch(`${PHP}/admin/announcements.php`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${PHP}/admin/announcements.php`, {
    method: "POST",
    headers: fwd(req),
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${PHP}/admin/announcements.php`, {
    method: "DELETE",
    headers: fwd(req),
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
