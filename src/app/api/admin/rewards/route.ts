import { NextRequest, NextResponse } from "next/server";
const PHP = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${PHP}/admin/rewards.php?${request.nextUrl.searchParams}`, { headers: { Authorization: request.headers.get("authorization") ?? "" }, cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ error: "Rewards are temporarily unavailable." }, { status: 502 }); }
}
