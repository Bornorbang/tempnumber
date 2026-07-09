"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MiniFooter from "@/components/MiniFooter";

const ADMIN_NAV = [
  { label: "Overview",         href: "/admin",                   exact: true  },
  { label: "Users",            href: "/admin/users",             exact: false },
  { label: "Announcements",    href: "/admin/announcements",     exact: false },
  { label: "Updates",          href: "/admin/updates",           exact: false },
  { label: "Wallet History",   href: "/admin/wallet-history",    exact: false },
  { label: "Rental History",   href: "/admin/rentals",           exact: false },
  { label: "Long-Term Rentals",href: "/admin/long-rentals",      exact: false },
  { label: "Dedicated Numbers",href: "/admin/dedicated",          exact: false },
  { label: "Referrals",        href: "/admin/referrals",         exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user?.is_admin) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function isActive(item: (typeof ADMIN_NAV)[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-[var(--bg-section-alt)] border-r border-[var(--border-color)] z-40">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--border-color)] hover:opacity-80 transition-opacity">
          <Image src="/updated-logo.png" alt="Temp Number" width={28} height={28} className="w-7 h-7" />
          <span className="text-[var(--text-primary)] font-semibold text-sm font-display">Temp Number</span>
        </Link>

        <div className="px-4 py-3 border-b border-[var(--border-color)]">
          <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "text-slate-900 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--bg-card-inner)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="my-2 border-t border-[var(--border-color)]" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </nav>

        <div className="px-4 py-3 border-t border-[var(--border-color)]">
          <p className="text-gray-500 text-xs truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-56 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-[var(--bg-page)] border-b border-[var(--border-color)] flex items-center px-6 gap-3">
          {/* Mobile: back link */}
          <Link href="/dashboard" className="lg:hidden text-gray-400 hover:text-[var(--text-primary)] transition-colors mr-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-green-500 font-semibold text-sm">Admin Panel</span>
          <span className="text-gray-500 text-sm ml-auto hidden sm:block">{user.name}</span>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden overflow-x-auto border-b border-[var(--border-color)] bg-[var(--bg-section-alt)]">
          <div className="flex gap-1 px-4 py-2 min-w-max">
            {ADMIN_NAV.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    active ? "bg-green-500/10 text-green-500" : "text-gray-400 hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <MiniFooter />
      </div>
    </div>
  );
}
