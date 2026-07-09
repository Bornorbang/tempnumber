"use client";

import { useState, useEffect, useCallback } from "react";

type RentalRow = {
  id: number; user_id: number; user_name: string; user_email: string;
  getatext_id: number; number: string; service_name: string; end_time: string;
  price_usd: number; price_ngn: number; status: string; sms_code: string | null; rented_at: string;
  source?: string; country?: string;
};

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-green-500/15 text-green-400",
  completed: "bg-blue-500/15 text-blue-400",
  expired:   "bg-gray-500/15 text-gray-400",
  cancelled: "bg-red-500/15 text-red-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminRentalsPage() {
  const [rows, setRows]       = useState<RentalRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  function getToken() { return localStorage.getItem("tn_token") ?? ""; }

  const load = useCallback((q = "") => {
    setLoading(true);
    const qs = new URLSearchParams({ search: q, limit: "200" }).toString();
    fetch(`/api/admin/rentals?${qs}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => { setRows(data.rows ?? []); setTotal(data.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Rental History</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total rental{total !== 1 ? "s" : ""} across all users</p>
        </div>
        <input
          type="text"
          placeholder="Search user, number or service…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 w-64"
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
          <span>User</span>
          <span>Number</span>
          <span>Service</span>
          <span className="text-right">Price</span>
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
                <div className="hidden lg:grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center">
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{r.user_name}</p>
                    <p className="text-gray-500 text-xs">{r.user_email}</p>
                  </div>
                  <p className="text-[var(--text-primary)] text-sm font-mono">{r.number}</p>
                  <div>
                    <p className="text-gray-400 text-sm">{r.service_name}</p>
                    {r.country && <p className="text-gray-500 text-xs">{r.country}</p>}
                  </div>
                  <p className="text-[var(--text-primary)] text-sm font-semibold text-right">₦{r.price_ngn.toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-center ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                  <p className="text-gray-400 text-xs text-right whitespace-nowrap">{formatDate(r.rented_at)}</p>
                </div>
                {/* Mobile / tablet */}
                <div className="lg:hidden space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-[var(--text-primary)] text-sm font-medium">{r.user_name}</p>
                      <p className="text-gray-500 text-xs">{r.number} &middot; {r.service_name}</p>
                      {r.country && <p className="text-gray-500 text-xs">{r.country}</p>}
                    </div>
                    <p className="text-[var(--text-primary)] text-sm font-bold flex-shrink-0">₦{r.price_ngn.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? "bg-gray-500/15 text-gray-400"}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <p className="text-gray-500 text-xs">{formatDate(r.rented_at)}</p>
                  </div>
                  {r.sms_code && (
                    <p className="text-green-400 text-xs font-mono">Code: {r.sms_code}</p>
                  )}
                </div>
              </div>
            ))}
            {rows.length === 0 && !loading && (
              <p className="text-gray-500 text-sm text-center py-10">No rentals found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
