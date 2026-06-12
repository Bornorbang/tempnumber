"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import MiniFooter from "@/components/MiniFooter";
import { GoogleLogin } from "@react-oauth/google";

function SignUpForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    setLoading(true);
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordsMatch = form.confirm === "" || form.password === form.confirm;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0f1e] via-[#0d1a2e] to-[#0a1a10] flex-col justify-start gap-12 p-12 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-2 relative">
          <Image src="/updated-logo.png" alt="Temp Number" width={36} height={36} className="w-9 h-9" />
          <span className="text-white font-semibold text-lg font-display">Temp Number</span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Join thousands of<br />
            Nigerians using<br />
            <span className="text-green-400">Temp Number</span>.
          </h2>
          <p className="text-white/75 text-sm leading-relaxed mb-8">
            Get started in seconds. No dollar card. No foreign account. Just Naira.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "1", text: "Create a free account" },
              { step: "2", text: "Fund your wallet in Naira" },
              { step: "3", text: "Buy a number & receive SMS" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
                  {s.step}
                </div>
                <span className="text-gray-300 text-sm">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Image src="/updated-logo.png" alt="Temp Number" width={28} height={28} className="w-7 h-7" />
            <span className="text-slate-900 dark:text-white font-semibold font-display">Temp Number</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create your account</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Free to join. No card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Adebayo Okonkwo"
                className="w-full px-4 py-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-slate-700 dark:text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                placeholder="Re-enter password"
                className={`w-full px-4 py-3 bg-white dark:bg-[#111827] border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none transition-colors ${
                  !passwordsMatch
                    ? "border-red-400 focus:border-red-400"
                    : "border-slate-200 dark:border-white/10 focus:border-green-500"
                }`}
              />
              {!passwordsMatch && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-green-500 flex-shrink-0 cursor-pointer"
              />
              <span className="text-slate-400 dark:text-gray-500 text-xs">
                I agree to the{" "}
                <Link href="/legal/terms" className="text-green-600 dark:text-green-400 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-green-600 dark:text-green-400 hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !passwordsMatch || !agreedToTerms}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/60 text-white font-semibold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Google Sign-Up */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[var(--bg-page)] text-slate-400">or continue with</span>
            </div>
          </div>
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                await loginWithGoogle(cred.credential ?? "");
                router.push(redirectTo);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Google sign-up failed. Please try again.");
              }
            }}
            onError={() => setError("Google sign-up failed. Please try again.")}
            width="360"
            theme="outline"
            shape="rectangular"
            text="signup_with"
          />

          <p className="text-center text-slate-500 dark:text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
          <MiniFooter className="mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
