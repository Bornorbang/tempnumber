"use client";

import { useState, useEffect, useCallback } from "react";

type DedicatedRow = {
  id: number;
  getatext_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  number: string;
  period: string;
  price_ngn: number;
  status: string;
  end_time: string;
  auto_renew: boolean;
  rented_at: string;
};

const PERIOD_LABELS: Record<string, string> = {
  "1w": "1 Week", "2w": "2 Weeks", "1m": "1 Month",
};

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-green-500/15 text-green-400",
  Cancelled: "bg-red-500/15 text-red-400",
  Expired:   "bg-gray-500/15 text-gray-400",
};

export default function AdminDedicatedPage() {
  const [rows, setRows]               = useState<DedicatedRow[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [revenue, setRevenue]         = useState(0);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [cancelling, setCancelling]   = useState<number | null>(null);
  const [toast, setToast]             = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function getToken() { return localStorage.getItem("tn_token") ?? ""; }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  const load = useCallback((q = "") => {
    setLoading(true);
    const qs = new URLSearchParams({ search: q, limit: "500" }).toString();
    fetch(`/api/admin/dedicated?${qs}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => {
        setRows(data.rows ?? []);
        setActiveCount(data.active_count ?? 0);
        setRevenue(data.total_revenue ?? 0);
      })
      .catch(() => showToast("error", "Failed to load dedicated rentals"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCancel(row: DedicatedRow) {
    if (!confirm(`Cancel +${row.number} for ${row.user_name}? The number will be permanently released.`)) return;
    setCancelling(row.id);
    try {
      const res = await fetch("/api/admin/dedicated", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action: "cancel", id: row.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cancel failed");
      setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, status: "Cancelled" } : r));
      setActiveCount((c) => Math.max(0, c - 1));
      showToast("success", `+${row.number} cancelled`);
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setCancelling(null);
    }
  }

  const activeRows = rows.filter((r) => r.status === "Active");
  const pastRows   = rows.filter((r) => r.status !== "Active");

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Dedicated Numbers</h1>
          <p className="text-gray-400 text-sm mt-1">
            {activeCount} active · ₦{revenue.toLocaleString("en-NG", { minimumFractionDigits: 2 })} total revenue
          </p>
        </div>
        <input
          type="text"
          placeholder="Search user, number…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Active */}
          {activeRows.length > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)]">
                <h2 className="text-[var(--text-primary)] text-sm font-semibold">Active ({activeRows.length})</h2>
              </div>
              <div className="hidden lg:grid grid-cols-[1fr_160px_auto_auto_auto_auto_auto] gap-2 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
                <span>User</span><span>Number</span><span>Period</span>
                <span className="text-right">Price</span><span>Expires</span><span>AR</span><span>Action</span>
              </div>
              <div className="divide-y divide-[var(--border-color)]">
                {activeRows.map((r) => (
                  <div key={r.id} className="px-5 py-3.5">
                    <div className="hidden lg:grid grid-cols-[1fr_160px_auto_auto_auto_auto_auto] gap-2 items-center">
                      <div className="min-w-0">
                        <p className="text-[var(--text-primary)] text-sm font-medium truncate">{r.user_name}</p>
                        <p className="text-gray-500 text-xs truncate">{r.user_email}</p>
                      </div>
                      <p className="text-[var(--text-primary)] text-sm font-mono">+{r.number}</p>
                      <p className="text-gray-400 text-sm whitespace-nowrap">{PERIOD_LABELS[r.period] ?? r.period}</p>
                      <p className="text-[var(--text-primary)] text-sm font-semibold text-right whitespace-nowrap">₦{r.price_ngn.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs whitespace-nowrap">{r.end_time}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-center ${r.auto_renew ? "bg-blue-500/15 text-blue-400" : "bg-gray-500/10 text-gray-500"}`}>
                        {r.auto_renew ? "ON" : "OFF"}
                      </span>
                      <button
                        onClick={() => handleCancel(r)}
                        disabled={cancelling === r.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {cancelling === r.id ? "…" : "Cancel"}
                      </button>
                    </div>
                    {/* Mobile */}
                    <div className="lg:hidden flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[var(--text-primary)] text-sm font-medium truncate">{r.user_name}</p>
                        <p className="text-gray-500 text-xs truncate">{r.user_email}</p>
                        <p className="text-gray-400 text-xs font-mono mt-0.5">+{r.number}</p>
                        <p className="text-gray-500 text-xs">{PERIOD_LABELS[r.period] ?? r.period} · Expires {r.end_time}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <p className="text-[var(--text-primary)] text-sm font-bold">₦{r.price_ngn.toLocaleString()}</p>
                        <button
                          onClick={() => handleCancel(r)}
                          disabled={cancelling === r.id}
                          className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          {cancelling === r.id ? "…" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastRows.length > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)]">
                <h2 className="text-[var(--text-primary)] text-sm font-semibold">Past ({pastRows.length})</h2>
              </div>
              <div className="divide-y divide-[var(--border-color)]">
                {pastRows.map((r) => (
                  <div key={r.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[var(--text-primary)] text-sm font-medium">{r.user_name} <span className="text-gray-500 font-normal">({r.user_email})</span></p>
                      <p className="text-gray-400 text-xs font-mono">+{r.number} · {PERIOD_LABELS[r.period] ?? r.period} · Expired {r.end_time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[var(--text-primary)] text-sm font-semibold">₦{r.price_ngn.toLocaleString()}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rows.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-12">No dedicated rentals found.</p>
          )}
        </>
      )}
    </div>
  );
}
