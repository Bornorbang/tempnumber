"use client";

import { useCallback, useEffect, useState } from "react";

type Email = { id: number; address: string; expires_at: string; created_at: string; renewed_at?: string | null };
type Mail = { id: string; subject: string; intro: string; createdAt: string; from: { address: string; name?: string }; text?: string; html?: string[] };
type Status = { emails: Email[]; balance: number; price_ngn: number };

function token() { return typeof window === "undefined" ? "" : localStorage.getItem("tn_token") ?? ""; }
function money(value: number) { return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value); }
function date(value: string) { return new Date(value.replace(" ", "T") + "Z").toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }); }

export default function TempMailPage() {
  const [status, setStatus] = useState<Status>({ emails: [], balance: 0, price_ngn: 700 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | "create" | null>(null);
  const [toast, setToast] = useState("");
  const [inbox, setInbox] = useState<Email | null>(null);
  const [messages, setMessages] = useState<Mail[]>([]);
  const [mail, setMail] = useState<Mail | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Email | null>(null);
  const [refreshingMessages, setRefreshingMessages] = useState(false);

  const request = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch("/api/temp-mail" + path, {
      ...init,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token(), ...init?.headers },
    });
    const data = await response.json().catch(() => ({ error: "The Temp Mail service returned an invalid response." }));
    if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
    return data;
  }, []);

  const load = useCallback(async () => {
    try { setStatus(await request("?action=status") as Status); }
    catch (error) { setToast(error instanceof Error ? error.message : "Could not load your temporary emails."); }
    finally { setLoading(false); }
  }, [request]);

  useEffect(() => {
    // Loading authenticated remote state is the purpose of this mount effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 5000); return () => window.clearTimeout(timer); }, [toast]);

  async function create() {
    setBusy("create");
    try { await request("?action=create", { method: "POST" }); await load(); setToast("Temporary email created. ₦700 was deducted from your wallet."); }
    catch (error) { setToast(error instanceof Error ? error.message : "Could not create an email."); }
    finally { setBusy(null); }
  }
  async function renew(email: Email) {
    setBusy(email.id);
    try { await request("?action=renew&id=" + email.id, { method: "POST" }); await load(); setToast("Email renewed for another 24 hours."); }
    catch (error) { setToast(error instanceof Error ? error.message : "Could not renew this email."); }
    finally { setBusy(null); }
  }
  async function remove() {
    if (!confirmDelete) return;
    setBusy(confirmDelete.id);
    try { await request("?action=delete&id=" + confirmDelete.id, { method: "POST" }); setConfirmDelete(null); await load(); setToast("Temporary email deleted."); }
    catch (error) { setToast(error instanceof Error ? error.message : "Could not delete this email."); }
    finally { setBusy(null); }
  }
  async function loadMessages(email: Email, clear = false) {
    if (clear) setMessages([]);
    setRefreshingMessages(true);
    try { const data = await request("?action=messages&inbox_id=" + email.id); setMessages(Array.isArray(data) ? data : data["hydra:member"] ?? data.messages ?? []); }
    catch (error) { setToast(error instanceof Error ? error.message : "Could not load messages."); }
    finally { setRefreshingMessages(false); }
  }
  async function openInbox(email: Email) {
    setInbox(email); setMail(null);
    await loadMessages(email, true);
  }
  async function copyAddress(address: string) {
    try { await navigator.clipboard.writeText(address); setToast("Email address copied."); }
    catch { setToast("Could not copy the email address."); }
  }
  async function openMail(item: Mail) {
    if (!inbox) return;
    try { setMail(await request("?action=message&inbox_id=" + inbox.id + "&message_id=" + encodeURIComponent(item.id)) as Mail); }
    catch (error) { setToast(error instanceof Error ? error.message : "Could not open this message."); }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" /></div>;
  return <div className="mx-auto w-full max-w-6xl">
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Temporary Emails</h1><p className="mt-1 text-sm text-gray-500">Get disposable email addresses for temporary use</p></div><div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-green-500" strokeWidth="2"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5z"/><path d="M3 9h16"/><path d="M15 14h2"/></svg><span>{money(status.balance)}</span></div></header>
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <section className="h-fit rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6"><h2 className="text-xl font-bold text-[var(--text-primary)]">Generate temporary email</h2><p className="mt-2 text-sm leading-6 text-gray-500">Click button below to generate an email address. Each email is active for 24 hours and costs {money(status.price_ngn)}.</p><button disabled={busy !== null} onClick={() => void create()} className="mt-6 w-full rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60">{busy === "create" ? "Creating..." : "Generate email"}</button><p className="mt-3 text-xs leading-5 text-gray-500">Renew before expiry to keep it on your dashboard for another 24 hours.</p></section>
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]"><div className="border-b border-[var(--border-color)] px-5 py-4"><h2 className="font-semibold text-[var(--text-primary)]">Your temporary emails</h2></div>{status.emails.length === 0 ? <div className="flex min-h-56 items-center justify-center p-8 text-center text-sm text-gray-500">Generate an email to see it here and receive messages.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[580px] text-left text-sm"><thead className="bg-[var(--bg-card-inner)] text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Messages</th><th className="px-5 py-3 font-medium">Action</th></tr></thead><tbody>{status.emails.map((email) => <tr key={email.id} className="border-t border-[var(--border-color)]"><td className="px-5 py-4"><button title="Copy email address" onClick={() => void copyAddress(email.address)} className="font-medium text-[var(--text-primary)] hover:text-green-500">{email.address}</button><p className="mt-1 text-xs text-gray-500">Expires {date(email.expires_at)}</p></td><td className="px-5 py-4"><button aria-label={'View messages for ' + email.address} onClick={() => void openInbox(email)} className="rounded-lg border border-[var(--border-color)] p-2 text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]">✉</button></td><td className="px-5 py-4"><div className="flex gap-2"><button disabled={busy !== null} onClick={() => void renew(email)} className="rounded-lg border border-green-500 px-3 py-2 text-xs font-semibold text-green-500 disabled:opacity-50">{busy === email.id ? "Working..." : "Renew"}</button><button disabled={busy !== null} onClick={() => setConfirmDelete(email)} className="rounded-lg border border-red-400 px-3 py-2 text-xs font-semibold text-red-500 disabled:opacity-50">Delete</button></div></td></tr>)}</tbody></table></div>}</section>
    </div>
    {toast && <div role="status" className="fixed right-5 top-5 z-50 max-w-sm rounded-xl bg-[var(--text-primary)] px-4 py-3 text-sm text-[var(--bg-card)] shadow-xl">{toast}</div>}
    {inbox && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setInbox(null)}><section className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-[var(--bg-card)]" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between border-b border-[var(--border-color)] p-5"><div><h2 className="font-bold text-[var(--text-primary)]">Messages</h2><p className="mt-1 text-sm text-gray-500">{inbox.address}</p></div><div className="flex items-center gap-3"><button disabled={refreshingMessages} onClick={() => void loadMessages(inbox)} className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] disabled:opacity-50">{refreshingMessages ? "Refreshing..." : "Refresh"}</button><button aria-label="Close messages" onClick={() => setInbox(null)} className="text-xl leading-none text-gray-500">×</button></div></header>{messages.length ? <div>{messages.map((item) => <button key={item.id} onClick={() => void openMail(item)} className="w-full border-b border-[var(--border-color)] p-4 text-left hover:bg-[var(--bg-card-inner)]"><p className="font-medium text-[var(--text-primary)]">{item.from.name || item.from.address}</p><p className="mt-1 text-sm text-[var(--text-primary)]">{item.subject || "(No subject)"}</p><p className="mt-1 truncate text-xs text-gray-500">{item.intro}</p></button>)}</div> : <p className="p-10 text-center text-sm text-gray-500">{refreshingMessages ? "Loading messages..." : "No messages yet."}</p>}</section></div>}
    {mail && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setMail(null)}><article className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-[var(--bg-card)] p-6" onClick={(event) => event.stopPropagation()}><button aria-label="Close message" onClick={() => setMail(null)} className="float-right text-xl leading-none text-gray-500">×</button><p className="text-xs text-gray-500">From {mail.from.address}</p><h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">{mail.subject || "(No subject)"}</h2><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-600">{mail.text || mail.intro}</p></article></div>}
    {confirmDelete && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"><section className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] p-6"><h2 className="text-lg font-bold text-[var(--text-primary)]">Delete this email?</h2><p className="mt-2 text-sm leading-6 text-gray-500">Are you sure you want to delete this email address?</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setConfirmDelete(null)} className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm">Cancel</button><button disabled={busy !== null} onClick={() => void remove()} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Delete</button></div></section></div>}
  </div>;
}
