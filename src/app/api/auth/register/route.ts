import { NextResponse } from "next/server";
import {
  readDB,
  writeDB,
  nextId,
  hashPassword,
  generateToken,
} from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { name, email, password } = body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || password.length < 6
  ) {
    return NextResponse.json(
      { error: "Name, a valid email, and a password (min 6 chars) are required." },
      { status: 400 }
    );
  }

  const db = readDB();
  const normalEmail = email.toLowerCase().trim();

  if (db.users.find((u) => u.email === normalEmail)) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const user = {
    id: nextId(db, "user_id"),
    name: name.trim(),
    email: normalEmail,
    password_hash: hashPassword(password),
    wallet_balance: 0,
    created_at: new Date().toISOString(),
  };

  const token = generateToken();
  db.users.push(user);
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
