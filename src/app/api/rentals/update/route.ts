import { NextResponse } from "next/server";
import { readDB, writeDB, getBearerToken, getUserFromToken } from "@/lib/db";

export async function POST(req: Request) {
  const token = getBearerToken(req);
  const user = getUserFromToken(token ?? "");
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { getatext_id, status, sms_code, end_time } = body;

  if (!getatext_id) {
    return NextResponse.json({ error: "getatext_id is required." }, { status: 400 });
  }

  const db = readDB();
  const rental = db.rentals.find(
    (r) => r.getatext_id === Number(getatext_id) && r.user_id === user.id
  );

  if (!rental) {
    return NextResponse.json({ error: "Rental not found." }, { status: 404 });
  }

  if (status !== undefined) rental.status = String(status);
  if (sms_code !== undefined) rental.sms_code = sms_code ? String(sms_code) : null;
  if (end_time !== undefined) rental.end_time = String(end_time);

  writeDB(db);

  return NextResponse.json({ success: true });
}
