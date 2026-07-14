"use client";

import { useCallback, useEffect, useState } from "react";

type Email = { id: number; address: string; status: string; deleted_at?: string | null; created_at: string; expires_at: string; user_id: number; user_name: string; user_email: string };
type Mail = { id: string; subject: string; intro: string; from: { address: string; name?: string }; text?: string };

function getToken() { return localStorage.getItem("tn_token") ?? ""; }
function formatDate(value: string) { return new Date(value.replace(" ", "T") + "Z").toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }); }

export default function AdminTempMailPage() {
  const [rows, setRows] = useState<Email[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inbox, setInbox] = useState<Email | null>(null);
  const [messages, setMessages] = useState<Mail[]>([]);
  const [selected, setSelected] = useState<Mail | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const request = useCallback(async (path: string) => {
    const response = await fetch("/api/admin/temp-mail" + path, { headers: { Authorization: "Bearer " + getToken() } });
    const data = await response.json().catch(() => ({ error: "Invalid server response" }));
    if (!response.ok) throw new Error(data.error ?? "Request failed");
    return data;
  }, []);
  const load = useCallback(async (query = "") => {
    setLoading(true);
    try { const data = await request("?action=list&search=" + encodeURIComponent(query)); setRows(data.rows ?? []); setTotal(data.total ?? 0); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load temporary emails."); }
    finally { setLoading(false); }
  }, [request]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function loadMessages(email: Email) {
    setRefreshing(true); setMessages([]); setError("");
    try { const data = await request("?action=messages&inbox_id=" + email.id); setMessages(Array.isArray(data) ? data : data["hydra:member"] ?? []); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load messages."); }
    finally { setRefreshing(false); }
  }
  async function openInbox(email: Email) { setInbox(email); setSelected(null); await loadMessages(email); }
  async function openMessage(message: Mail) {
    if (!inbox) return;
    try { setSelected(await request("?action=message&inbox_id=" + inbox.id + "&message_id=" + encodeURIComponent(message.id)) as Mail); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not open message."); }
  }
  async function updateEmail(action: "return" | "delete", email: Email) {
    if (action === "delete" && !window.confirm("Permanently delete this provider inbox? This cannot be undone.")) return;
    setUpdatingId(email.id); setError("");
    try { await fetch("/api/admin/temp-mail?action=" + action + "&id=" + email.id, { method: "POST", headers: { Authorization: "Bearer " + getToken() } }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Could not update email."); }); await load(search); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update email."); }
    finally { setUpdatingId(null); }
  }
  async function deleteAll() {
    if (!window.confirm("Delete all temporary email records from the admin list? This cannot be undone.")) return;
    setUpdatingId(-1); setError("");
    try { await fetch("/api/admin/temp-mail?action=delete_all", { method: "POST", headers: { Authorization: "Bearer " + getToken() } }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Could not delete records."); }); await load(search); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not delete records."); }
    finally { setUpdatingId(null); }
  }

  return <div className="max-w-6xl space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Temporary Emails</h1><p className="mt-1 text-sm text-gray-400">{total} address{total === 1 ? "" : "es"} retained for administration</p></div><div className="flex gap-3"><input value={search} onChange={(event) => { setSearch(event.target.value); void load(event.target.value); }} placeholder="Search email or user..." className="w-64 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-green-500" /><button disabled={!total || updatingId !== null} onClick={() => void deleteAll()} className="rounded-xl border border-red-400 px-4 py-2.5 text-sm font-semibold text-red-500 disabled:opacity-50">Delete all</button></div></header>
    {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
    <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-[var(--bg-card-inner)] text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3 font-medium">Email address</th><th className="px-5 py-3 font-medium">User</th><th className="px-5 py-3 font-medium">Created</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Messages</th><th className="px-5 py-3 font-medium">Admin action</th></tr></thead><tbody>{loading ? <tr><td colSpan={6} className="py-14 text-center text-gray-500">Loading temporary emails...</td></tr> : rows.length ? rows.map((email) => <tr key={email.id} className="border-t border-[var(--border-color)]"><td className="px-5 py-4 font-medium text-[var(--text-primary)]">{email.address}</td><td className="px-5 py-4"><p className="text-[var(--text-primary)]">{email.user_name}</p><p className="mt-1 text-xs text-gray-500">{email.user_email}</p></td><td className="px-5 py-4 text-xs text-gray-500">{formatDate(email.created_at)}</td><td className="px-5 py-4"><p className="text-xs font-semibold text-green-500">{email.status === "hidden" ? "Removed by user" : email.expires_at < new Date().toISOString().slice(0, 19).replace("T", " ") ? "Expired" : "Visible to user"}</p><p className="mt-1 text-xs text-gray-500">Expires {formatDate(email.expires_at)}</p></td><td className="px-5 py-4"><button onClick={() => void openInbox(email)} className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]">View messages</button></td><td className="px-5 py-4"><div className="flex gap-2"><button disabled={updatingId !== null} onClick={() => void updateEmail("return", email)} className="rounded-lg border border-green-500 px-3 py-2 text-xs font-semibold text-green-500 disabled:opacity-50">{updatingId === email.id ? "Working..." : "Return"}</button><button disabled={updatingId !== null} onClick={() => void updateEmail("delete", email)} className="rounded-lg border border-red-400 px-3 py-2 text-xs font-semibold text-red-500 disabled:opacity-50">Delete</button></div></td></tr>) : <tr><td colSpan={6} className="py-14 text-center text-gray-500">No temporary emails found.</td></tr>}</tbody></table></div></section>
    {inbox && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setInbox(null)}><section className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-[var(--bg-card)]" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between border-b border-[var(--border-color)] p-5"><div><h2 className="font-bold text-[var(--text-primary)]">Messages</h2><p className="mt-1 text-sm text-gray-500">{inbox.address} · {inbox.user_name}</p></div><div className="flex gap-3"><button disabled={refreshing} onClick={() => void loadMessages(inbox)} className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] disabled:opacity-50">{refreshing ? "Refreshing..." : "Refresh"}</button><button onClick={() => setInbox(null)} className="text-sm text-gray-500">Close</button></div></header>{messages.length ? messages.map((message) => <button key={message.id} onClick={() => void openMessage(message)} className="w-full border-b border-[var(--border-color)] p-4 text-left hover:bg-[var(--bg-card-inner)]"><p className="font-medium text-[var(--text-primary)]">{message.from.name || message.from.address}</p><p className="mt-1 text-sm text-[var(--text-primary)]">{message.subject || "(No subject)"}</p><p className="mt-1 truncate text-xs text-gray-500">{message.intro}</p></button>) : <p className="p-10 text-center text-sm text-gray-500">{refreshing ? "Loading messages..." : "No messages yet."}</p>}</section></div>}
    {selected && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}><article className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-[var(--bg-card)] p-6" onClick={(event) => event.stopPropagation()}><button onClick={() => setSelected(null)} className="float-right text-sm text-gray-500">Close</button><p className="text-xs text-gray-500">From {selected.from.address}</p><h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">{selected.subject || "(No subject)"}</h2><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-600">{selected.text || selected.intro}</p></article></div>}
  </div>;
}
