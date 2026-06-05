import { NextResponse } from "next/server";
import { readDB, writeDB, verifyPassword, generateToken } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { email, password } = body;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const db = readDB();
  const normalEmail = email.toLowerCase().trim();
  const user = db.users.find((u) => u.email === normalEmail);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = generateToken();
  db.sessions.push({ token, user_id: user.id });
  writeDB(db);

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      wallet_balance: user.wallet_balance,
    },
  });
}
