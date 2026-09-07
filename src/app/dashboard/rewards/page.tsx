"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Item = { current: number; target: number; available: number };
type Rewards = {
  monthly: Item;
  streak: Item;
  cashback: Item;
  topup: Item;
  referrals: Item & {
    code: string;
    link: string;
    milestones: { target: number; reward: number }[];
  };
};

const money = (value: number) =>
  `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("tn_token") ?? ""}`,
});

function Card({
  title,
  description,
  item,
  reward,
  rewardText,
  hideCounter = false,
  type,
  onClaim,
  busy,
  format = (value: number) => value.toLocaleString("en-NG"),
}: {
  title: string;
  description: string;
  item: Item;
  reward: number;
  rewardText?: string;
  hideCounter?: boolean;
  type: string;
  onClaim: (type: string) => void;
  busy: string;
  format?: (value: number) => string;
}) {
  const percentage = Math.min(
    100,
    item.target ? (item.current / item.target) * 100 : 0,
  );
  const ready = item.available > 0;

  return (
    <section
      className={`rounded-2xl border p-5 ${
        ready
          ? "border-green-500/50 bg-green-500/10"
          : "border-[var(--border-color)] bg-[var(--bg-card)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[var(--text-primary)]">{title}</h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {description}
          </p>
        </div>
        {ready && (
          <button
            disabled={Boolean(busy)}
            onClick={() => onClaim(type)}
            className="shrink-0 rounded-lg bg-green-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy === type ? "Claiming…" : `Claim ${money(item.available)}`}
          </button>
        )}
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--bg-card-inner)]">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={`mt-2 flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)] ${hideCounter ? "justify-end" : "justify-between"}`}>
        {!hideCounter && <span>{format(item.current)} / {format(item.target)}</span>}
        <span className="shrink-0 text-right">
          Reward <strong className="text-green-500">{rewardText ?? money(reward)}</strong>
        </span>
      </div>
    </section>
  );
}

export default function RewardsPage() {
  const [data, setData] = useState<Rewards | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [copied, setCopied] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rewards", {
      headers: auth(),
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error ?? "Could not load rewards.");
        setData(result);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load rewards.",
          );
      });
    return () => controller.abort();
  }, []);

  async function claim(type: string) {
    setBusy(type);
    setError("");
    try {
      const response = await fetch("/api/rewards", {
        method: "POST",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not claim reward.");
      setData(result.rewards);
      await refreshUser();
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "Could not claim reward.",
      );
    } finally {
      setBusy("");
    }
  }

  if (!data)
    return (
      <div className="py-20 text-center text-sm text-[var(--text-secondary)]">
        {error || "Loading rewards…"}
      </div>
    );

  const nextReferralReward =
    data.referrals.available ||
    data.referrals.milestones.find(
      (milestone) => milestone.target === data.referrals.target,
    )?.reward ||
    12000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Rewards</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Complete activities, track your progress and claim wallet credit.
        </p>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500">
          {error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Monthly spending" description="Spend ₦50,000 this month across Temp Number, including API orders." item={data.monthly} reward={2000} type="monthly" onClaim={claim} busy={busy} format={money} />
        <Card title="7-day order streak" description="Complete at least one order each day for seven consecutive days." item={data.streak} reward={1000} type="streak" onClaim={claim} busy={busy} />
        <Card title="Rental cashback" description="Earn 1% on completed dashboard number rentals. Claim from ₦1,000." item={data.cashback} reward={data.cashback.current} type="cashback" onClaim={claim} busy={busy} format={money} />
        <Card title="Top-up bonus" description="Earn 5% whenever top-up wallet with at least ₦100,000." item={data.topup} reward={data.topup.current} rewardText="5%" hideCounter type="topup" onClaim={claim} busy={busy} format={money} />
        <Card title="Referral milestones" description="Rewards unlock when referred users complete their first order." item={data.referrals} reward={nextReferralReward} type="referrals" onClaim={claim} busy={busy} />
      </div>
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
        <h2 className="font-semibold text-[var(--text-primary)]">Invite friends</h2>
        <div className="mt-3 flex gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-[var(--bg-card-inner)] p-3 text-xs text-[var(--text-secondary)]">{data.referrals.link}</code>
          <button onClick={async () => { await navigator.clipboard.writeText(data.referrals.link); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="rounded-lg border border-[var(--border-color)] px-4 text-xs text-green-500">{copied ? "Copied" : "Copy link"}</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.referrals.milestones.map((milestone) => <span key={milestone.target} className="rounded-full bg-[var(--bg-card-inner)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">{milestone.target} referrals · {money(milestone.reward)}</span>)}
        </div>
      </section>
    </div>
  );
}
