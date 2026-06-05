"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { walletApi } from "@/lib/api";

interface TopupRecord {
  id: string;
  created_at: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
}

const STATUS_STYLES: Record<TopupRecord["status"], string> = {
  completed: "bg-green-500/10 text-green-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  failed: "bg-red-500/10 text-red-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [records, setRecords] = useState<TopupRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    walletApi.topups()
      .then((data) => {
        setRecords(data as unknown as TopupRecord[]);
        setLoaded(true);
      })
      .catch(() => { setLoaded(true); });
  }, []);

  const totalDeposited = records
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Top-up History</h1>
          <p className="text-gray-400 text-sm mt-0.5">A record of all wallet top-ups on your account</p>
        </div>
        <Link
          href="/dashboard/wallet"
          className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Top Up Wallet
        </Link>
      </div>

      {/* Stats row */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Deposited</p>
            <p className="text-[var(--text-primary)] text-xl font-bold">
              &#8358;{totalDeposited.toLocaleString()}
            </p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Transactions</p>
            <p className="text-[var(--text-primary)] text-xl font-bold">{records.length}</p>
          </div>
        </div>
      )}

      {/* Table / Empty state */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        {!loaded ? (
          /* Loading skeleton */
          <div className="divide-y divide-[var(--border-color)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-28" />
                <div className="h-4 bg-gray-700 rounded w-20 ml-auto" />
                <div className="h-4 bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-700 rounded-full w-20" />
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-[var(--bg-card-inner)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[var(--text-primary)] font-semibold text-base">No transactions yet</p>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">
              Top up your wallet to see your transaction history here.
            </p>
            <Link
              href="/dashboard/wallet"
              className="mt-5 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Top Up Wallet
            </Link>
          </div>
        ) : (
          /* Desktop table */
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
              <span>Date</span>
              <span>Ref Number</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>

            <div className="divide-y divide-[var(--border-color)]">
              {records.map((r) => (
                <div key={r.id} className="px-5 py-4">
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center">
                    <p className="text-[var(--text-primary)] text-sm">{formatDate(r.created_at)}</p>
                    <p className="text-gray-400 text-xs font-mono truncate">{r.reference ?? "—"}</p>
                    <p className="text-[var(--text-primary)] text-sm font-bold text-right">
                      &#8358;{r.amount.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full text-right ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>

                  {/* Mobile card */}
                  <div className="sm:hidden space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[var(--text-primary)] text-sm font-medium">{formatDate(r.created_at)}</p>
                        {r.reference && (
                          <p className="text-gray-500 text-xs font-mono mt-0.5">{r.reference}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[r.status]}`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{r.method}</span>
                      <span className="text-[var(--text-primary)] font-bold">&#8358;{r.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
