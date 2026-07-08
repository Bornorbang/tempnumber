"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type KeyInfo = {
  id: number;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
} | null;

function fmtDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "https://your-domain.com";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/prices",
    title: "List Service Prices",
    desc: "Returns all available services with their NGN prices and stock counts.",
    request: null,
    response: `[\n  {\n    "service_name": "WhatsApp",\n    "api_name": "whatsapp",\n    "price_ngn": 2156,\n    "stock": 142,\n    "ttl": 300\n  }\n]`,
  },
  {
    method: "POST",
    path: "/api/v1/rent",
    title: "Rent a Number",
    desc: "Rents a number for the specified service. Deducts from your wallet.",
    request: `{\n  "service": "whatsapp"\n}`,
    response: `{\n  "id": 12345,\n  "number": "+12025551234",\n  "service_name": "WhatsApp",\n  "price_ngn": 2156,\n  "status": "active",\n  "end_time": "2026-06-22T10:15:00Z",\n  "new_balance": 13200.00\n}`,
  },
  {
    method: "POST",
    path: "/api/v1/status",
    title: "Check Rental Status",
    desc: "Polls the status of a rental. Call every 5â€“10 s until status is completed, expired, or cancelled.",
    request: `{\n  "id": 12345\n}`,
    response: `{\n  "status": "completed",\n  "code": "654321",\n  "end_time": "2026-06-22T10:15:00Z"\n}`,
  },
  {
    method: "POST",
    path: "/api/v1/cancel",
    title: "Cancel Rental",
    desc: "Cancels an active rental. Auto-refunds your wallet if no code was received.",
    request: `{\n  "id": 12345\n}`,
    response: `{\n  "status": "cancelled",\n  "refunded": true,\n  "refund_ngn": 2156.00,\n  "new_balance": 15356.00\n}`,
  },
  {
    method: "GET",
    path: "/api/v1/rentals",
    title: "List Rentals",
    desc: "Returns your last 100 rentals (most recent first).",
    request: null,
    response: `[\n  {\n    "id": 12345,\n    "number": "+12025551234",\n    "service_name": "WhatsApp",\n    "status": "completed",\n    "sms_code": "654321",\n    "price_ngn": 2156,\n    "rented_at": "2026-06-22T10:10:00Z"\n  }\n]`,
  },
];

export default function APIPage() {
  const [keyInfo, setKeyInfo] = useState<KeyInfo>(undefined as unknown as KeyInfo);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"key" | "docs">("key");

  function getToken() {
    return localStorage.getItem("tn_token") ?? "";
  }

  async function loadKey() {
    setLoading(true);
    try {
      const res = await fetch("/api/developer/keys", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setKeyInfo(data ?? null);
    } catch {
      setKeyInfo(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKey();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function generate(isRegen: boolean) {
    if (isRegen && !confirm("This will invalidate your current key. Any apps using it will stop working. Continue?")) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewKey(data.key);
        loadKey();
      }
    } finally {
      setGenerating(false);
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Developer API</h1>
        <p className="text-gray-400 text-sm mt-1">
          Build your own platform on top of Temp Number using our REST API.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 w-fit">
        {(["key", "docs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-green-500 text-white"
                : "text-gray-400 hover:text-[var(--text-primary)]"
            }`}
          >
            {t === "key" ? "API Key" : "Documentation"}
          </button>
        ))}
      </div>

      {/* â”€â”€ API Key tab â”€â”€ */}
      {tab === "key" && (
        <div className="space-y-4">
          {/* New key banner */}
          {newKey && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-400 text-sm font-semibold">Copy your API key â€” it won&apos;t be shown again.</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs font-mono text-green-400 break-all">
                  {newKey}
                </code>
                <button
                  onClick={() => copy(newKey)}
                  className="flex-shrink-0 px-3 py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button onClick={() => setNewKey(null)} className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                I&apos;ve saved it, dismiss
              </button>
            </div>
          )}

          {/* Key card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            {loading ? (
              <div className="flex justify-center py-6">
                <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            ) : keyInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Your API Key</p>
                  <span className="text-[10px] bg-green-500/15 text-green-400 font-semibold px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <code className="flex-1 font-mono text-sm text-[var(--text-primary)] truncate">
                    {keyInfo.key_prefix}&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                  </code>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Generated {fmtDate(keyInfo.created_at)}</span>
                  <span>Last used: {fmtDate(keyInfo.last_used_at)}</span>
                </div>
                <button
                  onClick={() => generate(true)}
                  disabled={generating}
                  className="w-full py-2.5 border border-[var(--border-color)] hover:border-red-500/50 text-gray-400 hover:text-red-400 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Regenerate key
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-semibold">No API key yet</p>
                  <p className="text-gray-400 text-sm mt-1">Generate a key to start using the API.</p>
                </div>
                <button
                  onClick={() => generate(false)}
                  disabled={generating}
                  className="px-6 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  {generating ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : null}
                  Generate API Key
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* â”€â”€ Documentation tab â”€â”€ */}
      {tab === "docs" && (
        <div className="space-y-5">
          {/* Overview */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
            <h2 className="text-[var(--text-primary)] font-semibold">Overview</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rent temporary phone numbers programmatically. Your users order through your platform â€” we handle numbers and SMS delivery, charging your wallet balance.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Base URL</p>
                <code className="block bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-green-400 font-mono truncate">
                  {BASE_URL}/api/v1
                </code>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Auth Header</p>
                <code className="block bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-green-400 font-mono truncate">
                  X-API-Key: tn_â€¦
                </code>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          {ENDPOINTS.map((ep) => (
            <div key={ep.path} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${ep.method === "GET" ? "bg-blue-500/15 text-blue-400" : "bg-green-500/15 text-green-400"}`}>
                  {ep.method}
                </span>
                <code className="text-[var(--text-primary)] text-sm font-mono">{ep.path}</code>
              </div>
              <p className="text-[var(--text-primary)] font-medium text-sm">{ep.title}</p>
              <p className="text-gray-400 text-sm">{ep.desc}</p>
              {ep.request && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">Request Body</p>
                  <pre className="bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-xs text-gray-300 font-mono overflow-x-auto">{ep.request}</pre>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">Response</p>
                <pre className="bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-xs text-gray-300 font-mono overflow-x-auto">{ep.response}</pre>
              </div>
            </div>
          ))}

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
            <p className="text-yellow-400 text-sm font-semibold mb-1">Wallet &amp; Rate Limits</p>
            <p className="text-gray-400 text-sm">
              60 requests per minute per key. Keep your{" "}
              <Link href="/dashboard/wallet" className="text-green-500 hover:underline">wallet</Link>{" "}
              topped up â€” each rental deducts from your balance. Contact support for higher limits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

