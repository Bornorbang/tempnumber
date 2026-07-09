"use client";

import { useState, useEffect, useCallback } from "react";

type ReferralRow = {
  referrer_id: number;
  referrer_name: string;
  referrer_email: string;
  referred_id: number;
  referred_name: string;
  referred_email: string;
  referred_joined_at: string;
  referral_reward_paid: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminReferralsPage() {
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  function getToken() {
    return localStorage.getItem("tn_token") ?? "";
  }

  const load = useCallback((q = "") => {
    setLoading(true);
    const qs = new URLSearchParams({ search: q, limit: "200" }).toString();
    fetch(`/api/admin/referrals?${qs}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => {
        setRows(data.rows ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Referrals</h1>
          <p className="text-gray-400 text-sm mt-1">
            {total} qualified referral{total !== 1 ? "s" : ""} (completed first transaction)
          </p>
        </div>
        <input
          type="text"
          placeholder="Search referrer or referred user…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            load(e.target.value);
          }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 w-72"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
          <span>Referrer</span>
          <span>Referrer Email</span>
          <span>Referred User</span>
          <span className="text-right">Joined</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {rows.map((r, idx) => (
              <div key={`${r.referrer_id}-${r.referred_id}-${idx}`} className="px-5 py-3.5">
                {/* Desktop */}
                <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                  <p className="text-[var(--text-primary)] text-sm font-medium truncate">
                    {r.referrer_name}
                  </p>
                  <p className="text-gray-400 text-sm truncate">{r.referrer_email}</p>
                  <div>
                    <p className="text-green-500 text-sm font-medium truncate">{r.referred_name}</p>
                    <p className="text-gray-500 text-xs truncate">{r.referred_email}</p>
                  </div>
                  <p className="text-gray-400 text-xs text-right whitespace-nowrap">
                    {formatDate(r.referred_joined_at)}
                  </p>
                </div>

                {/* Mobile */}
                <div className="lg:hidden space-y-2">
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{r.referrer_name}</p>
                    <p className="text-gray-500 text-xs truncate">{r.referrer_email}</p>
                  </div>
                  <div className="pl-4 border-l-2 border-green-500/30">
                    <p className="text-green-500 text-sm font-medium">{r.referred_name}</p>
                    <p className="text-gray-500 text-xs truncate">{r.referred_email}</p>
                    <p className="text-gray-500 text-xs mt-1">{formatDate(r.referred_joined_at)}</p>
                  </div>
                </div>
              </div>
            ))}
            {rows.length === 0 && !loading && (
              <p className="text-gray-500 text-sm text-center py-10">No qualified referrals found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
