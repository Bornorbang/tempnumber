import { NextRequest, NextResponse } from "next/server";

const PHP = process.env.PHP_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const PROVIDER = "https://api.mail.tm";
let cachedDomain: { value: string; expiresAt: number } | null = null;

function connectionError(error: unknown) {
  if (!(error instanceof Error)) return "unknown connection error";
  const cause = error.cause as { code?: string; message?: string } | undefined;
  return cause?.code ?? cause?.message ?? error.message;
}

function authHeaders(request: NextRequest) {
  return { "Content-Type": "application/json", Authorization: request.headers.get("authorization") ?? "" };
}

async function jsonResponse(response: Response) {
  const raw = await response.clone().text();
  try { return NextResponse.json(JSON.parse(raw), { status: response.status }); }
  catch { return NextResponse.json({ error: "Temp Mail service returned an invalid response" }, { status: 502 }); }
}

async function backend(request: NextRequest, action: string, payload?: Record<string, unknown>) {
  const response = await fetch(PHP + "/temp-mail/index.php" + (payload ? "" : "?action=" + action), {
    method: payload ? "POST" : "GET",
    headers: authHeaders(request),
    body: payload ? JSON.stringify({ action, ...payload }) : undefined,
    cache: "no-store",
  });
  const raw = await response.clone().text();
  let data: Record<string, unknown>;
  try { data = JSON.parse(raw) as Record<string, unknown>; }
  catch { data = { error: `The wallet service returned HTTP ${response.status} instead of JSON.` }; }
  return { response, data };
}

async function provider(path: string, init?: RequestInit) {
  return fetch(PROVIDER + path, { ...init, headers: { Accept: "application/ld+json", ...init?.headers }, cache: "no-store" });
}

async function providerJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  if (!raw) throw new Error(`Mail.tm returned an empty response (HTTP ${response.status}).`);
  try { return JSON.parse(raw) as T; }
  catch { throw new Error(`Mail.tm returned an invalid response (HTTP ${response.status}).`); }
}

async function activeDomain() {
  if (cachedDomain && cachedDomain.expiresAt > Date.now()) return cachedDomain.value;
  let lastStatus = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await provider("/domains");
      lastStatus = response.status;
      if (response.ok) {
        const data = await providerJson<{ "hydra:member"?: Array<{ domain: string; isActive: boolean }> } | Array<{ domain: string; isActive: boolean }>>(response);
        const domains = Array.isArray(data) ? data : data["hydra:member"] ?? [];
        const domain = domains.find((item) => item.isActive)?.domain;
        if (domain) {
          cachedDomain = { value: domain, expiresAt: Date.now() + 5 * 60 * 1000 };
          return domain;
        }
      }
      if (response.status !== 429 && response.status < 500) break;
    } catch {
      // Retry transient provider network failures below.
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }
  throw new Error(lastStatus ? `Mail.tm is temporarily unavailable (HTTP ${lastStatus}). Please try again shortly.` : "Mail.tm could not be reached. Please try again shortly.");
}

function randomText(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), (value) => chars[value % chars.length]).join("");
}

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get("action") ?? "status";
    const inboxId = request.nextUrl.searchParams.get("inbox_id") ?? "";
    if (action === "status") return jsonResponse((await backend(request, "status")).response);
    if (!inboxId || !["messages", "message"].includes(action)) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    const credentials = await backend(request, "credentials", { inbox_id: Number(inboxId) });
    if (!credentials.response.ok) return NextResponse.json(credentials.data, { status: credentials.response.status });
    const token = String(credentials.data.provider_token ?? "");
    const messageId = request.nextUrl.searchParams.get("message_id");
    const path = action === "message" && messageId ? "/messages/" + encodeURIComponent(messageId) : "/messages";
    if (action === "message" && !messageId) return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    const response = await provider(path, { headers: { Authorization: "Bearer " + token } });
    if (action === "message" && response.ok) void provider(path, { method: "PATCH", headers: { Authorization: "Bearer " + token } });
    return jsonResponse(response);
  } catch (error) {
    return NextResponse.json({ error: "Unable to reach the Temp Mail service: " + connectionError(error) }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const queryAction = request.nextUrl.searchParams.get("action");
    const queryId = Number(request.nextUrl.searchParams.get("id") ?? 0) || undefined;
    let input: { action?: string; id?: number };
    if (queryAction) {
      // Dashboard actions use the URL query string so Vercel never needs to parse a POST body.
      input = { action: queryAction, id: queryId };
    } else {
      const raw = await request.text();
      if (!raw) return NextResponse.json({ error: "An action is required" }, { status: 400 });
      try { input = JSON.parse(raw) as { action?: string; id?: number }; }
      catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
    }
    if (input.action === "create") {
      const charge = await backend(request, "purchase_email", {});
      if (!charge.response.ok) return NextResponse.json(charge.data, { status: charge.response.status });
      const id = Number(charge.data.id);
      try {
        const domain = await activeDomain();
        const address = randomText(12) + "@" + domain;
        const password = randomText(32);
        const account = await provider("/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address, password }) });
        const accountData = await providerJson<{ id?: string }>(account);
        const token = await provider("/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address, password }) });
        const tokenData = await providerJson<{ token?: string }>(token);
        if (!account.ok || !token.ok || !accountData.id || !tokenData.token) throw new Error("Could not create an email inbox.");
        const activated = await backend(request, "activate_email", { id, address, provider_account_id: accountData.id, provider_token: tokenData.token });
        return NextResponse.json(activated.data, { status: activated.response.status });
      } catch (error) {
        await backend(request, "refund_pending_email", { id }).catch(() => undefined);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create an email inbox." }, { status: 502 });
      }
    }
    if (input.action === "renew") {
      const result = await backend(request, "renew_email", { id: Number(input.id) });
      return NextResponse.json(result.data, { status: result.response.status });
    }
    if (input.action === "delete") {
      const result = await backend(request, "hide_email", { id: Number(input.id) });
      return NextResponse.json(result.data, { status: result.response.status });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to reach the Temp Mail service: " + connectionError(error) }, { status: 502 });
  }
}
