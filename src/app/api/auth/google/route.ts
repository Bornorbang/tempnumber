import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? "http://localhost/tempnumber/api";

export async function POST(req: NextRequest) {
  const body = await req.text();
  let res: Response;
  try {
    res = await fetch(`${PHP}/auth/google.php`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch (e) {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text.trim() || "Empty response from backend" };
  }
  return NextResponse.json(data, { status: res.status });
}
