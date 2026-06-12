"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const PRESETS = [5_000, 10_000, 15_000, 20_000, 50_000];

function fmt(n: number) {
  return n.toLocaleString("en-NG");
}

export default function WalletPage() {
  const { user } = useAuth();
  const [raw, setRaw] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleInput(val: string) {
    const digits = val.replace(/\D/g, "");
    setRaw(digits);
    setActive(null);
  }

  function selectPreset(p: number) {
    setRaw(p.toString());
    setActive(p);
    setError("");
  }

  async function handleTopUp() {
    const amount = parseInt(raw, 10);
    if (!amount || amount < 500) {
      setError("Please enter a valid amount (minimum ₦500).");
      return;
    }
    if (!user?.email) {
      setError("Could not identify your account. Please sign in again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to initialise payment. Try again.");
        return;
      }
      window.location.href = data.authorization_url;
    } catch {
      setError("Unable to connect. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  const displayValue = raw ? Number(raw).toLocaleString("en-NG") : "";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-sm">

        {/* Wallet icon + title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5m0 0h-5a2 2 0 000 4h5" />
            </svg>
          </div>
          <h1 className="text-[var(--text-primary)] text-xl font-bold">Top Up Wallet</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Add funds to rent phone numbers instantly
          </p>
        </div>

        {/* Current balance pill */}
        <div className="flex items-center justify-center mb-6">
          <span className="bg-green-500/10 text-green-500 text-xs font-semibold px-3 py-1.5 rounded-full">
            Balance: &#8358;{(user?.wallet_balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Amount input */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none select-none">
            &#8358;
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter amount"
            value={displayValue}
            onChange={(e) => handleInput(e.target.value.replace(/,/g, ""))}
            className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-base rounded-xl pl-8 pr-4 py-3.5 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Presets */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => selectPreset(p)}
              className={`text-xs font-semibold py-2.5 rounded-lg border transition-all ${
                active === p
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-green-500 hover:text-green-500"
              }`}
            >
              &#8358;{fmt(p)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

        {/* Top Up button */}
        <button
          onClick={handleTopUp}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to Paystack&hellip;
            </>
          ) : (
            "Top Up"
          )}
        </button>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-400 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secured by Paystack &middot; 256-bit SSL
        </div>
      </div>
    </div>
  );
}

