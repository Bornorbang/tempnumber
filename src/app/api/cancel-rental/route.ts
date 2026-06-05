import { NextRequest, NextResponse } from "next/server";
import { getatextFetch } from "@/lib/getatext";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const res = await getatextFetch("/api/v1/cancel-rental", {
      method: "POST",
      body: JSON.stringify({ id: body.id }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel rental" },
      { status: 500 }
    );
  }
}
