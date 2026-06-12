"use client";

import { useState, useEffect, useCallback } from "react";

type LedgerRow = {
  type: "credit" | "debit";
  amount: number;
  service: string;
  user_name: string;
  user_email: string;
  event_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function getToken() { return localStorage.getItem("tn_token") ?? ""; }

const PAGE_SIZE = 20;

export default function AdminWalletHistoryPage() {
  const [rows, setRows]                 = useState<LedgerRow[]>([]);
  const [total, setTotal]               = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDebits, setTotalDebits]   = useState(0);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState<"" | "credit" | "debit">("");
  const [page, setPage]                 = useState(0);

  const load = useCallback((q = "", t = "", p = 0) => {
    setLoading(true);
    const qs = new URLSearchParams({
      search: q,
      type: t,
      limit: String(PAGE_SIZE),
      offset: String(p * PAGE_SIZE),
    }).toString();
    fetch(`/api/admin/wallet-ledger?${qs}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setRows(data.rows ?? []);
        setTotal(data.total ?? 0);
        setTotalCredits(data.total_credits ?? 0);
        setTotalDebits(data.total_debits ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function handleSearch(val: string) { setSearch(val); setPage(0); load(val, typeFilter, 0); }
  function handleType(val: "" | "credit" | "debit") { setTypeFilter(val); setPage(0); load(search, val, 0); }
  function goToPage(p: number) { setPage(p); load(search, typeFilter, p); }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Wallet Ledger</h1>
          <p className="text-gray-400 text-sm mt-1">
            {total} transaction{total !== 1 ? "s" : ""}&nbsp;&middot;&nbsp;
            <span className="text-green-400">+₦{totalCredits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
            &nbsp;&middot;&nbsp;
            <span className="text-red-400">−₦{totalDebits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
            &nbsp;&middot;&nbsp;page {page + 1} of {totalPages || 1}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type filter pills */}
          <div className="flex rounded-xl overflow-hidden border border-[var(--border-color)] text-xs font-medium">
            {(["", "credit", "debit"] as const).map((v) => (
              <button
                key={v}
                onClick={() => handleType(v)}
                className={`px-3 py-2 transition-colors ${
                  typeFilter === v
                    ? "bg-green-500 text-white"
                    : "bg-[var(--bg-card)] text-gray-400 hover:text-[var(--text-primary)]"
                }`}
              >
                {v === "" ? "All" : v === "credit" ? "Credits" : "Debits"}
              </button>
            ))}
          </div>
          {/* Search */}
          <input
            type="text"
            placeholder="Search user or service…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2 placeholder-gray-500 focus:outline-none focus:border-green-500 w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[1.6fr_1.6fr_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
          <span>User</span>
          <span>Service</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Date / Time</span>
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
            {rows.map((r, i) => (
              <div key={i} className="px-5 py-3.5">
                {/* Desktop row */}
                <div className="hidden sm:grid grid-cols-[1.6fr_1.6fr_auto_auto] gap-4 items-center">
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{r.user_name}</p>
                    <p className="text-gray-500 text-xs">{r.user_email}</p>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{r.service}</p>
                  <p className={`text-sm font-semibold text-right tabular-nums whitespace-nowrap ${
                    r.type === "credit" ? "text-green-400" : "text-red-400"
                  }`}>
                    {r.type === "credit" ? "+" : "−"}₦{r.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-gray-400 text-xs text-right whitespace-nowrap">{formatDate(r.event_at)}</p>
                </div>

                {/* Mobile row */}
                <div className="sm:hidden space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[var(--text-primary)] text-sm font-medium truncate">{r.user_name}</p>
                      <p className="text-gray-500 text-xs truncate">{r.user_email}</p>
                    </div>
                    <p className={`text-sm font-semibold shrink-0 tabular-nums ${
                      r.type === "credit" ? "text-green-400" : "text-red-400"
                    }`}>
                      {r.type === "credit" ? "+" : "−"}₦{r.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-gray-400 text-xs truncate">{r.service}</p>
                    <p className="text-gray-500 text-xs shrink-0">{formatDate(r.event_at)}</p>
                  </div>
                </div>
              </div>
            ))}
            {rows.length === 0 && !loading && (
              <p className="text-gray-500 text-sm text-center py-10">No transactions found.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-[var(--border-color)]">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0 || loading}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const show = i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1;
                const ellipsisBefore = i === 1 && page > 3;
                const ellipsisAfter  = i === totalPages - 2 && page < totalPages - 4;
                if (!show) return null;
                return (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    disabled={loading}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                      i === page
                        ? "bg-green-500 text-white"
                        : "bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {ellipsisBefore || ellipsisAfter ? "…" : i + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
