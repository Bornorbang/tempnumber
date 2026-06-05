import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? "http://localhost/tempnumber/api";

/**
 * Getatext sends webhook POSTs here when a code arrives.
 * We proxy to PHP so the DB update happens server-side with no auth required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res  = await fetch(`${PHP}/webhook/getatext.php`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.json().catch(() => ({ received: true }));
    return NextResponse.json(data, { status: 200 }); // always 200 so Getatext stops retrying
  } catch {
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
