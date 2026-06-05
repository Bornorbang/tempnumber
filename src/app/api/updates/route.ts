import { NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? "http://localhost/tempnumber/api";

export async function GET() {
  const res  = await fetch(`${PHP}/admin/updates.php`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
