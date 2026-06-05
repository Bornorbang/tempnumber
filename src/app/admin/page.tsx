"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Stats = { users: number; rentals: number; topups: number; revenue: number };

export default function AdminOverviewPage() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tn_token") ?? "";
    Promise.all([
      fetch("/api/admin/users",  { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/admin/topups", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/admin/rentals",{ headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([users, topups, rentals]) => {
        const userArr   = Array.isArray(users) ? users : [];
        setStats({
          users:   userArr.length,
          rentals: rentals?.received_total ?? 0,
          topups:  topups?.total  ?? 0,
          revenue: rentals?.received_revenue ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users",       value: stats?.users ?? 0,                     fmt: (v: number) => v.toLocaleString(),                              href: "/admin/users",          color: "text-blue-400"   },
    { label: "Total Rentals",     value: stats?.rentals ?? 0,                   fmt: (v: number) => v.toLocaleString(),                              href: "/admin/rentals",        color: "text-purple-400" },
    { label: "Total Top-Ups",     value: stats?.topups ?? 0,                    fmt: (v: number) => v.toLocaleString(),                              href: "/admin/wallet-history", color: "text-yellow-400" },
    { label: "Verified Revenue",  value: stats?.revenue ?? 0,                   fmt: (v: number) => `₦${v.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, href: "/admin/wallet-history", color: "text-green-400"  },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Platform-wide statistics at a glance.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-7 h-7 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-green-500/40 transition-colors block"
            >
              <p className="text-gray-400 text-xs mb-1">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.fmt(c.value)}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Manage Users",         href: "/admin/users",          desc: "View, adjust wallets, toggle admin" },
          { label: "Announcements",         href: "/admin/announcements",  desc: "Post and delete platform announcements" },
          { label: "Wallet History",        href: "/admin/wallet-history", desc: "All top-ups across every account" },
          { label: "Rental History",        href: "/admin/rentals",        desc: "Every number rented by every user" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 flex items-center justify-between hover:border-green-500/40 transition-colors group"
          >
            <div>
              <p className="text-[var(--text-primary)] font-semibold text-sm">{item.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
            </div>
            <svg className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
