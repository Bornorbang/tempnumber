"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MiniFooter from "@/components/MiniFooter";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0f1e] via-[#0d1a2e] to-[#0a1a10] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-2 relative">
          <Image src="/updated-logo.png" alt="Temp Number" width={36} height={36} className="w-9 h-9" />
          <span className="text-white font-semibold text-lg font-display">Temp Number</span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Forgot your<br />
            <span className="text-green-400">password?</span>
          </h2>
          <p className="text-white/75 text-sm leading-relaxed">
            No problem. Enter your email address and we'll send you a secure link to reset it.
            The link expires in 1 hour.
          </p>
        </div>

        <p className="text-white/40 text-xs relative">
          © {new Date().getFullYear()} Temp Number
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Image src="/updated-logo.png" alt="Temp Number" width={28} height={28} className="w-7 h-7" />
            <span className="text-slate-900 dark:text-white font-semibold font-display">Temp Number</span>
          </Link>

          {success ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check your email</h1>
              <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                We sent a password reset link to <strong className="text-slate-700 dark:text-gray-200">{email}</strong>.
                <br />The link expires in 1 hour.
              </p>
              <p className="text-slate-400 dark:text-gray-500 text-xs mb-8">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button
                  onClick={() => { setSuccess(false); setError(null); }}
                  className="text-green-600 dark:text-green-400 hover:underline"
                >
                  try again
                </button>.
              </p>
              <Link
                href="/auth/signin"
                className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Reset password</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Enter your account email and we&apos;ll send a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <div className="mt-auto pt-12">
          <MiniFooter />
        </div>
      </div>
    </div>
  );
}
