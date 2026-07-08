"use client";

import { useState, useEffect } from "react";

type ReferralData = {
  code: string;
  link: string;
  referrals: { name: string; joined_at: string }[];
  reward: number;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

export default function ReferralPage() {
  const [data, setData]       = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("tn_token") ?? "";
    fetch("/api/referral", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function copyCode() {
    if (!data) return;
    await navigator.clipboard.writeText(data.code).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  async function copyLink() {
    if (!data) return;
    await navigator.clipboard.writeText(data.link).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <svg className="w-7 h-7 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Refer a Friend</h1>
        <p className="text-gray-400 text-sm mt-1">
          Earn ₦{(data?.reward ?? 200).toLocaleString()} for every friend who signs up and completes their first transaction.
        </p>
      </div>

      {/* Referral code card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-[var(--text-primary)] font-semibold text-base">Your Referral Code</h2>
        </div>

        {/* Code display */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 flex items-center justify-center">
            <span className="text-xl font-bold tracking-[0.3em] text-[var(--text-primary)] font-mono select-all">
              {data?.code ?? "—"}
            </span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl transition-colors flex-shrink-0"
          >
            {codeCopied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            <span className="text-xs font-semibold">{codeCopied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Referral link */}
        <div>
          <p className="text-gray-400 text-xs mb-2">Or share your referral link:</p>
          <div className="flex items-center gap-2 bg-[var(--bg-card-inner)] border border-[var(--border-color)] rounded-xl px-4 py-2.5">
            <span className="flex-1 text-xs text-gray-400 truncate font-mono">{data?.link}</span>
            <button
              onClick={copyLink}
              className="flex-shrink-0 text-green-500 hover:text-green-400 transition-colors"
            >
              {linkCopied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
        <h2 className="text-[var(--text-primary)] font-semibold text-base mb-4">How it works</h2>
        <div className="space-y-4">
          {[
            {
              n: "1",
              title: "Share your code",
              desc: "Send your referral code or link to a friend who hasn't signed up yet. They enter it on the sign-up page.",
            },
            {
              n: "2",
              title: "Friend signs up & transacts",
              desc: "They create a free account and rent a number. Once they receive an SMS code (completed transaction), the reward is triggered.",
            },
            {
              n: "3",
              title: "You earn ₦200",
              desc: `₦${(data?.reward ?? 200).toLocaleString()} is instantly added to your wallet. No limits — refer as many friends as you like.`,
            },
          ].map((s) => (
            <div key={s.n} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold flex-shrink-0 mt-0.5">
                {s.n}
              </div>
              <div>
                <p className="text-[var(--text-primary)] text-sm font-medium">{s.title}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referred users */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] flex items-center justify-between">
          <h2 className="text-[var(--text-primary)] font-semibold text-sm">Completed Referrals</h2>
          {data && data.referrals.length > 0 && (
            <span className="text-xs text-gray-500">
              {data.referrals.length} · ₦{(data.referrals.length * (data.reward ?? 200)).toLocaleString()} earned
            </span>
          )}
        </div>

        {!data || data.referrals.length === 0 ? (
          <div className="text-center py-10">
            <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-sm">No completed referrals yet.</p>
            <p className="text-gray-600 text-xs mt-1">Share your code to start earning.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {data.referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center text-green-500 text-sm font-bold flex-shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{r.name}</p>
                    <p className="text-gray-500 text-xs">Joined {fmtDate(r.joined_at)}</p>
                  </div>
                </div>
                <span className="text-green-500 text-sm font-semibold">+₦{(data.reward ?? 200).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
