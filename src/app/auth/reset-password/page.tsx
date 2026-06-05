"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MiniFooter from "@/components/MiniFooter";

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token") ?? "";

  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new reset link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/auth/signin"), 3000);
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
            Set a new<br />
            <span className="text-green-400">password</span>
          </h2>
          <p className="text-white/75 text-sm leading-relaxed">
            Choose a strong password — at least 8 characters.
            Once updated, you can sign in with your new password immediately.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Password updated!</h1>
              <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                Your password has been reset successfully.
                Redirecting you to sign in…
              </p>
              <Link
                href="/auth/signin"
                className="inline-block py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Sign in now
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">New password</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                  {(error.includes("invalid") || error.includes("expired")) && (
                    <span>
                      {" "}<Link href="/auth/forgot-password" className="underline font-medium">Request a new link</Link>
                    </span>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-3 pr-11 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={8}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3 pr-11 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Strength hint */}
                {password.length > 0 && (
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= (i + 1) * 3
                            ? password.length >= 12
                              ? "bg-green-500"
                              : password.length >= 8
                              ? "bg-yellow-400"
                              : "bg-red-400"
                            : "bg-slate-200 dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
                <Link href="/auth/signin" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                  ← Back to sign in
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
