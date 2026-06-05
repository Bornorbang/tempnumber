"use client";

import { useState, useEffect, useCallback } from "react";

type TopupRow = {
  id: number; user_id: number; user_name: string; user_email: string;
  amount: number; method: string; status: string; reference: string | null; created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-500/15 text-green-400",
  pending:   "bg-yellow-500/15 text-yellow-400",
  failed:    "bg-red-500/15 text-red-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminWalletHistoryPage() {
  const [rows, setRows]       = useState<TopupRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  function getToken() { return localStorage.getItem("tn_token") ?? ""; }

  const load = useCallback((q = "") => {
    setLoading(true);
    const qs = new URLSearchParams({ search: q, limit: "200" }).toString();
    fetch(`/api/admin/topups?${qs}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => { setRows(data.rows ?? []); setTotal(data.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalRevenue = rows
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Wallet History</h1>
          <p className="text-gray-400 text-sm mt-1">
            {total} total top-up{total !== 1 ? "s" : ""} &middot; verified revenue ₦{totalRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <input
          type="text"
          placeholder="Search user or reference…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 w-64"
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
          <span>User</span>
          <span>Reference</span>
          <span className="text-right">Amount</span>
          <span className="text-center">Status</span>
          <span className="text-right">Date</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {rows.map((r) => (
              <div key={r.id} className="px-5 py-3.5">
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center">
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{r.user_name}</p>
                    <p className="text-gray-500 text-xs">{r.user_email}</p>
                  </div>
                  <p className="text-gray-400 text-xs font-mono truncate">{r.reference ?? r.method}</p>
                  <p className="text-[var(--text-primary)] text-sm font-bold text-right">₦{r.amount.toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-center ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                  <p className="text-gray-400 text-xs text-right whitespace-nowrap">{formatDate(r.created_at)}</p>
                </div>
                {/* Mobile */}
                <div className="sm:hidden space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[var(--text-primary)] text-sm font-medium">{r.user_name}</p>
                      <p className="text-gray-500 text-xs">{r.user_email}</p>
                    </div>
                    <p className="text-[var(--text-primary)] text-sm font-bold">₦{r.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <p className="text-gray-500 text-xs">{formatDate(r.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
            {rows.length === 0 && !loading && (
              <p className="text-gray-500 text-sm text-center py-10">No transactions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
