import { NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${PHP}/long-rentals/prices.php`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
