"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { rentalsApi, ApiError, type StoredRental } from "@/lib/api";
import UpdateMarquee from "@/components/UpdateMarquee";

type Toast = { id: number; type: "success" | "error"; title: string; body: string };

// ── Types ─────────────────────────────────────────────────────────────────────

type Service = {
  service_name: string;
  api_name: string;
  price: string | number;
  ttl: number;
  stock: number;
  multiple_sms: string | boolean;
};

type RentResult = {
  id: number;
  number: string;
  service_name: string;
  end_time: string;
  price: string;
  status: string;
  new_balance: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const NGN_RATE = 1600;

function usdToNgn(usd: string | number) {
  return (Math.ceil(Number(usd) * NGN_RATE) + 500).toLocaleString();
}

// ── Rental row with live TTL, code polling, and cancel ───────────────────────

function RentalRow({
  rental,
  addToast,
  onRefundDetected,
  onRemove,
}: {
  rental: StoredRental;
  addToast: (type: "success" | "error", title: string, body: string) => void;
  onRefundDetected: () => void;
  onRemove: (id: number) => void;
}) {
  const [code, setCode]         = useState<string | null>(rental.sms_code ?? null);
  // Getatext returns "success" on a fresh rent — normalise to "active"
  const [status, setStatus]     = useState(
    rental.status === "success" ? "active" : rental.status
  );
  const [copied, setCopied]     = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Poll Getatext via PHP for code / status updates (active rentals only)
  useEffect(() => {
    if (status !== "active" || code !== null) return;

    const interval = setInterval(async () => {
      try {
        const data = await rentalsApi.pollStatus(rental.getatext_id);
        if (data.code) {
          setCode(data.code);
          addToast("success", "Code received!", `${rental.service_name}: ${data.code}`);
        }
        if (data.status !== "active") {
          setStatus(data.status);
          if (data.refunded && data.new_balance !== null) {
            addToast(
              "success",
              "Refunded",
              `Number expired — ₦${rental.price_ngn.toLocaleString()} returned to your wallet`
            );
            onRefundDetected();
          }
          // Only remove expired/cancelled; received rentals stay to show the code
          if (data.status === "expired" || data.status === "cancelled") {
            onRemove(rental.id);
          }
        }
      } catch {
        /* ignore transient errors */
      }
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, code]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rental.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }

  async function handleCopyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }

  async function handleCancel() {
    if (cancelling || status !== "active") return;
    // Optimistically mark as cancelled immediately — this stops the poll interval
    // before any in-flight or next-tick poll can race with the cancel request.
    setStatus("cancelled");
    setCancelling(true);
    try {
      const data = await rentalsApi.cancel(rental.getatext_id);
      if (data.refund_ngn > 0) {
        addToast(
          "success",
          "Cancelled & refunded",
          `₦${data.refund_ngn.toLocaleString()} returned to your wallet`
        );
        onRefundDetected();
      } else {
        addToast("success", "Cancelled", "Number has been cancelled");
      }
      onRemove(rental.id);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not cancel. Please try again.";
      addToast("error", "Cancel failed", msg);
    } finally {
      setCancelling(false);
    }
  }

  const isActive = status === "active";

  return (
    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-inner)] transition-colors">
      {/* Flag */}
      <td className="pl-3 pr-1 py-2.5 text-base text-center leading-none">🇺🇸</td>

      {/* Number — click to copy */}
      <td className="px-2 py-2.5">
        <button
          onClick={handleCopy}
          title="Click to copy"
          className="flex items-center gap-1 group font-mono text-xs text-[var(--text-primary)] hover:text-green-500 transition-colors"
        >
          <span>{rental.number}</span>
          {copied ? (
            <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </td>

      {/* Service */}
      <td className="px-2 py-2.5 text-[var(--text-secondary)] text-xs whitespace-nowrap">
        {rental.service_name}
      </td>



      {/* Code — spinner while waiting, green text when received */}
      <td className="px-2 py-2.5">
        {code ? (
          <button
            onClick={handleCopyCode}
            title="Click to copy code"
            className="flex items-center gap-1 group font-mono text-xs text-green-500 font-bold tracking-wide hover:text-green-400 transition-colors"
          >
            <span>{code}</span>
            {codeCopied ? (
              <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        ) : isActive ? (
          <svg className="w-3.5 h-3.5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <span className="text-gray-500 text-xs">—</span>
        )}
      </td>

      {/* Status badge */}
      <td className="px-2 py-2.5">
        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
          status === "active"    ? "bg-green-500/15 text-green-500"   :
          status === "cancelled" ? "bg-orange-500/15 text-orange-400" :
          "bg-gray-200/60 dark:bg-white/5 text-gray-400"
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>

      {/* Cancel button */}
      <td className="px-2 py-2.5">
        {isActive && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
          >
            {cancelling ? (
              <>
                <svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Cancelling
              </>
            ) : "Cancel"}
          </button>
        )}
      </td>
    </tr>
  );
}

// ── Skeleton row (3 columns) ─────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-[var(--border-color)]">
      <td className="px-4 py-2">
        <div className="h-3 w-28 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
      </td>
      <td className="px-4 py-2 text-right">
        <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse ml-auto" />
      </td>
      <td className="px-3 py-2 text-center">
        <div className="h-3.5 w-3.5 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse mx-auto" />
      </td>
    </tr>
  );
}

// ── Toast container ───────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border ${
            t.type === "success"
              ? "bg-[var(--bg-card)] border-green-500/30"
              : "bg-[var(--bg-card)] border-red-500/30"
          }`}
        >
          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
            t.type === "success" ? "bg-green-500/15" : "bg-red-500/15"
          }`}>
            {t.type === "success" ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--text-primary)] text-sm font-semibold leading-tight">{t.title}</p>
            <p className="text-gray-400 text-xs mt-0.5 break-all">{t.body}</p>
          </div>
          <button onClick={() => onDismiss(t.id)} className="flex-shrink-0 text-gray-400 hover:text-[var(--text-primary)] transition-colors mt-0.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [services, setServices]             = useState<Service[]>([]);
  const [loadingPrices, setLoadingPrices]   = useState(true);
  const [pricesError, setPricesError]       = useState<string | null>(null);
  const [search, setSearch]                 = useState("");
  const [rentingService, setRentingService] = useState<string | null>(null);
  const [recentRentals, setRecentRentals]   = useState<StoredRental[]>([]);
  const [toasts, setToasts]                 = useState<Toast[]>([]);
  const [toastSeq, setToastSeq]             = useState(0);
  const [favorites, setFavorites]           = useState<Set<string>>(new Set());
  const autoRentDone                        = useRef(false);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tn_favorites");
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  function toggleFavorite(apiName: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(apiName)) next.delete(apiName);
      else next.add(apiName);
      try { localStorage.setItem("tn_favorites", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }

  function addToast(type: Toast["type"], title: string, body: string) {
    const id = toastSeq;
    setToastSeq((n) => n + 1);
    setToasts((prev) => [...prev, { id, type, title, body }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // Fetch real prices from Getatext via server-side proxy (alphabetical)
  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((data) => {
        const arr: Service[] = Array.isArray(data) ? data : [data];
        const valid = arr.filter((s) => s && s.service_name);
        valid.sort((a, b) => a.service_name.localeCompare(b.service_name));
        setServices(valid);
        setLoadingPrices(false);
      })
      .catch(() => {
        setPricesError("Could not load services. Please refresh.");
        setLoadingPrices(false);
      });
  }, []);

  // Load recent rentals from PHP API — active + completed (received code), max 10
  useEffect(() => {
    rentalsApi
      .list()
      .then((data) => {
        const visible = data
          .filter((r) =>
            r.status === "active"    ||
            r.status === "success"   ||
            r.status === "received"  ||
            r.status === "completed"
          )
          .slice(0, 10);
        setRecentRentals(visible);
      })
      .catch(() => {});
  }, []);

  // Auto-rent when arriving from homepage "Rent" button (?rent=ServiceName)
  useEffect(() => {
    if (autoRentDone.current || !user || services.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const rentParam = params.get("rent");
    if (!rentParam) return;
    const match = services.find((s) =>
      s.service_name.toLowerCase().includes(rentParam.toLowerCase())
    );
    if (!match) return;
    autoRentDone.current = true;
    // Clean the URL without reloading
    window.history.replaceState({}, "", window.location.pathname);
    handleRent(match);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, user]);

  // Show success toast after returning from payment callback
  useEffect(() => {
    try {
      const amountStr = sessionStorage.getItem("tn_topup_amount");
      if (!amountStr) return;
      sessionStorage.removeItem("tn_topup_amount");
      const amount = parseFloat(amountStr);
      refreshUser(); // refresh balance without awaiting — toast appears immediately
      addToast(
        "success",
        "Wallet topped up!",
        `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} has been added to your wallet.`
      );
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRent(s: Service) {
    if (rentingService) return;

    // Client-side balance check — stops obvious low-balance attempts before any network call
    const costNgn = Math.ceil(Number(s.price) * NGN_RATE) + 500;
    if (user && user.wallet_balance < costNgn) {
      addToast("error", "Low balance", "Please top up wallet.");
      return;
    }

    setRentingService(s.api_name);
    try {
      const res  = await fetch("/api/rent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ service: s.api_name }),
      });
      const data: RentResult & { errors?: string; error?: string } = await res.json();

      if (!res.ok || data.errors) {
        addToast("error", "Rent failed", data.errors ?? data.error ?? "Check your wallet balance and try again.");
        return;
      }

      try {
        await rentalsApi.save({
          id:           data.id,
          number:       data.number,
          service_name: data.service_name,
          end_time:     data.end_time,
          ttl:          s.ttl,
          price:        data.price,
          // Getatext returns "success" on a fresh rent; normalise to "active"
          status:       data.status === "success" ? "active" : data.status,
        });
        await refreshUser();
        const list = await rentalsApi.list();
        const visible = list
          .filter((r) =>
            r.status === "active"    ||
            r.status === "success"   ||
            r.status === "received"  ||
            r.status === "completed"
          )
          .slice(0, 10);
        setRecentRentals(visible);
      } catch { /* non-fatal */ }

      addToast("success", `${data.service_name} number ready`, `${data.number}  ·  ₦${usdToNgn(data.price)} deducted`);
    } catch {
      addToast("error", "Network error", "Could not connect. Please try again.");
    } finally {
      setRentingService(null);
    }
  }

  const filtered = services
    .filter(
      (s) =>
        s.service_name.toLowerCase().includes(search.toLowerCase()) ||
        s.api_name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const aFav = favorites.has(a.api_name);
      const bFav = favorites.has(b.api_name);
      if (aFav !== bFav) return aFav ? -1 : 1;
      return a.service_name.localeCompare(b.service_name);
    });

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-gray-400 text-sm">Good to see you,</p>
        <div className="flex items-center gap-2 overflow-hidden">
          <h1 className="text-[var(--text-primary)] text-2xl font-bold flex-shrink-0">
            {user?.name.split(" ")[0] ?? "there"} &#128075;
          </h1>
          <UpdateMarquee />
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 right-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-green-100/70 text-sm mb-1">Wallet Balance</p>
            <p className="text-white text-2xl font-bold tracking-tight">
              &#8358;{(user?.wallet_balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/wallet"
              className="bg-white text-green-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Top Up
            </Link>
            <Link
              href="/dashboard/history"
              className="bg-white/15 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 transition-colors"
            >
              History
            </Link>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left: Rent a Number */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[var(--border-color)]">
            <h2 className="text-[var(--text-primary)] font-bold text-base">Rent a Number</h2>
            <p className="text-gray-400 text-sm mt-1">
              Click any service to instantly rent a number.
            </p>
            <input
              type="text"
              placeholder="Search services&#8230;"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-3 w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left text-gray-500 font-medium text-xs px-5 py-3">Service</th>
                  <th className="text-right text-gray-500 font-medium text-xs px-5 py-3">Price</th>
                  <th className="text-center text-gray-500 font-medium text-xs px-3 py-3">
                    <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingPrices ? (
                  <tr>
                    <td colSpan={3} className="py-14 text-center">
                      <svg className="w-6 h-6 text-green-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <p className="text-gray-400 text-xs mt-2">Loading services&hellip;</p>
                    </td>
                  </tr>
                ) : pricesError ? (
                  <tr>
                    <td colSpan={3} className="text-center text-red-400 text-sm py-10 px-5">
                      {pricesError}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 text-sm py-10">
                      No services found
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const isRenting = rentingService === s.api_name;
                    const busy      = rentingService !== null;
                    const isFav     = favorites.has(s.api_name);
                    return (
                      <tr
                        key={s.api_name}
                        onClick={() => !busy && handleRent(s)}
                        className={`border-b border-[var(--border-color)] transition-colors ${
                          busy
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:bg-[var(--bg-card-inner)]"
                        } ${isRenting ? "bg-green-500/5" : ""}`}
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {isRenting && (
                              <svg className="w-3 h-3 text-green-500 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                            )}
                            <span className={`text-xs ${isRenting ? "text-green-500" : "text-[var(--text-primary)]"}`}>
                              {s.service_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="text-[var(--text-primary)] text-xs">
                            &#8358;{usdToNgn(s.price)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleFavorite(s.api_name)}
                            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-card-inner)] transition-colors mx-auto"
                          >
                            <svg
                              className={`w-4 h-4 transition-colors ${isFav ? "text-red-500" : "text-gray-300 dark:text-gray-600"}`}
                              fill={isFav ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Rentals */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <div>
              <h2 className="text-[var(--text-primary)] font-bold text-base">Recent Rentals</h2>
              <p className="text-gray-400 text-sm mt-0.5">Your latest number rentals</p>
            </div>
            <Link href="/dashboard/rentals" className="text-green-500 text-sm hover:underline whitespace-nowrap">
              View all &#8594;
            </Link>
          </div>

          {recentRentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-card-inner)] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)] text-sm font-medium">No rentals yet</p>
              <p className="text-gray-400 text-xs mt-1">Rent a number from the left panel to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="w-8" aria-label="Country" />
                    <th className="text-left text-gray-500 font-medium text-xs px-2 py-3">Number</th>
                    <th className="text-left text-gray-500 font-medium text-xs px-2 py-3">Service</th>

                    <th className="text-left text-gray-500 font-medium text-xs px-2 py-3">Code</th>
                    <th className="text-left text-gray-500 font-medium text-xs px-2 py-3">Status</th>
                    <th className="w-14" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {recentRentals.map((r) => (
                    <RentalRow
                      key={r.id}
                      rental={r}
                      addToast={addToast}
                      onRefundDetected={refreshUser}
                      onRemove={(id) => setRecentRentals((prev) => prev.filter((x) => x.id !== id))}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
    </>
  );
}