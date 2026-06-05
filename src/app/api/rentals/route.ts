import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

function forwardAuth(req: NextRequest): string {
  return req.headers.get("authorization") ?? "";
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${PHP}/rentals/index.php`, {
      headers: { Authorization: forwardAuth(req) },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${PHP}/rentals/index.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: forwardAuth(req),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to save rental" }, { status: 500 });
  }
}
