"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Types & helpers ───────────────────────────────────────────────────────────

type Service = {
  service_name: string;
  api_name: string;
  price: string; // USD
  ttl: number;
  stock: number;
  multiple_sms: string;
};

const NGN_RATE = 1600;

function usdToResellerNgn(usd: string | number) {
  return Math.ceil(Number(usd) * NGN_RATE) + 200; // ₦200 margin — cheaper than retail (₦500)
}

// ── Pricing plans ─────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Starter Platform",
    tagline: "Everything you need to launch your own SMS verification business.",
    price: "₦500,000",
    priceNote: "One-time setup fee",
    badge: "Most Popular",
    highlight: false,
    color: "border-[var(--border-color)]",
    features: [
      "Custom-branded SMS verification web app",
      "All available services (100+)",
      "Free domain & hosting (1 year)",
      "Payment Gateway Integration",
      "Admin Dashboard",
      "Naira wallet & top-up system",
      "User registration & login",
      "Real-time SMS delivery dashboard",
      "Mobile-responsive design",
      "1 month post-launch support",
      "Basic analytics (total rentals, revenue)",
      "Training & documentation included",
    ],
    notIncluded: [],
    cta: "Get Started",
    ctaHref: "https://wa.me/2349160421899?text=Hi%2C%20I%27m%20interested%20in%20the%20Starter%20Platform%20(%E2%82%A6500%2C000).%20Please%20provide%20more%20details.",
  },
  {
    name: "Pro Platform",
    tagline: "A full-featured, revenue-ready platform built to scale your business.",
    price: "₦700,000",
    priceNote: "One-time setup fee",
    badge: "Best Value",
    highlight: true,
    color: "border-green-500",
    features: [
      "Everything in Starter, plus:",
      "Cloudflare Integration",
      "Live Chat Integration",
      "Google Sign-In (OAuth 2.0)",
      "Light / Dark mode",
      "Crypto funding option (on request)",
      "Revenue & payout dashboard",
      "Your own API reseller panel",
      "SEO-optimised pages",
      "3 months post-launch support",
      "Priority WhatsApp support",
    ],
    notIncluded: [],
    cta: "Contact Us",
    ctaHref: "https://wa.me/2349160421899?text=Hi%2C%20I%27m%20interested%20in%20the%20Pro%20Platform%20(%E2%82%A6700%2C000).%20Please%20provide%20more%20details.",
  },
];

// ── Testimonials / trust signals ──────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Choose Your Plan",
    desc: "Select the platform tier that fits your budget and goals. Both plans include a fully custom-branded web app.",
  },
  {
    number: "02",
    title: "Share Your Requirements",
    desc: "Tell us your brand name, domain, and any specific customisations. We handle the rest — design, setup, and deployment.",
  },
  {
    number: "03",
    title: "We Build & Deploy",
    desc: "Your platform is built, tested, and deployed to your hosting within 7 working days. You receive full handover documentation.",
  },
  {
    number: "04",
    title: "Launch & Earn",
    desc: "Go live, promote your brand, and keep 100% of your profits. Top up your API wallet and we handle the number supply.",
  },
];

// ── Animated stat counter ─────────────────────────────────────────────────────

function AnimatedStat({ end, suffix }: { end: number; suffix: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(end);
    };
    requestAnimationFrame(tick);
  }, [end]);
  return <>{Math.round(value)}{suffix}</>;
}

const RESELLER_STATS = [
  { end: 100, suffix: "+", label: "Services" },
  { end: 50, suffix: "+", label: "Countries" },
  { end: 7, suffix: "", label: "Days to Launch" },
  { end: 100, suffix: "%", label: "Keep Profits" },
];

// ── Why Build features ────────────────────────────────────────────────────────

const WHY_FEATURES = [
  {
    title: "Proven Infrastructure",
    desc: "Your platform is built on the same battle-tested codebase powering Temp Number — stable, fast, and secure.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "You Keep 100% Revenue",
    desc: "No royalties or revenue shares. You pay the one-time build fee, top up your API wallet, and all customer payments go directly to you.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Fully Custom Branded",
    desc: "Your logo, your colours, your domain. Customers will never know the platform was built by us.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "100+ Services",
    desc: "Tap into our global number inventory across 100+ SMS verification services, all managed through a single API.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Fast Delivery",
    desc: "Your platform is delivered within 7 working days from requirement confirmation, including full deployment and handover.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Secure by Design",
    desc: "Built with JWT auth, bcrypt password hashing, and prepared statements — OWASP-compliant out of the box.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResellerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((data) => {
        const arr: Service[] = Array.isArray(data) ? data : [data];
        setServices(arr.filter((s) => s && s.service_name));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const filtered = services.filter((s) =>
    s.service_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg-page)]">

        {/* ── Hero ── */}
        <section className="relative pt-28 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative">
            <span className="inline-block bg-green-500/10 text-green-500 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Reseller Programme
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-5">
              Start Your Own{" "}
              <span className="text-green-500">SMS Verification</span>{" "}
              Business
            </h1>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              We build a fully branded, production-ready SMS verification platform for you — powered by our trusted
              infrastructure. You set your prices, keep your profits, and grow your business.
            </p>
            <div className="flex justify-center">
              <a
                href="#plans"
                className="bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
              >
                Get Started
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-slate-50 dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-white/10 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-3">
              {RESELLER_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    <AnimatedStat end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-sm leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
                How It Works
              </h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto">
                From enquiry to a live, revenue-generating platform in under a week.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6"
                >
                  <p className="text-4xl font-black text-green-500/20 mb-3 leading-none">{step.number}</p>
                  <h3 className="text-[var(--text-primary)] font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Live Service Prices ── */}
        <section className="py-16 px-4 bg-[var(--bg-section-alt)]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
                Reseller Wholesale Prices
              </h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-2xl mx-auto">
                The prices below are what your platform will source numbers at — you set your own retail price on top and keep the difference.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm mx-auto mb-6">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search services…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                    <tr className="border-b border-[var(--border-color)]">
                      <th className="text-left text-gray-500 font-medium text-xs px-4 py-2.5">Service</th>
                      <th className="text-right text-gray-500 font-medium text-xs px-3 py-2.5">Duration</th>
                      <th className="text-right text-gray-500 font-medium text-xs px-3 py-2.5">Stock</th>
                      <th className="text-right text-gray-500 font-medium text-xs px-4 py-2.5">Your Cost (NGN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {loading ? (
                      Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i} className="border-b border-[var(--border-color)]">
                          <td className="px-4 py-2">
                            <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                          </td>
                          {[1, 2, 3].map((j) => (
                            <td key={j} className="px-3 py-2 text-right">
                              <div className="h-3 w-10 bg-gray-200 dark:bg-white/10 rounded animate-pulse ml-auto" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : error ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-red-400 text-sm">
                          Could not load live prices. Please refresh.
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-gray-500 text-sm">
                          No services found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((s) => {
                        const resellerPrice = usdToResellerNgn(s.price);
                        return (
                          <tr key={s.api_name} className="hover:bg-[var(--bg-card-inner)] transition-colors">
                            <td className="px-4 py-2">
                              <p className="text-slate-900 dark:text-white font-medium text-xs">{s.service_name}</p>
                              {s.multiple_sms === "true" && (
                                <p className="text-[10px] text-gray-400">Multi-SMS</p>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700 dark:text-gray-400 text-xs">{s.ttl}m</td>
                            <td className="px-3 py-2 text-right">
                              <span className={`text-xs font-medium ${
                                s.stock > 50 ? "text-green-500" :
                                s.stock > 5  ? "text-yellow-500" :
                                s.stock > 0  ? "text-orange-400" :
                                               "text-red-400"
                              }`}>
                                {s.stock > 0 ? `${s.stock}` : "0"}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <span className="text-green-500 font-bold text-xs">
                                ₦{resellerPrice.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {!loading && !error && (
                <div className="px-5 py-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <p className="text-gray-500 text-xs">
                    Showing {filtered.length} of {services.length} services · Prices update live
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-gray-500 text-xs">Live</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-gray-400 text-xs mt-4">
              Prices shown are your wholesale cost. Set your retail price above this and earn the margin on every rental.
            </p>
          </div>
        </section>

        {/* ── Pricing Plans ── */}
        <section id="plans" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
                Platform Development Plans
              </h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto">
                One-time payment. No monthly licence fee. You own the platform outright.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-[var(--bg-card)] border-2 ${plan.color} rounded-2xl p-7 flex flex-col`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-green-500/30">
                        ⭐ {plan.badge}
                      </span>
                    </div>
                  )}
                  {!plan.highlight && plan.badge && (
                    <div className="mb-4">
                      <span className="bg-[var(--bg-card-inner)] text-[var(--text-secondary)] text-xs font-semibold px-3 py-1 rounded-full border border-[var(--border-color)]">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  {plan.highlight && <div className="mb-4 h-6" />}

                  <h3 className="text-[var(--text-primary)] text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-5">{plan.tagline}</p>

                  <div className="mb-6">
                    <span className="text-2xl sm:text-4xl font-black text-[var(--text-primary)]">{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-2">{plan.priceNote}</span>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[var(--text-secondary)] text-sm">{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 opacity-50">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-[var(--text-secondary)] text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaHref}
                    className={`block text-center font-semibold text-sm py-3 rounded-xl transition-colors ${
                      plan.highlight
                        ? "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20"
                        : "bg-[var(--bg-card-inner)] border border-[var(--border-color)] hover:border-green-500 text-[var(--text-primary)]"
                    }`}
                  >
                    {plan.cta} →
                  </a>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400 text-xs mt-6">
              Not sure which plan is right for you?{" "}
              <a href="https://wa.me/2349160421899?text=Hi%2C%20I%27d%20like%20help%20choosing%20a%20reseller%20plan." target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                Send us a message
              </a>{" "}
              and we&apos;ll help you decide.
            </p>
          </div>
        </section>

        {/* ── What You Get ── */}
        <section className="bg-[var(--bg-page)] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Why Build With Temp Number?
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Everything you need to launch a profitable SMS verification business
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 ${f.bg} ${f.color} rounded-xl mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-slate-50 dark:bg-[#0d1424] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl px-8 py-12 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Ready to launch your platform?
                </h2>
                <p className="text-green-100 text-base mb-7 max-w-xl mx-auto">
                  Contact us today and we&apos;ll get back to you within 24 hours with a full project timeline.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/2349160421899?text=Hi%2C%20I%20want%20to%20build%20my%20SMS%20verification%20platform.%20Please%20send%20me%20a%20project%20timeline."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 font-semibold px-7 py-3 rounded-xl text-sm hover:bg-green-50 transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
