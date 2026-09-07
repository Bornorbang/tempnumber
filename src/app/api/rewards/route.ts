import { NextRequest, NextResponse } from "next/server";

const PHP = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function proxy(request: NextRequest) {
  if (!PHP) {
    return NextResponse.json(
      { error: "Rewards backend is not configured." },
      { status: 503 },
    );
  }

  try {
    const body = request.method === "POST" ? await request.text() : undefined;
    const response = await fetch(`${PHP}/rewards/index.php`, {
      method: request.method,
      headers: {
        Authorization: request.headers.get("authorization") ?? "",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
      cache: "no-store",
    });
    const text = await response.text();
    try {
      return NextResponse.json(JSON.parse(text), {
        status: response.status,
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      return NextResponse.json(
        {
          error:
            response.status === 404
              ? "Rewards backend endpoint is not installed."
              : "Rewards backend returned an invalid response.",
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the Rewards backend." },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
