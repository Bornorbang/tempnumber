import { NextResponse } from "next/server";
import { readDB, getBearerToken, getUserFromToken } from "@/lib/db";

export async function GET(req: Request) {
  const token = getBearerToken(req);
  const user = getUserFromToken(token ?? "");
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();
  const topups = db.topups
    .filter((t) => t.user_id === user.id)
    .sort((a, b) => b.id - a.id);

  return NextResponse.json(topups);
}
