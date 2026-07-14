"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import MiniFooter from "@/components/MiniFooter";

const AVATAR_URL =
  "https://img.magnific.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740&q=80";

const NAV = [
  { label: "USA Numbers",      href: "/dashboard/usa",           exact: true  },
  { label: "All Countries",    href: "/dashboard/global",        exact: false },
  { label: "Long-term Numbers",href: "/dashboard/long-term",     exact: false },
  { label: "Dedicated Numbers",href: "/dashboard/dedicated",     exact: false },
  { label: "Wallet",           href: "/dashboard/wallet",        exact: false },
  { label: "Announcements",    href: "/dashboard/announcements", exact: false },
  { label: "API",              href: "/dashboard/api",           exact: false },
];

// Standard sidebar (non-global pages): USA Numbers → All Countries → Long-term → Dedicated → Wallet → Refer a Friend
const STANDARD_SIDEBAR = [
  { label: "USA Numbers",       href: "/dashboard/usa",          exact: true  },
  { label: "All Countries",     href: "/dashboard/global",       exact: false },
  { label: "Long-term Numbers", href: "/dashboard/long-term",    exact: false },
  { label: "Dedicated Numbers", href: "/dashboard/dedicated",    exact: false },
  { label: "Wallet",            href: "/dashboard/wallet",       exact: false },
  { label: "Temporary Emails",  href: "/dashboard/temp-mail",    exact: false },
  { label: "Refer a Friend",    href: "/dashboard/referral",     exact: false, badge: "Earn ₦200" },
];

// Global page sidebar: All Countries → USA Numbers → Wallet → Refer a Friend
const GLOBAL_SIDEBAR = [
  { label: "All Countries", href: "/dashboard/global", exact: false },
  { label: "USA Numbers",   href: "/dashboard/usa",    exact: true  },
  { label: "Wallet",        href: "/dashboard/wallet",  exact: false },
  { label: "Temporary Emails", href: "/dashboard/temp-mail", exact: false },
  { label: "Refer a Friend", href: "/dashboard/referral", exact: false, badge: "Earn ₦200" },
];

const BOTTOM_NAV = [
  { label: "USA Numbers",   href: "/dashboard/usa",      exact: true  },
  { label: "Wallet",        href: "/dashboard/wallet",   exact: false },
  { label: "Long-term",     href: "/dashboard/long-term",exact: false },
  { label: "Dedicated",     href: "/dashboard/dedicated",exact: false },
  { label: "All Countries", href: "/dashboard/global",   exact: false },
];

// ── Icons for bottom mobile nav only ─────────────────────────────────────────
const NAV_ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  Home: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  "USA Numbers": (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Rentals: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Wallet: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  History: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "Long-term": (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Dedicated: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Announcements: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Reseller: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  API: (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "All Countries": (a) => (
    <svg className={`w-5 h-5 ${a ? "text-green-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  // Set document title based on current route
  useEffect(() => {
    const PAGE_TITLES: Record<string, string> = {
      "/dashboard":               "Dashboard",
      "/dashboard/usa":           "USA Numbers",
      "/dashboard/rentals":       "Rentals",
      "/dashboard/wallet":        "Wallet",
      "/dashboard/history":       "History",
      "/dashboard/long-term":     "Long-Term Numbers",
      "/dashboard/api":           "Developer API",
      "/dashboard/global":         "All Countries",
      "/dashboard/dedicated":      "Dedicated Numbers",
      "/dashboard/announcements": "Announcements",
      "/dashboard/profile":       "Profile",
      "/dashboard/referral":      "Refer a Friend",
      "/dashboard/temp-mail":     "Temporary Emails",
    };
    const title = PAGE_TITLES[pathname] ?? "Dashboard";
    document.title = `${title} - Temp Number`;
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push("/auth/signin");
  }, [loading, user, router]);

  function isActive(item: (typeof NAV)[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  function ThemeToggle() {
    return (
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        suppressHydrationWarning
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-all"
      >
        <span suppressHydrationWarning>
          {theme === "dark" ? (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </span>
      </button>
    );
  }

  // Show spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // ── Selection page (/dashboard exact) — no sidebar, full-screen ──────────
  if (pathname === "/dashboard") {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-[var(--bg-section-alt)] border-r border-[var(--border-color)] z-40">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--border-color)] hover:opacity-80 transition-opacity">
          <Image src="/updated-logo.png" alt="Temp Number" width={28} height={28} className="w-7 h-7" />
          <span className="text-[var(--text-primary)] font-semibold text-sm font-display">Temp Number</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {(pathname.startsWith("/dashboard/global") ? GLOBAL_SIDEBAR : STANDARD_SIDEBAR).map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "text-slate-900 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--bg-card-inner)]"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="shrink-0 whitespace-nowrap text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-green-500 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          {user.is_admin && (
            <>
              <div className="my-2 border-t border-[var(--border-color)]" />
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname.startsWith("/admin")
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "text-slate-900 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--bg-card-inner)]"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin
              </Link>
            </>
          )}
        </nav>

        {/* Community links */}
        <div className="mx-3 mb-4 border-t border-[var(--border-color)] pt-3 space-y-0.5">
          <a
            href="https://whatsapp.com/channel/0029Vb7uTgC30LKUfBRj3p2L"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-900 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--bg-card-inner)] transition-all"
          >
            Join Channel
          </a>
          <a
            href="https://wa.me/2349160421899"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-900 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--bg-card-inner)] transition-all"
          >
            Contact Support
          </a>
        </div>
      </aside>

      {/* ── Desktop Top Bar (right of sidebar) ── */}
      <header className="hidden lg:flex fixed top-0 left-56 right-0 h-14 bg-[var(--bg-page)] border-b border-[var(--border-color)] items-center justify-end px-6 gap-2 z-30">
        <ThemeToggle />
        <Link href="/dashboard/announcements" aria-label="Announcements" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-all">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full" />
        </Link>
        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setProfileOpen((o) => !o); }}
            aria-label="Profile"
            className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-green-500 transition-all flex-shrink-0"
          >
            <Image src={AVATAR_URL} alt="Profile" width={36} height={36} className="w-full h-full object-cover" unoptimized />
          </button>
          {profileOpen && (
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-11 w-52 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <Link
                href="/dashboard/profile/change-password"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </Link>
              <div className="border-t border-[var(--border-color)] my-1" />
              <button
                onClick={() => { setProfileOpen(false); logout(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile Top Header ── */}
      <header className="lg:hidden flex items-center justify-between px-5 pt-10 pb-4 sticky top-0 bg-[var(--bg-page)]/95 backdrop-blur z-30 border-b border-[var(--border-color)]">
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <Image src="/updated-logo.png" alt="Temp Number" width={28} height={28} className="w-7 h-7" />
          <span className="text-[var(--text-primary)] font-semibold text-base font-display">Temp Number</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/dashboard/announcements" aria-label="Announcements" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full" />
          </Link>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setProfileOpen((o) => !o); }}
              aria-label="Profile"
              className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
            >
              <Image src={AVATAR_URL} alt="Profile" width={36} height={36} className="w-full h-full object-cover" unoptimized />
            </button>
            {profileOpen && (
              <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-11 w-52 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link
                  href="/dashboard/profile/change-password"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </Link>
                <div className="border-t border-[var(--border-color)] my-1" />
                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-[var(--text-primary)] transition-all"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Slide-down Menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 pt-[88px]" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="bg-[var(--bg-section-alt)] border-b border-[var(--border-color)] shadow-2xl px-4 py-3 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {(pathname.startsWith("/dashboard/global") ? GLOBAL_SIDEBAR : STANDARD_SIDEBAR).map((item) => {
              const active = isActive(item);
              const isReferral = item.href === "/dashboard/referral";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isReferral && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {user.is_admin && (
              <>
                <div className="my-1 border-t border-[var(--border-color)]" />
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]"
                  }`}
                >
                  Admin
                </Link>
              </>
            )}
            <div className="border-t border-[var(--border-color)] pt-1 mt-1 space-y-1">
              <a
                href="https://whatsapp.com/channel/0029Vb7uTgC30LKUfBRj3p2L"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-all"
              >
                Join Channel
              </a>
              <a
                href="https://wa.me/2349160421899"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)] transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="lg:ml-56 lg:pt-14 pb-24 lg:pb-0 flex flex-col min-h-screen">
        <div className="max-w-5xl mx-auto p-5 lg:p-8 flex-1 flex flex-col w-full">
          <div className="flex-1">{children}</div>
          <MiniFooter className="mt-10" />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[var(--bg-card)]/95 backdrop-blur border-t border-[var(--border-color)] flex justify-around px-2 py-2 z-40">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1.5"
            >
              {NAV_ICONS[item.label](active)}
              <span className={`text-[10px] font-medium ${active ? "text-green-400" : "text-gray-500"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
