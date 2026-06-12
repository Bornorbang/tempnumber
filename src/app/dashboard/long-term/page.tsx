"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { longRentalsApi, ApiError, type LongRentalService, type LongRental, type LongRentalMessage } from "@/lib/api";

// ── Period labels ──────────────────────────────────────────────────────────────
const PERIOD_LABELS: Record<string, string> = {
  "1d": "1 Day", "3d": "3 Days", "7d": "7 Days", "14d": "14 Days", "30d": "30 Days",
};

// ── Toast ──────────────────────────────────────────────────────────────────────
type Toast = { id: number; type: "success" | "error"; title: string; body?: string };
let _toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((type: Toast["type"], title: string, body?: string) => {
    const id = ++_toastId;
    setToasts((t) => [...t, { id, type, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return { toasts, add };
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function LongTermPage() {
  const { user, refreshUser } = useAuth();
  const { toasts, add: addToast } = useToast();

  const [tab, setTab] = useState<"browse" | "my">("browse");

  // Browse
  const [services, setServices]     = useState<LongRentalService[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [selPeriod, setSelPeriod]   = useState("1d");

  // My rentals
  const [rentals, setRentals]       = useState<LongRental[]>([]);
  const [loadingRentals, setLoadingRentals] = useState(false);

  // Rent modal
  const [rentTarget, setRentTarget] = useState<{ svc: LongRentalService; period: string; priceUsd: number; priceNgn: number } | null>(null);
  const [renting, setRenting]       = useState(false);
  const [autoRenew, setAutoRenew]   = useState(false);

  // Disabled modal
  const [showDisabledModal, setShowDisabledModal] = useState(false);

  // Messages modal
  const [msgTarget, setMsgTarget]   = useState<LongRental | null>(null);
  const [messages, setMessages]     = useState<LongRentalMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // Action loading states
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // ── Fetch prices ─────────────────────────────────────────────────────────────
  useEffect(() => {
    longRentalsApi.prices()
      .then((d) => setServices((d.services ?? []).slice().sort((a, b) => a.service_name.localeCompare(b.service_name))))
      .catch(() => setServices([]))
      .finally(() => setLoadingPrices(false));
  }, []);

  // ── Fetch my rentals ──────────────────────────────────────────────────────────
  const fetchRentals = useCallback(async () => {
    setLoadingRentals(true);
    try {
      const rows = await longRentalsApi.list();
      setRentals(Array.isArray(rows) ? rows : []);
    } catch {
      addToast("error", "Could not load rentals");
    } finally {
      setLoadingRentals(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "my") fetchRentals();
  }, [tab]);

  // ── Open rent modal ───────────────────────────────────────────────────────────
  function openRent(svc: LongRentalService, period: string) {
    if (user?.is_disabled) {
      setShowDisabledModal(true);
      return;
    }
    const p = svc.prices.find((x) => x.period === period);
    if (!p) return;
    setRentTarget({ svc, period, priceUsd: parseFloat(p.cost), priceNgn: p.price_ngn });
    setAutoRenew(false);
  }

  // ── Confirm rent ──────────────────────────────────────────────────────────────
  async function confirmRent() {
    if (!rentTarget) return;
    setRenting(true);
    try {
      const res = await longRentalsApi.create({
        service:    rentTarget.svc.api_name,
        period:     rentTarget.period,
        auto_renew: autoRenew,
        price_usd:  rentTarget.priceUsd,
        price_ngn:  rentTarget.priceNgn,
      });
      addToast("success", "Number rented!", `${res.rental.number} · ₦${rentTarget.priceNgn.toLocaleString()} deducted`);
      setRentTarget(null);
      await refreshUser();
      if (tab === "my") fetchRentals();
    } catch (e) {
      addToast("error", "Rent failed", e instanceof ApiError ? e.message : "Please try again.");
    } finally {
      setRenting(false);
    }
  }

  // ── Auto-renew toggle ──────────────────────────────────────────────────────────
  async function handleAutoRenew(rental: LongRental) {
    const next = !rental.auto_renew;
    setActionLoading((s) => ({ ...s, [`ar-${rental.number}`]: true }));
    try {
      await longRentalsApi.setAutoRenew(rental.number, next, rental.api_name);
      setRentals((r) => r.map((x) => x.number === rental.number ? { ...x, auto_renew: next } : x));
      addToast("success", next ? "Auto-renew enabled" : "Auto-renew disabled");
    } catch (e) {
      addToast("error", "Failed to update auto-renew", e instanceof ApiError ? e.message : "Please try again.");
    } finally {
      setActionLoading((s) => ({ ...s, [`ar-${rental.number}`]: false }));
    }
  }

  // ── Renew ─────────────────────────────────────────────────────────────────────
  async function handleRenew(rental: LongRental) {
    if (!confirm(`Renew ${rental.number}? ₦${rental.price_ngn.toLocaleString()} will be deducted.`)) return;
    setActionLoading((s) => ({ ...s, [`renew-${rental.number}`]: true }));
    try {
      const res = await longRentalsApi.renew(rental.number, rental.api_name);
      addToast("success", "Renewed!", `Expires ${res.rental.end_time}`);
      await refreshUser();
      fetchRentals();
    } catch (e) {
      addToast("error", "Renew failed", e instanceof ApiError ? e.message : "Please try again.");
    } finally {
      setActionLoading((s) => ({ ...s, [`renew-${rental.number}`]: false }));
    }
  }

  // ── Messages ──────────────────────────────────────────────────────────────────
  async function openMessages(rental: LongRental) {
    setMsgTarget(rental);
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const res = await longRentalsApi.messages(rental.number, rental.api_name);
      setMessages(res.messages ?? []);
    } catch {
      addToast("error", "Could not load messages");
    } finally {
      setLoadingMsgs(false);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever rentals list changes
  useEffect(() => { setPage(1); }, [rentals]);

  const activeRentals   = rentals.filter((r) => r.status === "Active");
  const inactiveRentals = rentals.filter((r) => r.status !== "Active");
  const allRentals      = [...activeRentals, ...inactiveRentals]; // active first
  const totalPages      = Math.ceil(allRentals.length / PAGE_SIZE);
  const pagedRentals    = allRentals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedActive     = pagedRentals.filter((r) => r.status === "Active");
  const pagedInactive   = pagedRentals.filter((r) => r.status !== "Active");

  // Period picker: only show periods that exist across services
  const availablePeriods = Array.from(
    new Set(services.flatMap((s) => s.prices.map((p) => p.period)))
  ).sort((a, b) => {
    const order = ["1d", "3d", "7d", "14d", "30d"];
    return order.indexOf(a) - order.indexOf(b);
  });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen">
      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm max-w-xs pointer-events-auto ${
              t.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <p className="font-semibold">{t.title}</p>
            {t.body && <p className="opacity-90 text-xs mt-0.5">{t.body}</p>}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Long-Term Rentals</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            Rent a dedicated number for a specific service over days or weeks. Receive all incoming SMS for that service on your number.
          </p>
        </div>

        {/* Balance pill */}
        {user && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              Wallet: ₦{user.wallet_balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl w-fit mb-6">
          {(["browse", "my"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-white dark:bg-[#1a2235] text-slate-900 dark:text-white shadow"
                  : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
              }`}
            >
              {t === "browse" ? "Browse Services" : `My Rentals${activeRentals.length ? ` (${activeRentals.length})` : ""}`}
            </button>
          ))}
        </div>

        {/* ── BROWSE TAB ───────────────────────────────────────────────────── */}
        {tab === "browse" && (
          <div>
            {/* Period selector */}
            {!loadingPrices && availablePeriods.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {availablePeriods.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelPeriod(p)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selPeriod === p
                        ? "bg-green-500 text-white border-green-500"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:border-green-400"
                    }`}
                  >
                    {PERIOD_LABELS[p] ?? p}
                  </button>
                ))}
              </div>
            )}

            {loadingPrices ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl">
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Service long rentals coming soon.</p>
                <p className="text-slate-400 dark:text-gray-500 text-xs mt-1">This feature will be available shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {services.map((svc) => {
                  const price = svc.prices.find((p) => p.period === selPeriod);
                  if (!price) return null;
                  return (
                    <div
                      key={svc.api_name}
                      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col gap-3 hover:border-green-500/30 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{svc.service_name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{PERIOD_LABELS[selPeriod] ?? selPeriod}</p>
                      </div>
                      <p className="text-green-500 font-bold text-base">
                        ₦{price.price_ngn.toLocaleString()}
                      </p>
                      <button
                        onClick={() => openRent(svc, selPeriod)}
                        className="w-full bg-green-500 hover:bg-green-400 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                      >
                        Rent
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MY RENTALS TAB ───────────────────────────────────────────────── */}
        {tab === "my" && (
          <div>
            {loadingRentals ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : rentals.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 dark:text-gray-400 text-sm">No long-term rentals yet.</p>
                <button
                  onClick={() => setTab("browse")}
                  className="mt-3 text-green-500 text-sm font-medium hover:underline"
                >
                  Browse services →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pagedActive.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active</p>
                    {pagedActive.map((r) => (
                      <RentalCard
                        key={r.id}
                        rental={r}
                        onRenew={handleRenew}
                        onMessages={openMessages}
                        onAutoRenew={handleAutoRenew}
                        loading={actionLoading}
                      />
                    ))}
                  </>
                )}
                {pagedInactive.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-1">Past</p>
                    {pagedInactive.map((r) => (
                      <RentalCard
                        key={r.id}
                        rental={r}
                        onRenew={handleRenew}
                        onMessages={openMessages}
                        onAutoRenew={handleAutoRenew}
                        loading={actionLoading}
                        disabled
                      />
                    ))}
                  </>
                )}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs text-slate-500 dark:text-gray-400">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── RENT MODAL ───────────────────────────────────────────────────────── */}
      {rentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Confirm Rental</h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-4">
              You are renting a <strong>{rentTarget.svc.service_name}</strong> number for{" "}
              <strong>{PERIOD_LABELS[rentTarget.period] ?? rentTarget.period}</strong>.
            </p>

            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Service</span>
                <span className="font-medium text-[var(--text-primary)]">{rentTarget.svc.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Period</span>
                <span className="font-medium text-[var(--text-primary)]">{PERIOD_LABELS[rentTarget.period] ?? rentTarget.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Cost</span>
                <span className="font-bold text-green-500">₦{rentTarget.priceNgn.toLocaleString()}</span>
              </div>

            </div>

            {/* Auto-renew toggle */}
            <label className="flex items-center gap-3 mb-5 cursor-pointer">
              <div
                onClick={() => setAutoRenew((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${autoRenew ? "bg-green-500" : "bg-slate-200 dark:bg-white/10"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoRenew ? "translate-x-5" : ""}`}
                />
              </div>
              <span className="text-sm text-[var(--text-primary)]">Auto-renew</span>
            </label>

            {(user?.wallet_balance ?? 0) < rentTarget.priceNgn && (
              <p className="text-red-500 text-xs mb-3">Insufficient balance. Please top up your wallet first.</p>
            )}

            {/* No-cancellation notice */}
            <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2.5 mb-4">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
                Long-term rentals <strong>cannot be cancelled</strong> once confirmed.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRentTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRent}
                disabled={renting || (user?.wallet_balance ?? 0) < rentTarget.priceNgn}
                className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {renting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </>
                ) : "Confirm & Rent"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MESSAGES MODAL ───────────────────────────────────────────────────── */}
      {msgTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{msgTarget.number}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">{msgTarget.service_name} messages</p>
              </div>
              <button
                onClick={() => setMsgTarget(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[var(--bg-card-inner)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="w-6 h-6 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-gray-400 text-sm py-8">No messages yet.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                    <p className="text-[var(--text-primary)] text-sm">{m.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      From {m.sender} · {new Date(m.received_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disabled account modal */}
      {showDisabledModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowDisabledModal(false)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-2">Account Disabled</h2>
            <p className="text-gray-400 text-sm">Your account has been disabled. Please contact our support team to resolve this.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Rental card ────────────────────────────────────────────────────────────────
function RentalCard({
  rental,
  onRenew,
  onMessages,
  onAutoRenew,
  loading,
  disabled = false,
}: {
  rental: LongRental;
  onRenew: (r: LongRental) => void;
  onMessages: (r: LongRental) => void;
  onAutoRenew: (r: LongRental) => void;
  loading: Record<string, boolean>;
  disabled?: boolean;
}) {
  const isActive    = rental.status === "Active";
  const renewing    = loading[`renew-${rental.number}`];
  const togglingAR  = loading[`ar-${rental.number}`];

  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-semibold text-[var(--text-primary)] text-sm">{rental.number}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isActive
                  ? "bg-green-500/10 text-green-500"
                  : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400"
              }`}
            >
              {rental.status}
            </span>
          </div>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">
            {rental.service_name} · {PERIOD_LABELS[rental.period] ?? rental.period} · Expires {rental.end_time}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">₦{rental.price_ngn.toLocaleString()}</p>
        </div>

        {isActive && (
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => onMessages(rental)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            >
              Messages
            </button>
            <button
              onClick={() => onRenew(rental)}
              disabled={renewing}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
              {renewing ? "…" : "Renew"}
            </button>
            <button
              onClick={() => onAutoRenew(rental)}
              disabled={togglingAR}
              title={rental.auto_renew ? "Disable auto-renew" : "Enable auto-renew"}
              className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-50 ${
                rental.auto_renew
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
                  : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/20"
              }`}
            >
              {togglingAR ? "…" : rental.auto_renew ? "Auto-renew ✓" : "Auto-renew"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
