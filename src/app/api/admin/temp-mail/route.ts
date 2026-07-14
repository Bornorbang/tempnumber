import { NextRequest, NextResponse } from "next/server";
import { inboxMessage, inboxMessages } from "@/lib/temp-mail-provider";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";
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
    if (action === "list") { const result = await php(request, new URLSearchParams({ search: request.nextUrl.searchParams.get("search") ?? "", limit: "200" })); return NextResponse.json(result.data, { status: result.response.status }); }
    const inboxId = request.nextUrl.searchParams.get("inbox_id") ?? "";
    if (!inboxId || !["messages", "message"].includes(action)) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    const credentials = await php(request, new URLSearchParams({ inbox_id: inboxId }));
    if (!credentials.response.ok) return NextResponse.json(credentials.data, { status: credentials.response.status });
    if (action === "messages") return NextResponse.json({ "hydra:member": await inboxMessages(String(credentials.data.provider_account_id)) });
    const messageId = request.nextUrl.searchParams.get("message_id");
    if (!messageId) return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    return NextResponse.json(await inboxMessage(messageId));
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to reach the temporary email service." }, { status: 502 }); }
}

export async function POST(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get("action");
    const id = Number(request.nextUrl.searchParams.get("id") ?? 0);
    if (action === "delete_all") {
      const result = await phpPost(request, { action });
      return NextResponse.json(result.data, { status: result.response.status });
    }
    if (!id || !["return", "delete"].includes(action ?? "")) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    const result = await phpPost(request, { action, id });
    return NextResponse.json(result.data, { status: result.response.status });
  } catch { return NextResponse.json({ error: "Unable to update the temporary email" }, { status: 502 }); }
}
