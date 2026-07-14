"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { rentalsApi, ApiError, type StoredRental } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterType = "all" | "active" | "inactive";

type Toast = { id: number; type: "success" | "error"; title: string; body: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

const COUNTRY_ISO: Record<string, string> = {
  afghanistan:"AF", albania:"AL", algeria:"DZ", angola:"AO", argentina:"AR",
  armenia:"AM", australia:"AU", austria:"AT", azerbaijan:"AZ", bahrain:"BH",
  bangladesh:"BD", belgium:"BE", brazil:"BR", bulgaria:"BG", cambodia:"KH",
  cameroon:"CM", canada:"CA", chile:"CL", colombia:"CO", croatia:"HR",
  czech:"CZ", denmark:"DK", egypt:"EG", england:"GB", estonia:"EE",
  ethiopia:"ET", finland:"FI", france:"FR", georgia:"GE", germany:"DE",
  ghana:"GH", greece:"GR", hungary:"HU", india:"IN", indonesia:"ID",
  ireland:"IE", israel:"IL", italy:"IT", ivorycoast:"CI", jordan:"JO",
  kazakhstan:"KZ", kenya:"KE", kuwait:"KW", laos:"LA", latvia:"LV",
  lithuania:"LT", malaysia:"MY", mexico:"MX", moldova:"MD", mongolia:"MN",
  morocco:"MA", netherlands:"NL", nigeria:"NG", norway:"NO", pakistan:"PK",
  peru:"PE", philippines:"PH", poland:"PL", portugal:"PT", romania:"RO",
  russia:"RU", saudiarabia:"SA", senegal:"SN", serbia:"RS", singapore:"SG",
  slovakia:"SK", southafrica:"ZA", spain:"ES", srilanka:"LK", sweden:"SE",
  taiwan:"TW", tajikistan:"TJ", tanzania:"TZ", thailand:"TH", tunisia:"TN",
  ukraine:"UA", usa:"US", uzbekistan:"UZ", venezuela:"VE", vietnam:"VN",
};

function countryFlag(code: string): string {
  const iso = COUNTRY_ISO[(code ?? "").toLowerCase()];
  if (!iso) return "🌐";
  return iso.toUpperCase().split("").map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

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

// ── Token helper ──────────────────────────────────────────────────────────────

function getToken(): string {
  return typeof window !== "undefined" ? (localStorage.getItem("tn_token") ?? "") : "";
}

// ── Rental Row ────────────────────────────────────────────────────────────────

function RentalRow({
  rental,
  addToast,
  onRefundDetected,
}: {
  rental: StoredRental;
  addToast: (type: "success" | "error", title: string, body: string) => void;
  onRefundDetected: () => void;
}) {
  const isFivesim = rental.source === "fivesim";
  const [code, setCode]             = useState<string | null>(rental.sms_code ?? null);
  const [status, setStatus]         = useState(
    rental.status === "success" ? "active" : rental.status
  );
  const [copied, setCopied]         = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Poll every 5 s while active and no code yet — branch on source
  useEffect(() => {
    if (status !== "active" || code !== null) return;
    const interval = setInterval(async () => {
      try {
        if (isFivesim) {
          // ── 5sim poll ─────────────────────────────────────────────────────
          const res = await fetch("/api/fivesim/check", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ order_id: rental.getatext_id }),
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data.sms_code) {
            setCode(data.sms_code);
            addToast("success", "Code received!", `${rental.service_name}: ${data.sms_code}`);
          }
          if (data.status === "cancelled" || data.status === "expired") {
            setStatus(data.status);
            if (data.refunded) {
              addToast("success", "Refunded", `₦${Number(rental.price_ngn).toLocaleString()} returned to your wallet`);
              onRefundDetected();
            }
          } else if (data.status !== "active") {
            setStatus(data.status);
          }
        } else {
          // ── Getatext poll ─────────────────────────────────────────────────
          const data = await rentalsApi.pollStatus(rental.getatext_id);
          if (data.code) {
            setCode(data.code);
            addToast("success", "Code received!", `${rental.service_name}: ${data.code}`);
          }
          if (data.status !== "active") {
            setStatus(data.status);
            if (data.refunded && data.new_balance !== null) {
              addToast("success", "Refunded", `₦${rental.price_ngn.toLocaleString()} returned to wallet`);
              onRefundDetected();
            }
          }
        }
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, code, isFivesim]);

  async function handleCopy() {
    try { await navigator.clipboard.writeText(rental.number); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  }

  async function handleCopyCode() {
    if (!code) return;
    try { await navigator.clipboard.writeText(code); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); } catch { /* ignore */ }
  }

  async function handleCancel() {
    if (cancelling || status !== "active") return;
    setStatus("cancelled");
    setCancelling(true);
    try {
      if (isFivesim) {
        // ── 5sim cancel ───────────────────────────────────────────────────
        const res = await fetch("/api/fivesim/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ order_id: rental.getatext_id }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.refunded) {
            addToast("success", "Cancelled & refunded", `₦${Number(rental.price_ngn).toLocaleString()} returned to your wallet`);
            onRefundDetected();
          } else {
            addToast("success", "Cancelled", "Number has been cancelled");
          }
        } else {
          setStatus("active");
          addToast("error", "Cancel failed", data.error ?? "Please try again.");
        }
      } else {
        // ── Getatext cancel ───────────────────────────────────────────────
        const data = await rentalsApi.cancel(rental.getatext_id);
        if (data.refund_ngn > 0) {
          addToast("success", "Cancelled & refunded", `₦${data.refund_ngn.toLocaleString()} returned to wallet`);
          onRefundDetected();
        } else {
          addToast("success", "Cancelled", "Number has been cancelled");
        }
      }
    } catch (err) {
      setStatus("active");
      addToast("error", "Cancel failed", err instanceof ApiError ? err.message : "Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  const isActive = status === "active";
  const flag = isFivesim && rental.country ? countryFlag(rental.country) : "🇺🇸";

  return (
    <tr className="hover:bg-[var(--bg-card-inner)] transition-colors border-b border-[var(--border-color)]">
      {/* Flag */}
      <td className="pl-4 pr-1 py-4 text-base text-center leading-none">{flag}</td>

      {/* Number */}
      <td className="px-5 py-4">
        <button onClick={handleCopy} title="Click to copy" className="flex items-center gap-1.5 group font-mono text-sm text-[var(--text-primary)] hover:text-green-500 transition-colors">
          <span>{rental.number}</span>
          {copied ? (
            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </button>
        <p className="text-gray-500 text-xs mt-0.5">{timeAgo(rental.rented_at)}</p>
      </td>

      {/* Service */}
      <td className="px-3 py-4 text-[var(--text-secondary)] text-sm">{rental.service_name.replace(/_/g, " ")}</td>

      {/* SMS Code */}
      <td className="px-3 py-4">
        {code ? (
          <button onClick={handleCopyCode} title="Click to copy code" className="flex items-center gap-1.5 group font-mono text-green-400 font-bold bg-green-500/10 hover:bg-green-500/20 px-2.5 py-1 rounded-lg text-sm transition-colors">
            <span>{code}</span>
            {codeCopied ? (
              <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
        ) : isActive ? (
          <span className="flex items-center gap-1.5 text-gray-500 text-xs">
            <svg className="w-3.5 h-3.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Waiting…
          </span>
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-3 py-4">
        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
          status === "active"    ? "bg-green-500/15 text-green-400"   :
          status === "cancelled" ? "bg-orange-500/15 text-orange-400" :
          status === "completed" ? "bg-blue-500/15 text-blue-400"     :
          "bg-white/5 text-gray-400"
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 text-right">
        {isActive ? (
          <button onClick={handleCancel} disabled={cancelling} className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            {cancelling ? (
              <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Cancelling</>
            ) : "Cancel"}
          </button>
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </td>
    </tr>
  );
}

// ── Page (inner — needs useSearchParams) ──────────────────────────────────────

function RentalsPageInner() {
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const initialTab = searchParams.get("tab") === "global" ? "global" : "usa";
  const [activeTab, setActiveTab]   = useState<"usa" | "global">(initialTab);
  const [rentals, setRentals]       = useState<StoredRental[]>([]);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<FilterType>("all");
  const [loading, setLoading]       = useState(true);
  const [toasts, setToasts]         = useState<Toast[]>([]);
  const [toastSeq, setToastSeq]     = useState(0);
  const [page, setPage]             = useState(1);
  const PAGE_SIZE = 20;

  function addToast(type: Toast["type"], title: string, body: string) {
    const id = toastSeq;
    setToastSeq((n) => n + 1);
    setToasts((prev) => [...prev, { id, type, title, body }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const loadRentals = useCallback(async () => {
    try {
      const data = await rentalsApi.list();
      setRentals(data.map((r) => ({ ...r, status: r.status === "success" ? "active" : r.status })));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadRentals(); }, [loadRentals]);

  function switchTab(tab: "usa" | "global") {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setFilter("all");
  }

  const tabRentals = rentals.filter((r) =>
    activeTab === "usa" ? r.source === "getatext" : r.source === "fivesim"
  );

  const filtered = tabRentals.filter((r) => {
    const matchSearch =
      r.number.toLowerCase().includes(search.toLowerCase()) ||
      r.service_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "active"   && r.status === "active") ||
      (filter === "inactive" && r.status !== "active");
    return matchSearch && matchFilter;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const usaCount    = rentals.filter((r) => r.source === "getatext").length;
  const globalCount = rentals.filter((r) => r.source === "fivesim").length;
  const activeCount = tabRentals.filter((r) => r.status === "active").length;

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Rentals</h1>
          <p className="text-gray-400 text-sm mt-0.5">All your rented phone numbers</p>
        </div>

        {/* Source Tabs */}
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 w-fit">
          <button
            onClick={() => switchTab("usa")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "usa"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-400 hover:text-[var(--text-primary)]"
            }`}
          >
            🇺🇸 USA Numbers
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === "usa" ? "bg-white/20 text-white" : "bg-[var(--bg-card-inner)] text-gray-500"
            }`}>{usaCount}</span>
          </button>
          <button
            onClick={() => switchTab("global")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "global"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-400 hover:text-[var(--text-primary)]"
            }`}
          >
            🌍 Global
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === "global" ? "bg-white/20 text-white" : "bg-[var(--bg-card-inner)] text-gray-500"
            }`}>{globalCount}</span>
          </button>
        </div>

        {activeCount > 0 && (
          <span className="inline-flex bg-green-500/15 text-green-400 font-semibold text-xs px-3 py-1.5 rounded-full">
            {activeCount} Active
          </span>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by number or service…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="w-7 h-7 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : tabRentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-medium">No {activeTab === "usa" ? "USA" : "Global"} rentals yet</p>
              <p className="text-gray-600 text-xs mt-1">
                {activeTab === "usa" ? "Go to USA Numbers dashboard to rent." : "Go to All Countries dashboard to rent."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[580px]">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="w-10" aria-label="Country" />
                    <th className="text-left text-gray-500 font-medium text-xs px-5 py-4 uppercase tracking-wider">Number</th>
                    <th className="text-left text-gray-500 font-medium text-xs px-3 py-4 uppercase tracking-wider">Service</th>
                    <th className="text-left text-gray-500 font-medium text-xs px-3 py-4 uppercase tracking-wider">SMS Code</th>
                    <th className="text-left text-gray-500 font-medium text-xs px-3 py-4 uppercase tracking-wider">Status</th>
                    <th className="text-right text-gray-500 font-medium text-xs px-5 py-4 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-16"><p className="text-gray-500 text-sm">No rentals match your search</p></td></tr>
                  ) : (
                    paginated.map((r) => (
                      <RentalRow key={r.id} rental={r} addToast={addToast} onRefundDetected={refreshUser} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-gray-500 text-xs">
                Showing <span className="text-[var(--text-primary)]">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of <span className="text-[var(--text-primary)]">{filtered.length}</span> rentals
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => { if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("..."); acc.push(p); return acc; }, [])
                    .map((item, i) =>
                      item === "..." ? <span key={`e-${i}`} className="px-1 text-gray-500 text-xs">…</span>
                      : <button key={item} onClick={() => setPage(item as number)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${safePage === item ? "bg-green-500 text-white" : "bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)]"}`}>{item}</button>
                    )
                  }
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Page (exported — wraps inner in Suspense for useSearchParams) ─────────────

export default function RentalsPage() {
  return (
    <Suspense>
      <RentalsPageInner />
    </Suspense>
  );