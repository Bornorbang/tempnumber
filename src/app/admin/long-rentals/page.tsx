"use client";

import { useState, useEffect, useCallback } from "react";

type LongRentalRow = {
  id: number;
  getatext_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  number: string;
  service_name: string;
  api_name: string;
  period: string;
  price_ngn: number;
  status: string;
  end_time: string;
  auto_renew: boolean;
  rented_at: string;
};

const PERIOD_LABELS: Record<string, string> = {
  "1d": "1 Day", "3d": "3 Days", "7d": "7 Days", "14d": "14 Days", "30d": "30 Days",
};

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-green-500/15 text-green-400",
  Cancelled: "bg-red-500/15 text-red-400",
  Expired:   "bg-gray-500/15 text-gray-400",
};

export default function AdminLongRentalsPage() {
  const [rows, setRows]               = useState<LongRentalRow[]>([]);
  const [total, setTotal]             = useState(0);
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
    fetch(`/api/admin/long-rentals?${qs}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => {
        setRows(data.rows ?? []);
        setTotal(data.total ?? 0);
        setActiveCount(data.active_count ?? 0);
        setRevenue(data.total_revenue ?? 0);
      })
      .catch(() => showToast("error", "Failed to load rentals"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCancel(row: LongRentalRow) {
    if (!confirm(`Cancel ${row.number} (${row.service_name}) for ${row.user_name}? This cannot be undone.`)) return;
    setCancelling(row.id);
    try {
      const res = await fetch("/api/admin/long-rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action: "cancel", id: row.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cancel failed");
      setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, status: "Cancelled" } : r));
      setActiveCount((c) => Math.max(0, c - 1));
      showToast("success", `${row.number} cancelled`);
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setCancelling(null);
    }
  }

  const activeRows = rows.filter((r) => r.status === "Active");
  const pastRows   = rows.filter((r) => r.status !== "Active");

  const COLS_ACTIVE = "grid-cols-[1fr_160px_1fr_auto_auto_auto_auto_auto]";
  const COLS_PAST   = "grid-cols-[1fr_160px_1fr_auto_auto_auto_auto]";

  function TableHeader({ showAction }: { showAction: boolean }) {
    return (
      <div className={`hidden lg:grid gap-2 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide ${showAction ? COLS_ACTIVE : COLS_PAST}`}>
        <span>User</span>
        <span>Number</span>
        <span>Service</span>
        <span>Period</span>
        <span className="text-right">Price</span>
        <span>Expires</span>
        <span className="text-center">Status</span>
        {showAction && <span className="text-center">Action</span>}
      </div>
    );
  }

  function RentalRow({ r, showAction }: { r: LongRentalRow; showAction: boolean }) {
    return (
      <div className="px-5 py-3.5">
        {/* Desktop */}
        <div className={`hidden lg:grid gap-2 items-center ${showAction ? COLS_ACTIVE : COLS_PAST}`}>
          <div className="min-w-0">
            <p className="text-[var(--text-primary)] text-sm font-medium truncate">{r.user_name}</p>
            <p className="text-gray-500 text-xs truncate">{r.user_email}</p>
          </div>
          <p className="text-[var(--text-primary)] text-sm font-mono whitespace-nowrap">{r.number}</p>
          <p className="text-gray-400 text-sm whitespace-nowrap">{r.service_name}</p>
          <p className="text-gray-400 text-sm whitespace-nowrap">{PERIOD_LABELS[r.period] ?? r.period}</p>
          <p className="text-[var(--text-primary)] text-sm font-semibold text-right whitespace-nowrap">₦{r.price_ngn.toLocaleString()}</p>
          <p className="text-gray-400 text-xs whitespace-nowrap">{r.end_time}</p>
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
              {r.status}
            </span>
            {r.auto_renew && r.status === "Active" && (
              <span className="text-[10px] text-blue-400 font-medium">Auto-renew</span>
            )}
          </div>
          {showAction && (
            <div className="flex justify-center">
              <button
                onClick={() => handleCancel(r)}
                disabled={cancelling === r.id}
                className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {cancelling === r.id ? "…" : "Cancel"}
              </button>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[var(--text-primary)] text-sm font-medium truncate">{r.user_name}</p>
              <p className="text-gray-500 text-xs truncate">{r.user_email}</p>
              <p className="text-gray-400 text-xs font-mono mt-0.5">{r.number}</p>
              <p className="text-gray-500 text-xs">{r.service_name} · {PERIOD_LABELS[r.period] ?? r.period} · Expires {r.end_time}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <p className="text-[var(--text-primary)] text-sm font-bold">₦{r.price_ngn.toLocaleString()}</p>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                  {r.status}
                </span>
                {r.auto_renew && r.status === "Active" && (
                  <span className="text-[10px] text-blue-400 font-medium">AR</span>
                )}
              </div>
              {showAction && (
                <button
                  onClick={() => handleCancel(r)}
                  disabled={cancelling === r.id}
                  className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {cancelling === r.id ? "…" : "Cancel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Long-Term Rentals</h1>
          <p className="text-gray-400 text-sm mt-1">{total} rental{total !== 1 ? "s" : ""} · {activeCount} active · ₦{revenue.toLocaleString()} total revenue</p>
        </div>
        <input
          type="text"
          placeholder="Search user, number or service…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <>
          {/* ── Active ── */}
          <div>
            <h2 className="text-[var(--text-primary)] text-base font-semibold mb-2">
              Active <span className="text-green-500 ml-1">{activeRows.length}</span>
            </h2>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
              <TableHeader showAction={true} />
              <div className="divide-y divide-[var(--border-color)]">
                {activeRows.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No active rentals.</p>
                ) : (
                  activeRows.map((r) => <RentalRow key={r.id} r={r} showAction={true} />)
                )}
              </div>
            </div>
          </div>

          {/* ── Past ── */}
          {pastRows.length > 0 && (
            <div>
              <h2 className="text-[var(--text-primary)] text-base font-semibold mb-2">
                Past <span className="text-gray-500 ml-1">{pastRows.length}</span>
              </h2>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                <TableHeader showAction={false} />
                <div className="divide-y divide-[var(--border-color)]">
                  {pastRows.map((r) => <RentalRow key={r.id} r={r} showAction={false} />)}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
