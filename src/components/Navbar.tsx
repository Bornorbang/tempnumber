"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Pricing",  href: "/pricing" },
  { label: "Resellers", href: "/reseller" },
  { label: "FAQ",      href: "/faq" },
  { label: "Contact",  href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const isAuthed = !loading && !!user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0f1e]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/updated-logo.png" alt="Buy Temporary USA Phone Numbers & Pay in Naira" width={32} height={32} className="w-8 h-8" />
            <span className="text-slate-900 dark:text-white font-semibold text-base font-display">Temp Number</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth + Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthed ? (
              <Link
                href="/dashboard"
                className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="border border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500/10 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-white/10 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm">
                {l.label}
              </Link>
            ))}
            {isAuthed ? (
              <Link
                href="/dashboard"
                className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="border border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500/10 text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
