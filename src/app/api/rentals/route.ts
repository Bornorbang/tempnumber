import { NextResponse } from "next/server";
import {
  readDB,
  writeDB,
  nextId,
  getBearerToken,
  getUserFromToken,
} from "@/lib/db";

const NGN_RATE = 1600;
const NGN_MARGIN = 1000;

export async function GET(req: Request) {
  const token = getBearerToken(req);
  const user = getUserFromToken(token ?? "");
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();
  const rentals = db.rentals
    .filter((r) => r.user_id === user.id)
    .sort((a, b) => b.id - a.id);

  return NextResponse.json(rentals);
}

export async function POST(req: Request) {
  const token = getBearerToken(req);
  const user = getUserFromToken(token ?? "");
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { id: getatext_id, number, service_name, end_time, price, status } = body;

  if (!getatext_id || !number || !service_name || price === undefined) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const price_usd = Number(price);
  const price_ngn = Math.ceil(price_usd * NGN_RATE) + NGN_MARGIN;

  const db = readDB();
  const dbUser = db.users.find((u) => u.id === user.id);
  if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

  if (dbUser.wallet_balance < price_ngn) {
    return NextResponse.json(
      { error: `Insufficient balance. Need ₦${price_ngn.toLocaleString()}, have ₦${dbUser.wallet_balance.toLocaleString()}.` },
      { status: 402 }
    );
  }

  dbUser.wallet_balance = Math.round((dbUser.wallet_balance - price_ngn) * 100) / 100;

  const rental = {
    id: nextId(db, "rental_id"),
    user_id: user.id,
    getatext_id: Number(getatext_id),
    number: String(number),
    service_name: String(service_name),
    end_time: String(end_time ?? ""),
    price_usd,
    price_ngn,
    status: String(status ?? "active"),
    sms_code: null as string | null,
    rented_at: new Date().toISOString(),
  };

  db.rentals.push(rental);
  writeDB(db);

  return NextResponse.json({ ...rental, new_balance: dbUser.wallet_balance });
}
