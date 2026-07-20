import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";

function authorization(request: NextRequest) {
  return request.headers.get("authorization") ?? "";
}

async function responseFromBackend(response: Response) {
  const text = await response.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    data = { error: "Support service returned an invalid response." };
  }
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${PHP}/support/index.php`, {
      headers: { Authorization: authorization(request) },
      cache: "no-store",
    });
    return responseFromBackend(response);
  } catch {
    return NextResponse.json({ error: "Unable to reach the support service." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await fetch(`${PHP}/support/index.php`, {
      method: "POST",
      headers: { Authorization: authorization(request) },
      body: formData,
      cache: "no-store",
    });
    return responseFromBackend(response);
  } catch {
    return NextResponse.json({ error: "Unable to reach the support service." }, { status: 502 });
  }
}
