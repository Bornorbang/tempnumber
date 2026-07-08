import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  try {
    const res = await fetch(`${PHP}/referral/index.php`, {
      headers: { Authorization: auth },
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ error: "Unexpected server response." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Could not reach server." }, { status: 502 });
  }
}
