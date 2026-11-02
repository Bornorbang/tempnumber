import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rentalId = searchParams.get("rental_id") ?? "";

    const url = new URL(`${PHP}/long-rentals/messages.php`);
    url.searchParams.set("rental_id", rentalId);

    const res = await fetch(url.toString(), {
      headers: { Authorization: req.headers.get("authorization") ?? "" },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
