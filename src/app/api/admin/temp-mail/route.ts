import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const PROVIDER = "https://api.mail.tm";

function headers(request: NextRequest) { return { Authorization: request.headers.get("authorization") ?? "" }; }

async function php(request: NextRequest, query: URLSearchParams) {
  const response = await fetch(PHP + "/admin/temp-mail.php?" + query.toString(), { headers: headers(request), cache: "no-store" });
  const data = await response.json().catch(() => ({ error: "Admin service returned an invalid response" }));
  return { response, data };
}

async function phpPost(request: NextRequest, body: Record<string, unknown>) {
  const response = await fetch(PHP + "/admin/temp-mail.php", { method: "POST", headers: { "Content-Type": "application/json", ...headers(request) }, body: JSON.stringify(body), cache: "no-store" });
  const data = await response.json().catch(() => ({ error: "Admin service returned an invalid response" }));
  return { response, data };
}

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get("action") ?? "list";
    const inboxId = request.nextUrl.searchParams.get("inbox_id") ?? "";
    if (action === "list") {
      const result = await php(request, new URLSearchParams({ search: request.nextUrl.searchParams.get("search") ?? "", limit: "200" }));
      return NextResponse.json(result.data, { status: result.response.status });
    }
    if (!inboxId || !["messages", "message"].includes(action)) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    const credentials = await php(request, new URLSearchParams({ inbox_id: inboxId }));
    if (!credentials.response.ok) return NextResponse.json(credentials.data, { status: credentials.response.status });
    const messageId = request.nextUrl.searchParams.get("message_id");
    if (action === "message" && !messageId) return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    const path = action === "message" ? "/messages/" + encodeURIComponent(messageId!) : "/messages";
    const response = await fetch(PROVIDER + path, { headers: { Accept: "application/json", Authorization: "Bearer " + credentials.data.provider_token }, cache: "no-store" });
    const data = await response.json().catch(() => ({ error: "Email provider returned an invalid response" }));
    return NextResponse.json(data, { status: response.status });
  } catch { return NextResponse.json({ error: "Unable to reach the temporary email service" }, { status: 502 }); }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json() as { action?: string; id?: number };
    if (!input.id || !["return", "delete"].includes(input.action ?? "")) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    if (input.action === "delete") {
      const credentials = await php(request, new URLSearchParams({ inbox_id: String(input.id) }));
      if (!credentials.response.ok) return NextResponse.json(credentials.data, { status: credentials.response.status });
      const provider = await fetch(PROVIDER + "/accounts/" + encodeURIComponent(String(credentials.data.provider_account_id)), { method: "DELETE", headers: { Authorization: "Bearer " + credentials.data.provider_token } });
      if (!provider.ok && provider.status !== 404) return NextResponse.json({ error: "Could not delete the provider email account." }, { status: 502 });
    }
    const result = await phpPost(request, { action: input.action, id: input.id });
    return NextResponse.json(result.data, { status: result.response.status });
  } catch { return NextResponse.json({ error: "Unable to update the temporary email" }, { status: 502 }); }
}
