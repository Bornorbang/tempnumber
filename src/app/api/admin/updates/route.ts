import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";

function fwd(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization") ?? "";
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) h["Authorization"] = auth;
  return h;
}

export async function GET() {
  const res  = await fetch(`${PHP}/admin/updates.php`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res  = await fetch(`${PHP}/admin/updates.php`, { method: "POST", headers: fwd(req), body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const body = await req.text();
  const res  = await fetch(`${PHP}/admin/updates.php`, { method: "PATCH", headers: fwd(req), body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.text();
  const res  = await fetch(`${PHP}/admin/updates.php`, { method: "DELETE", headers: fwd(req), body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
