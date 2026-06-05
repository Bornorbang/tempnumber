import { NextRequest, NextResponse } from "next/server";
import { getatextFetch } from "@/lib/getatext";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const res = await getatextFetch(`/api/v1/rental-status/${id}/completed`, {
      method: "POST",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to complete rental" },
      { status: 500 }
    );
  }
}
