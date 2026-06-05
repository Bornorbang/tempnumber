"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Hero() {
  const { user, loading } = useAuth();
  const isAuthed = !loading && !!user;
  return (
    <section className="relative bg-[var(--bg-page)] flex items-center overflow-hidden pt-32 pb-10 lg:min-h-screen lg:pt-20 lg:pb-14">
      {/* Background glows - only visible in dark */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-green-500/10 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[3fr_2fr] gap-12 items-center w-full">
        {/* Left: Copy */}
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-600 dark:text-green-400 text-xs font-medium">🇺🇸 Real USA numbers</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">Non-VoIP numbers</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5">
            Buy Temporary{" "}
            <span className="text-green-500 dark:text-green-400">USA Phone Numbers</span>
            {" "}&amp;{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
              Pay in Naira
            </span>
          </h1>

          <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-7 max-w-xl">
            Get real non-VoIP USA phone numbers, receive SMS verification codes instantly, and pay directly in Naira.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              href={isAuthed ? "/dashboard" : "/auth/signup"}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-green-500/25 text-center"
            >
              {isAuthed ? "Dashboard" : "Get Started"}
            </Link>
            <Link
              href="/pricing"
              className="border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 text-slate-700 dark:text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors text-center"
            >
              View Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar group */}
            <div className="flex -space-x-2">
              {["bg-green-400","bg-blue-400","bg-purple-400","bg-orange-400","bg-pink-400"].map((color, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${color} border-2 border-white dark:border-[#0a0f1e] flex items-center justify-center text-white text-xs font-bold`}
                >
                  {["A","K","T","O","M"][i]}
                </div>
              ))}
            </div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Trusted by <span className="text-slate-700 dark:text-white font-semibold">10,000+</span> users worldwide
            </p>
          </div>
        </div>

        {/* Right: Hero image */}
        <div className="hidden lg:flex justify-center lg:justify-end">
          <Image
            src="/hero-image.png"
            alt="Get real non-VoIP USA phone numbers from Temp Number, receive SMS verification codes instantly, and pay directly in Naira"
            width={480}
            height={560}
            className="w-full max-w-[480px] object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
