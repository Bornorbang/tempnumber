import { createHash } from "node:crypto";

const BASE_URL = "https://privatix-temp-mail-v1.p.rapidapi.com";
const HOST = "privatix-temp-mail-v1.p.rapidapi.com";

type RapidMessage = {
  mail_id?: string;
  mail_from?: string;
  mail_subject?: string;
  mail_preview?: string;
  mail_text?: string;
  mail_html?: string;
  mail_timestamp?: number | string;
};

function apiKey() {
  const key = process.env.RAPIDAPI_TEMP_MAIL_KEY;
  if (!key) throw new Error("Temporary email provider is not configured.");
  return key;
}

async function request(path: string) {
  const response = await fetch(BASE_URL + path, {
    headers: { "x-rapidapi-host": HOST, "x-rapidapi-key": apiKey() },
    cache: "no-store",
  });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Temporary email provider returned HTTP ${response.status}.`);
  if (!raw) throw new Error("Temporary email provider returned an empty response.");
  try { return JSON.parse(raw) as unknown; }
  catch { throw new Error("Temporary email provider returned an invalid response."); }
}

function randomText(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), (value) => chars[value % chars.length]).join("");
}

function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

let cachedDomains: { values: string[]; expiresAt: number } | null = null;

export async function createTemporaryInbox() {
  if (!cachedDomains || cachedDomains.expiresAt <= Date.now()) {
    const domains = await request("/request/domains/");
    const values = Array.isArray(domains) ? domains.filter((domain): domain is string => typeof domain === "string" && domain.startsWith("@")) : [];
    if (!values.length) throw new Error("No temporary email domains are available right now.");
    cachedDomains = { values, expiresAt: Date.now() + 5 * 60 * 1000 };
  }
  const suffix = cachedDomains.values[Math.floor(Math.random() * cachedDomains.values.length)];
  const address = randomText(12) + suffix;
  const mailboxId = md5(address);
  await request("/request/mail/id/" + mailboxId + "/");
  return { address, mailboxId };
}

function normalize(message: RapidMessage) {
  return {
    id: message.mail_id ?? "",
    subject: message.mail_subject ?? "(No subject)",
    intro: message.mail_preview ?? message.mail_text ?? "",
    from: { address: message.mail_from ?? "Unknown sender" },
    createdAt: message.mail_timestamp ? new Date(Number(message.mail_timestamp) * 1000).toISOString() : new Date().toISOString(),
    text: message.mail_text ?? message.mail_preview ?? "",
    html: message.mail_html ? [message.mail_html] : [],
  };
}

export async function inboxMessages(mailboxId: string) {
  const data = await request("/request/mail/id/" + encodeURIComponent(mailboxId) + "/");
  if (Array.isArray(data)) return data.map((message) => normalize(message as RapidMessage)).filter((message) => message.id);
  if (typeof data === "object" && data && "error" in data) return [];
  throw new Error("Temporary email provider returned an unexpected inbox response.");
}

export async function inboxMessage(messageId: string) {
  const data = await request("/request/one_mail/id/" + encodeURIComponent(messageId) + "/");
  return normalize(data as RapidMessage);
}
