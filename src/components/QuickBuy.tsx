"use client";

import { useState } from "react";

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", price: 450 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", price: 600 },
  { code: "CA", name: "Canada", flag: "🇨🇦", price: 500 },
  { code: "AU", name: "Australia", flag: "🇦🇺", price: 700 },
  { code: "DE", name: "Germany", flag: "🇩🇪", price: 550 },
  { code: "FR", name: "France", flag: "🇫🇷", price: 550 },
];

const SERVICES = [
  { id: "whatsapp", name: "WhatsApp" },
  { id: "telegram", name: "Telegram" },
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "tiktok", name: "TikTok" },
  { id: "any", name: "Any Service" },
];

export default function QuickBuy() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[0].id);

  return (
    <section className="bg-slate-50 dark:bg-[#0d1424] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              Need an SMS{" "}
              <span className="text-green-500 dark:text-green-400">Verification</span>{" "}
              Code?
            </h2>
            <p className="text-slate-500 dark:text-gray-400 text-base mb-6">
              Get a temporary number and receive your code instantly.
              Pay easily in Naira — no dollar card required.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Fast. Reliable. Private.
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Pay in Naira
              </span>
            </div>
          </div>

          {/* Right: Quick buy widget */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-lg dark:shadow-2xl">
            <h3 className="text-slate-900 dark:text-white font-semibold text-base mb-5">Quick Buy</h3>

            {/* Country selector */}
            <div className="mb-4">
              <label className="text-slate-500 dark:text-gray-400 text-sm mb-2 block">Select Country</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-100 dark:bg-[#1a2235] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:border-green-500/50 transition-colors"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const c = COUNTRIES.find((c) => c.code === e.target.value);
                    if (c) setSelectedCountry(c);
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Service selector */}
            <div className="mb-6">
              <label className="text-slate-500 dark:text-gray-400 text-sm mb-2 block">Select Service</label>
              <div className="grid grid-cols-3 gap-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      selectedService === s.id
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 dark:bg-[#1a2235] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-[#1a2235] rounded-xl px-4 py-3 mb-5">
              <span className="text-slate-500 dark:text-gray-400 text-sm">Price</span>
              <span className="text-green-500 dark:text-green-400 text-xl font-bold">
                ₦{selectedCountry.price.toLocaleString()}
              </span>
            </div>

            {/* CTA */}
            <button className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-green-500/25">
              Buy Number Now
            </button>

            <p className="text-center text-slate-400 dark:text-gray-600 text-xs mt-3">
              Delivered instantly · No account required for first purchase
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
