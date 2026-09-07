"use client";

import { useCallback, useEffect, useState } from "react";
import UsaApiDocumentation from "@/components/UsaApiDocumentation";
import WholesalePrices from "@/components/WholesalePrices";

type KeyInfo = { id: number; key_prefix: string; created_at: string; last_used_at: string | null };

export default function APIPage() {
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [tab, setTab] = useState<"key" | "docs">("key");
  const loadKey = useCallback((signal?: AbortSignal) => fetch("/api/developer/keys", {
    headers: { Authorization: `Bearer ${localStorage.getItem("tn_token") ?? ""}` },
    cache: "no-store",
    signal,
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Could not load your API key.");
    if (!signal?.aborted) setKeyInfo(data);
  }).catch(e => {
    if (!signal?.aborted) setError(e instanceof Error ? e.message : "Could not load your API key.");
  }).finally(() => {
    if (!signal?.aborted) setLoading(false);
  }), []);
  useEffect(() => {
    const controller = new AbortController();
    void loadKey(controller.signal);
    return () => controller.abort();
  }, [loadKey]);

  async function changeKey() {
    if (keyInfo && !window.confirm("Replace your API key? Your current key will stop working immediately.")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("tn_token") ?? ""}` },
        body: JSON.stringify({ action: "generate" }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update your API key.");
      setNewKey(data.key);
      setShowKey(false);
      setRevealedKey(null);
      await loadKey();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update your API key.");
    } finally { setBusy(false); }
  }

  async function toggleKey() {
    if (showKey) { setShowKey(false); setRevealedKey(null); return; }
    if (newKey) { setShowKey(true); return; }
    setRevealing(true);
    setError("");
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("tn_token") ?? ""}` },
        body: JSON.stringify({ action: "reveal" }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || typeof data.key !== "string") throw new Error(data.error ?? "Could not load API key.");
      setRevealedKey(data.key);
      setShowKey(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load API key.");
    } finally { setRevealing(false); }
  }

  return <div className="max-w-4xl space-y-6">
    <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">USA Reseller API</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">Sell USA SMS verification on your platform using your Temp Number wallet.</p></div>
    <WholesalePrices />
    <div className="flex w-fit gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1">
      {(["key", "docs"] as const).map(value => <button type="button" key={value} aria-pressed={tab === value} onClick={() => setTab(value)} className={`rounded-lg px-5 py-2 text-sm font-medium ${tab === value ? "bg-green-500 text-white" : "text-[var(--text-secondary)]"}`}>{value === "key" ? "API key" : "Documentation"}</button>)}
    </div>
    {tab === "docs" ? <UsaApiDocumentation /> : <div className="space-y-5">
      {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">{error} <button type="button" onClick={() => { setLoading(true); setError(""); void loadKey(); }} disabled={loading || busy} className="ml-2 underline">Retry</button></div>}
      <section className="space-y-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <div className="flex items-center justify-between"><h2 className="font-semibold text-[var(--text-primary)]">Your API key</h2>{keyInfo && <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">Active</span>}</div>
        {loading ? <p className="text-sm text-[var(--text-secondary)]">Loading key…</p> : keyInfo ? <>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] p-4">
            <code className="min-w-0 flex-1 break-all text-[var(--text-primary)]">{showKey && (newKey || revealedKey) ? (newKey || revealedKey) : `${keyInfo.key_prefix}${"\u2022".repeat(16)}`}</code>
            <button type="button" aria-label={showKey ? "Hide API key" : "Show API key"} aria-pressed={showKey} disabled={revealing || busy} onClick={() => void toggleKey()} className="shrink-0 rounded-lg p-2 text-[var(--text-secondary)] hover:text-green-500 focus-visible:outline-2 focus-visible:outline-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{showKey && <path d="m3 3 18 18" />}</svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]"><span>Created: {keyInfo.created_at}</span><span>Last used: {keyInfo.last_used_at ?? "Never"}</span></div>
          <div className="flex flex-wrap gap-3"><button type="button" disabled={busy || revealing} onClick={() => void changeKey()} className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--text-primary)] disabled:opacity-50">{busy ? "Updating…" : "Regenerate key"}</button></div>
        </> : <><p className="text-sm text-[var(--text-secondary)]">Generate a key to connect your platform. Each account has one active key.</p><button type="button" disabled={busy || !!error} onClick={() => void changeKey()} className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Generating…" : "Generate API key"}</button></>}
      </section>
    </div>}
  </div>;
}
