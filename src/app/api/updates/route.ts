import { NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";

export async function GET() {
  const res  = await fetch(`${PHP}/admin/updates.php`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
