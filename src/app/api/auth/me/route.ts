import { NextResponse } from "next/server";
import { getBearerToken, getUserFromToken, readDB } from "@/lib/db";

export async function GET(req: Request) {
  const token = getBearerToken(req);
  const user = getUserFromToken(token ?? "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return fresh balance from DB
  const db = readDB();
  const dbUser = db.users.find((u) => u.id === user.id) ?? user;

  return NextResponse.json({
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    wallet_balance: dbUser.wallet_balance,
  });
}
