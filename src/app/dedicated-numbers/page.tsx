import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { absolute: "Dedicated USA Phone Numbers | Temp Number" },
  description:
    "Get your own exclusive USA phone number for 1 week, 2 weeks, or 1 month. Receive unlimited SMS. Pay directly in Naira — no dollar card needed. Start today on Temp Number.",
  keywords: [
    "dedicated usa phone number nigeria",
    "buy usa number naira",
    "exclusive usa number",
    "long term usa number naira",
    "dedicated phone number for verification",
    "usa number pay naira",
  ],
  alternates: { canonical: "https://tempnumber.ng/dedicated-numbers" },
  openGraph: {
    title: "Dedicated USA Phone Numbers — Pay in Naira | Temp Number",
    description:
      "Your own exclusive USA phone number for 1 week, 2 weeks, or a month. Unlimited SMS. Pay in Naira.",
    url: "https://tempnumber.ng/dedicated-numbers",
    siteName: "Temp Number",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dedicated USA Phone Numbers — Pay in Naira | Temp Number",
    description:
      "Your own exclusive USA phone number for 1 week, 2 weeks, or a month. Unlimited SMS. Pay in Naira.",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Top up your wallet",
    body: "Add funds to your Temp Number wallet using card or bank transfer in Naira. No dollar account required.",
  },
  {
    step: "2",
    title: "Choose a rental period",
    body: "Pick 1 week, 2 weeks, or 1 month. Your exclusive USA number is activated instantly.",
  },
  {
    step: "3",
    title: "Use your number freely",
    body: "Send the number to any service. Every SMS they send you appears in your dashboard in real time.",
  },
  {
    step: "4",
    title: "Renew or cancel anytime",
    body: "Enable auto-renew to keep your number automatically, or cancel when you no longer need it.",
  },
];

const FAQS = [
  {
    q: "What makes a dedicated number different from a regular temp number?",
    a: "A regular temp number is one-time use — it expires after one SMS or a few minutes. A dedicated number is exclusively yours for days or weeks, so you can receive unlimited SMS on it from any service.",
  },
  {
    q: "Can I use my dedicated number for multiple services?",
    a: "Yes. Your dedicated number can receive SMS from any service as many times as you want during your rental period.",
  },
  {
    q: "What happens if auto-renew is on but my wallet is empty?",
    a: "If your wallet doesn't have enough funds at renewal time, the number is permanently released. We strongly recommend keeping your wallet funded if you rely on auto-renew.",
  },
  {
    q: "Can I cancel before the rental period ends?",
    a: "Yes. You can cancel at any time from your dashboard. Note that cancellations are immediate and no partial refund is issued.",
  },
  {
    q: "What periods are available?",
    a: "Currently: 1 Week, 2 Weeks, and 1 Month. Prices are shown in Naira when you log in.",
  },
  {
    q: "Is a USA number useful for Nigerian services?",
    a: "USA numbers are accepted by most global platforms — WhatsApp, Telegram, Google, Facebook, Twitter, and many more. Great for accounts that don't accept Nigerian numbers.",
  },
];

export default function DedicatedNumbersPage() {
  return (
    <main className="bg-[var(--bg-page)] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-4 border-b border-slate-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-green-500/10 text-green-500 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Dedicated Numbers
          </span>
          <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Your own exclusive<br />
            <span className="text-green-500">USA phone number</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-8 max-w-xl mx-auto">
            Rent a real, non-VOIP USA number for 1 week, 2 weeks, or a month. Receive
            unlimited SMS from any service.
          </p>
          <div className="flex justify-center">
            <Link
              href="/auth/signup?redirect=/dashboard/dedicated"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-green-500/25"
            >
              Rent Number
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key benefits ── */}
      <section className="py-14 px-4 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold text-center mb-10">
            Why choose a dedicated number?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ),
                title: "Exclusively yours",
                body: "No one else can use your number during your rental. It's reserved for you alone.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
                title: "Unlimited SMS",
                body: "Receive as many messages as you want from any service throughout your rental period.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: "Pay in Naira",
                body: "No dollar card, no FX hassle. Fund your wallet and pay in NGN directly.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
                title: "Auto-renew support",
                body: "Enable auto-renew and your number stays active automatically as long as your wallet is funded.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: "Instant activation",
                body: "Your number is ready within seconds of payment. No waiting, no approval process.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                ),
                title: "Full message history",
                body: "All SMS received on your number are logged in your dashboard — searchable and organized.",
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--border-color)] rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-14 px-4 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-5">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--border-color)] rounded-2xl px-5 py-4"
              >
                <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-2">{q}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
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
                Ready to get your dedicated number?
              </h2>
              <p className="text-green-100 text-base mb-7 max-w-xl mx-auto">
                Create a free account, top up your wallet in Naira, and activate your number in under 2 minutes.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/auth/signup?redirect=/dashboard/dedicated"
                  className="bg-white text-green-600 font-semibold px-8 py-3 rounded-xl text-sm hover:bg-green-50 transition-colors"
                >
                  Rent Number
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
