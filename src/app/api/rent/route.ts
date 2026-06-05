import { NextRequest, NextResponse } from "next/server";
import { getatextFetch } from "@/lib/getatext";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required field
    if (!body.service || typeof body.service !== "string") {
      return NextResponse.json(
        { error: "service is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = { service: body.service };
    if (body.max_price != null) payload.max_price = body.max_price;
    if (body.carrier) payload.carrier = body.carrier;
    if (body.keep_carrier != null) payload.keep_carrier = body.keep_carrier;
    if (body.lock_area_code != null) payload.lock_area_code = body.lock_area_code;
    if (body.area_codes) payload.area_codes = body.area_codes;

    const res = await getatextFetch("/api/v1/rent-a-number", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to rent number" },
      { status: 500 }
    );
  }
}
