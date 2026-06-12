import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.NEXT_PUBLIC_API_URL ?? "";

async function proxy(req: NextRequest, method: string) {
  try {
    const url = new URL(req.url);
    const qs  = url.searchParams.toString();
    const body = method === "POST" ? await req.text() : undefined;

    const res = await fetch(`${PHP}/admin/dedicated.php${qs ? `?${qs}` : ""}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") ?? "",
      },
      ...(body ? { body } : {}),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 500 });
  }
}

export async function GET(req: NextRequest)  { return proxy(req, "GET");  }
export async function POST(req: NextRequest) { return proxy(req, "POST"); }
