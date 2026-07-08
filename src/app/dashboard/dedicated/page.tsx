"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dedicatedApi, type DedicatedPrice, type DedicatedRental, type DedicatedMessage } from "@/lib/api";

// ── Toast ──────────────────────────────────────────────────────────────────────
type Toast = { id: number; type: "success" | "error"; title: string; body?: string };
let _toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((type: Toast["type"], title: string, body?: string) => {
    const id = ++_toastId;
    setToasts((t) => [...t, { id, type, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  return { toasts, add };
}

const PERIOD_LABELS: Record<string, string> = { "1w": "1 Week", "2w": "2 Weeks", "1m": "1 Month" };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

function daysLeft(end: string) {
  const diff = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
  return diff;
}

export default function DedicatedPage() {
  const { user, refreshUser } = useAuth();
  const { toasts, add: addToast } = useToast();

  const [tab, setTab]                   = useState<"rent" | "my">("rent");
  const [prices, setPrices]             = useState<DedicatedPrice[]>([]);
  const [stock, setStock]               = useState(0);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [rentals, setRentals]           = useState<DedicatedRental[]>([]);
  const [loadingRentals, setLoadingRentals] = useState(false);

  // Rent modal
  const [rentTarget, setRentTarget]     = useState<DedicatedPrice | null>(null);
  const [autoRenew, setAutoRenew]       = useState(false);
  const [renting, setRenting]           = useState(false);

  // Disabled modal
  const [showDisabledModal, setShowDisabledModal] = useState(false);

  // Messages modal
  const [msgRental, setMsgRental]       = useState<DedicatedRental | null>(null);
  const [messages, setMessages]         = useState<DedicatedMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);

  // Action loading
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});

  // ── Fetch prices ───────────────────────────────────────────────────────────
  useEffect(() => {
    dedicatedApi.prices()
      .then((d) => { setPrices(d.prices ?? []); setStock(d.stock ?? 0); })
      .catch(() => {})
      .finally(() => setLoadingPrices(false));
  }, []);

  // ── Fetch my rentals ───────────────────────────────────────────────────────
  const loadRentals = useCallback(() => {
    setLoadingRentals(true);
    dedicatedApi.list()
      .then((data) => setRentals(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingRentals(false));
  }, []);

  useEffect(() => {
    if (tab === "my") loadRentals();
  }, [tab, loadRentals]);

  // ── Open rent modal ────────────────────────────────────────────────────────
  function openRent(price: DedicatedPrice) {
    if (user?.is_disabled) { setShowDisabledModal(true); return; }
    setAutoRenew(false);
    setRentTarget(price);
  }

  // ── Confirm rent ───────────────────────────────────────────────────────────
  async function confirmRent() {
    if (!rentTarget) return;
    if (user && user.wallet_balance < rentTarget.price_ngn) {
      addToast("error", "Insufficient balance", `Need ₦${rentTarget.price_ngn.toLocaleString()}. Please top up.`);
      setRentTarget(null);
      return;
    }
    setRenting(true);
    try {
      const data = await dedicatedApi.create({
        rental_time: rentTarget.period,
        auto_renew: autoRenew,
        price_usd: rentTarget.price_usd,
        price_ngn: rentTarget.price_ngn,
      });
      setRentTarget(null);
      addToast("success", "Dedicated number activated!", `${data.rental.number} — expires ${formatDate(data.rental.end_time)}`);
      await refreshUser();
      setTab("my");
      loadRentals();
    } catch (err: unknown) {
      addToast("error", "Failed", err instanceof Error ? err.message : "Could not create rental");
    } finally {
      setRenting(false);
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async function doRenew(r: DedicatedRental) {
    if (!confirm(`Renew ${r.number}? ₦${r.price_ngn.toLocaleString()} will be deducted.`)) return;
    setActionLoading((p) => ({ ...p, [r.id]: true }));
    try {
      const data = await dedicatedApi.update({ id: r.id, action: "renew" });
      addToast("success", "Renewed!", `Expires ${formatDate(data.rental?.end_time ?? "")}`);
      await refreshUser();
      loadRentals();
    } catch (err: unknown) {
      addToast("error", "Renewal failed", err instanceof Error ? err.message : "");
    } finally {
      setActionLoading((p) => ({ ...p, [r.id]: false }));
    }
  }

  async function doCancel(r: DedicatedRental) {
    if (!confirm(`Cancel ${r.number}? This cannot be undone — the number will be permanently released.`)) return;
    setActionLoading((p) => ({ ...p, [r.id]: true }));
    try {
      await dedicatedApi.update({ id: r.id, action: "cancel" });
      addToast("success", "Cancelled", `${r.number} has been released.`);
      loadRentals();
    } catch (err: unknown) {
      addToast("error", "Cancel failed", err instanceof Error ? err.message : "");
    } finally {
      setActionLoading((p) => ({ ...p, [r.id]: false }));
    }
  }

  async function doToggleAutoRenew(r: DedicatedRental) {
    setActionLoading((p) => ({ ...p, [r.id]: true }));
    try {
      const data = await dedicatedApi.update({ id: r.id, action: "toggle_auto_renew", auto_renew: !r.auto_renew });
      setRentals((prev) => prev.map((x) => x.id === r.id ? { ...x, auto_renew: data.auto_renew ?? !r.auto_renew } : x));
    } catch {
      addToast("error", "Failed to update auto-renew", "");
    } finally {
      setActionLoading((p) => ({ ...p, [r.id]: false }));
    }
  }

  async function openMessages(r: DedicatedRental) {
    setMsgRental(r);
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const data = await dedicatedApi.messages(r.getatext_id);
      setMessages(data.messages ?? []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm text-white max-w-xs ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            <p className="font-semibold">{t.title}</p>
            {t.body && <p className="text-xs mt-0.5 opacity-90">{t.body}</p>}
          </div>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Dedicated USA Numbers</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your own exclusive USA number — use it for any service, as many times as you want.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 w-fit">
        {(["rent", "my"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-green-500 text-white" : "text-gray-400 hover:text-[var(--text-primary)]"
            }`}
          >
            {t === "rent" ? "Get a Number" : "My Numbers"}
          </button>
        ))}
      </div>

      {/* ── Get a Number tab ── */}
      {tab === "rent" && (
        <div>
          {loadingPrices ? (
            <div className="flex justify-center py-16">
              <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : prices.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">Dedicated numbers unavailable right now. Check back soon.</div>
          ) : (
            <div>
              {stock > 0 && (
                <p className="text-gray-400 text-sm mb-4">
                  Numbers available
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {prices.map((p) => (
                  <div
                    key={p.period}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col gap-3 hover:border-green-500/40 transition-colors"
                  >
                    <div>
                      <p className="text-[var(--text-primary)] font-bold text-base">{p.label}</p>
                      <p className="text-green-500 font-bold text-2xl mt-1">₦{p.price_ngn.toLocaleString()}</p>
                    </div>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        Works for all services
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        Exclusively yours
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        Real non-VOIP number
                      </li>
                    </ul>
                    <button
                      onClick={() => openRent(p)}
                      disabled={stock === 0}
                      className="w-full bg-green-500 hover:bg-green-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Get for {p.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── My Numbers tab ── */}
      {tab === "my" && (
        <div>
          {loadingRentals ? (
            <div className="flex justify-center py-16">
              <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : rentals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No dedicated numbers yet.</p>
              <button onClick={() => setTab("rent")} className="mt-3 text-green-500 text-sm font-medium hover:underline">Get one now</button>
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.map((r) => {
                const days    = daysLeft(r.end_time);
                const active  = r.status === "Active";
                const loading = !!actionLoading[r.id];
                return (
                  <div key={r.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[var(--text-primary)] font-semibold text-sm tracking-wide">{r.number}</p>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${active ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                            {r.status}
                          </span>
                          {active && r.auto_renew && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">Auto-renew</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {PERIOD_LABELS[r.period] ?? r.period} · ₦{r.price_ngn.toLocaleString()} ·{" "}
                          {active ? (
                            <span className={days <= 3 ? "text-amber-400" : "text-gray-400"}>
                              {days > 0 ? `${days} day${days !== 1 ? "s" : ""} left` : "Expiring today"}
                            </span>
                          ) : (
                            <span>Expired {formatDate(r.end_time)}</span>
                          )}
                        </p>
                        {active && (
                          <p className="text-gray-500 text-[11px] mt-0.5">Expires {formatDate(r.end_time)}</p>
                        )}
                      </div>

                      {active && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => openMessages(r)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-card-inner)] text-gray-400 hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors"
                          >
                            Messages
                          </button>
                          <button
                            onClick={() => doToggleAutoRenew(r)}
                            disabled={loading}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                              r.auto_renew
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                                : "bg-[var(--bg-card-inner)] text-gray-400 border-[var(--border-color)] hover:text-[var(--text-primary)]"
                            }`}
                          >
                            {r.auto_renew ? "Auto-renew ON" : "Auto-renew OFF"}
                          </button>
                          <button
                            onClick={() => doRenew(r)}
                            disabled={loading}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors disabled:opacity-50"
                          >
                            Renew
                          </button>

                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Rent Confirm Modal ── */}
      {rentTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => !renting && setRentTarget(null)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[var(--text-primary)] font-bold text-base mb-1">Confirm Dedicated Number Rental</h2>
            <p className="text-gray-400 text-sm mb-4">{rentTarget.label} · <span className="text-green-400 font-semibold">₦{rentTarget.price_ngn.toLocaleString()}</span> will be deducted</p>

            <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none">
              <div
                onClick={() => setAutoRenew((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${autoRenew ? "bg-green-500" : "bg-gray-600"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${autoRenew ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className="text-[var(--text-primary)] text-sm">Enable auto-renew</span>
            </label>

            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2.5 text-amber-400 text-xs flex gap-2 mb-4">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>
                <strong>Important:</strong> If auto-renew is on and your wallet runs out at renewal time, the number is <strong>permanently released</strong> — you cannot recover it.
              </span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setRentTarget(null)} disabled={renting} className="flex-1 text-sm px-4 py-2 rounded-xl border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmRent} disabled={renting} className="flex-1 text-sm px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition-colors disabled:opacity-60">
                {renting ? "Processing…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Messages Modal ── */}
      {msgRental && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setMsgRental(null)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[var(--text-primary)] font-bold text-base">Messages</h2>
                <p className="text-gray-400 text-xs mt-0.5">{msgRental.number}</p>
              </div>
              <button onClick={() => setMsgRental(null)} className="text-gray-500 hover:text-[var(--text-primary)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center py-8">
                  <svg className="w-5 h-5 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No messages yet. Send an SMS to this number.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="bg-[var(--bg-card-inner)] rounded-xl px-4 py-3">
                    <p className="text-[var(--text-primary)] text-sm">{m.message}</p>
                    <p className="text-gray-500 text-xs mt-1.5">From: {m.sender} · {new Date(m.rented_at).toLocaleString("en-NG")}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Disabled Modal ── */}
      {showDisabledModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowDisabledModal(false)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <h2 className="text-[var(--text-primary)] font-bold text-base mb-2">Account Disabled</h2>
            <p className="text-gray-400 text-sm">Your account has been disabled. Please contact support for assistance.</p>
          </div>
        </div>
      )}
    </div>
  );
}
