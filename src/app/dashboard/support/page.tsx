"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ISSUES = [
  {
    id: "wallet_not_credited",
    title: "I sent money but my wallet has not been credited",
    kind: "form",
  },
  {
    id: "otp_not_received",
    title: "I am not receiving OTP codes",
    kind: "information",
    heading: "You do not need to contact support",
    paragraphs: [
      "If an OTP does not arrive, cancel the rental and the amount charged will be returned to your Temp Number wallet immediately.",
      "OTP delivery depends on the third-party platform and number provider. Try again with another available number if necessary. If a code is delivered during an active rental, it will appear automatically in your dashboard.",
    ],
  },
  {
    id: "third_party_suspension",
    title: "My account was suspended or banned",
    kind: "information",
    heading: "Third-party account decisions are outside our control",
    paragraphs: [
      "Temp Number is not responsible for suspensions, bans, restrictions, verification failures, or other decisions made by third-party services.",
      "Each platform controls its own policies and account-review process. We cannot reverse or appeal its decision, so submitting a support request to us will not resolve this issue. Please contact the third-party platform directly if it offers an appeal process.",
    ],
  },
  {
    id: "withdraw_funds",
    title: "I need to withdraw my funds",
    kind: "information",
    heading: "Wallet funds cannot be withdrawn",
    paragraphs: [
      "Funds added to your Temp Number wallet cannot be withdrawn, transferred, or refunded to a bank account or payment method. Your wallet balance remains available, and you may use it at any time to purchase a number on the platform.",
    ],
  },
] as const;

function formatWait(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs].map((part) => String(part).padStart(2, "0")).join(":");
}

export default function SupportPage() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const selected = ISSUES.find((issue) => issue.id === selectedId);
  const isWaiting = cooldown > 0;

  useEffect(() => {
    const token = localStorage.getItem("tn_token") ?? "";
    fetch("/api/support", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Could not check support status.");
        setCooldown(Number(data.cooldown_remaining ?? 0));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not check support status."))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !selected || selected.kind !== "form" || isWaiting || sending) return;
    if (!receipt) {
      setError("Please attach your payment receipt.");
      return;
    }

    setSending(true);
    setError("");
    const formData = new FormData();
    formData.set("issue_type", "wallet_not_credited");
    formData.set("account_email", user.email);
    formData.set("receipt", receipt);

    try {
      const token = localStorage.getItem("tn_token") ?? "";
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.cooldown_remaining) setCooldown(Number(data.cooldown_remaining));
        throw new Error(data.error ?? "Your request could not be submitted.");
      }
      setCooldown(Number(data.cooldown_remaining ?? 10800));
      setReceipt(null);
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your request could not be submitted.");
    } finally {
      setSending(false);
    }
  }

  if (checking) {
    return <div className="flex justify-center py-20"><div className="w-7 h-7 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Support Centre</h1>
        <p className="text-gray-400 text-sm mt-1">Select the issue you are experiencing.</p>
      </div>

      {isWaiting && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
          <p className="font-semibold text-amber-500">Please hold. Our support is resolving your issue</p>
          <p className="text-sm text-gray-400 mt-1">You can submit another funding request in {formatWait(cooldown)}.</p>
        </div>
      )}

      {!selected && (
        <div className="grid gap-3">
          {ISSUES.map((issue) => (
            <button
              key={issue.id}
              type="button"
              onClick={() => { setSelectedId(issue.id); setError(""); }}
              className="w-full text-left bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-green-500/40 rounded-2xl p-5 transition-colors flex items-center justify-between gap-4"
            >
              <span className="text-[var(--text-primary)] text-sm font-semibold">{issue.title}</span>
              <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {selected?.kind === "information" && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 space-y-4">
          <button type="button" onClick={() => setSelectedId(null)} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to issues
          </button>
          <div>
            <h2 className="text-[var(--text-primary)] font-semibold text-lg">{selected.heading}</h2>
            <div className="mt-3 space-y-3">
              {selected.paragraphs.map((paragraph) => <p key={paragraph} className="text-gray-400 text-sm leading-6">{paragraph}</p>)}
            </div>
          </div>
        </div>
      )}

      {selected?.kind === "form" && !isWaiting && (
        <form onSubmit={submit} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setSelectedId(null); setError(""); }} aria-label="Back to support issues" className="text-gray-400 hover:text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-[var(--text-primary)] font-semibold">{selected.title}</h2>
          </div>

          <div>
            <label htmlFor="account-email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Account Email</label>
            <input id="account-email" type="email" value={user?.email ?? ""} readOnly className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
          </div>

          <div>
            <label htmlFor="receipt" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Receipt <span className="text-red-400">*</span></label>
            <input id="receipt" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-green-500/10 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-green-500 hover:file:bg-green-500/20" />
            <p className="text-[11px] text-gray-500 mt-2">PDF, JPG, PNG, or WebP. Maximum size: 5 MB.</p>
          </div>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={sending} className="w-full rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold text-sm py-3 transition-colors">
            {sending ? "Sending..." : "Send Request"}
          </button>
        </form>
      )}

      {!selected && error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
