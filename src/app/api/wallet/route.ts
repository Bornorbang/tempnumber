import { NextResponse } from "next/server";
import { readDB, getBearerToken, getUserFromToken } from "@/lib/db";

export async function GET(req: Request) {
  const token = getBearerToken(req);
  const user = getUserFromToken(token ?? "");
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();
  const dbUser = db.users.find((u) => u.id === user.id) ?? user;

  return NextResponse.json({ balance: dbUser.wallet_balance });
}
