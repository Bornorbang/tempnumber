import { NextResponse } from "next/server";
import { getatextFetch } from "@/lib/getatext";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await getatextFetch("/api/v1/prices-info");

    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: res.status });
    }

    const raw = await res.json();

    // Getatext returns: { status: "success", errors: null, prices: [...] }
    // Normalise to always return a flat array of service objects
    let services: unknown[];
    if (Array.isArray(raw)) {
      services = raw;
    } else if (Array.isArray(raw.prices)) {
      services = raw.prices;
    } else if (raw.service_name) {
      // Single service object returned directly
      services = [raw];
    } else {
      services = [];
    }

    return NextResponse.json(services);
  } catch (err) {
    console.error("[/api/prices] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
