import { NextRequest, NextResponse } from "next/server";
import { createTemporaryInbox, inboxMessage, inboxMessages } from "@/lib/temp-mail-provider";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";

function authHeaders(request: NextRequest) { return { "Content-Type": "application/json", Authorization: request.headers.get("authorization") ?? "" }; }

async function backend(request: NextRequest, action: string, payload?: Record<string, unknown>) {
  const response = await fetch(PHP + "/temp-mail/index.php" + (payload ? "" : "?action=" + action), {
    method: payload ? "POST" : "GET", headers: authHeaders(request), body: payload ? JSON.stringify({ action, ...payload }) : undefined, cache: "no-store",
  });
  const raw = await response.text();
  let data: Record<string, unknown>;
  try { data = JSON.parse(raw) as Record<string, unknown>; }
  catch { data = { error: `Wallet service returned HTTP ${response.status} instead of JSON.` }; }
  return { response, data };
}

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get("action") ?? "status";
    if (action === "status") { const result = await backend(request, "status"); return NextResponse.json(result.data, { status: result.response.status }); }
    const inboxId = request.nextUrl.searchParams.get("inbox_id") ?? "";
    if (!inboxId || !["messages", "message"].includes(action)) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    const credentials = await backend(request, "credentials", { inbox_id: Number(inboxId) });
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
    const id = Number(request.nextUrl.searchParams.get("id") ?? 0) || undefined;
    if (action === "create") {
      const charge = await backend(request, "purchase_email", {});
      if (!charge.response.ok) return NextResponse.json(charge.data, { status: charge.response.status });
      const inboxId = Number(charge.data.id);
      try {
        const inbox = await createTemporaryInbox();
        const activated = await backend(request, "activate_email", { id: inboxId, address: inbox.address, provider_account_id: inbox.mailboxId, provider_token: "" });
        return NextResponse.json(activated.data, { status: activated.response.status });
      } catch (error) {
        await backend(request, "refund_pending_email", { id: inboxId }).catch(() => undefined);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create an email inbox." }, { status: 502 });
      }
    }
    if (action === "renew") { const result = await backend(request, "renew_email", { id }); return NextResponse.json(result.data, { status: result.response.status }); }
    if (action === "delete") { const result = await backend(request, "hide_email", { id }); return NextResponse.json(result.data, { status: result.response.status }); }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to reach the temporary email service." }, { status: 502 }); }
}
