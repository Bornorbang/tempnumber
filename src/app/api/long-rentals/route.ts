import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

export const dynamic = "force-dynamic";

function auth(req: NextRequest) {
  return req.headers.get("authorization") ?? "";
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${PHP}/long-rentals/index.php`, {
      headers: { Authorization: auth(req) },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch long rentals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${PHP}/long-rentals/index.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth(req) },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to create long rental" }, { status: 500 });
  }
}
