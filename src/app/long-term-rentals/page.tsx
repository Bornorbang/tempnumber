import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthCTALink from "@/components/AuthCTALink";

export const metadata: Metadata = {
  title: { absolute: "Long-term USA Phone Number Rentals | Temp Number" },
  description:
    "Rent a USA phone number for 1, 3, 7, 14, or 30 days. Receive unlimited SMS for any specific service. Pay in Naira — no dollar card needed. Available on Temp Number.",
  keywords: [
    "long term usa phone number nigeria",
    "rent usa number days naira",
    "usa number for days nigeria",
    "extended usa number rental naira",
    "usa number 7 days naira",
    "long term sms number naira",
  ],
  alternates: { canonical: "https://tempnumber.ng/long-term-rentals" },
  openGraph: {
    title: "Long-term USA Phone Number Rentals — Pay in Naira | Temp Number",
    description:
      "Rent a USA phone number for 1, 3, 7, 14, or 30 days. Unlimited SMS for your chosen service. Pay in Naira.",
    url: "https://tempnumber.ng/long-term-rentals",
    siteName: "Temp Number",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Long-term USA Phone Number Rentals — Pay in Naira | Temp Number",
    description:
      "Rent a USA phone number for 1, 3, 7, 14, or 30 days. Unlimited SMS for your chosen service. Pay in Naira.",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Top up your wallet",
    body: "Fund your Temp Number wallet using your card or bank transfer in Naira. No dollar account needed.",
  },
  {
    step: "2",
    title: "Pick a service and period",
    body: "Choose the platform you need the number for (e.g. WhatsApp, Google) and select 1, 3, 7, 14, or 30 days.",
  },
  {
    step: "3",
    title: "Get your number instantly",
    body: "Your USA number is activated within seconds. Use it on the chosen service right away.",
  },
  {
    step: "4",
    title: "View SMS in your dashboard",
    body: "All incoming SMS for that service appear in your dashboard in real time throughout your rental period.",
  },
];

const PERIODS = [
  { label: "1 Day",   ideal: "Quick verifications that need a bit more time" },
  { label: "3 Days",  ideal: "Short-term access or multi-step setups" },
  { label: "7 Days",  ideal: "Week-long campaigns or repeated logins" },
  { label: "14 Days", ideal: "Extended projects needing SMS access" },
  { label: "30 Days", ideal: "Month-long use cases or recurring SMS codes" },
];

const FAQS = [
  {
    q: "How is a long-term rental different from a regular temp number?",
    a: "A regular temp number expires after one SMS or a few minutes. A long-term rental ties a USA number to one specific service for your chosen period — you can receive unlimited SMS from that service during that time.",
  },
  {
    q: "Can I use the number on more than one service?",
    a: "Long-term rentals are tied to one service. If you need a number usable across multiple services, check out our Dedicated Numbers option instead.",
  },
  {
    q: "What if no SMS arrives?",
    a: "If no SMS is received during the rental period, your wallet is refunded automatically at expiry — no need to contact support.",
  },
  {
    q: "Can I renew after the period ends?",
    a: "Yes. You can manually renew at any time from your dashboard, or enable auto-renew so it happens automatically before expiry.",
  },
  {
    q: "What services are supported?",
    a: "Hundreds of popular services including WhatsApp, Telegram, Google, Facebook, Twitter/X, Instagram, and many more. The full list is available on the pricing page.",
  },
  {
    q: "How do I pay?",
    a: "Top up your wallet in Nigerian Naira using a bank card or bank transfer. No dollar card or FX required.",
  },
];

export default function LongTermRentalsPage() {
  return (
    <main className="bg-[var(--bg-page)] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-4 border-b border-slate-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-green-500/10 text-green-500 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Long-term Rentals
          </span>
          <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Rent a USA number<br />
            <span className="text-green-500">for days or weeks</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-8 max-w-xl mx-auto">
            Need a USA number tied to one service for a few days? Choose 1, 3, 7, 14, or
            30 days and receive unlimited SMS on it.
          </p>
          <div className="flex justify-center">
            <AuthCTALink
              dashboardPath="/dashboard/long-term"
              label="Rent a Number"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-green-500/25"
            />
          </div>
        </div>
      </section>

      {/* ── Key benefits ── */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold text-center mb-10">
            Why use long-term rentals?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
                title: "Unlimited SMS",
                body: "Receive as many messages as the service sends during your rental — logins, OTPs, alerts.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: "Pay in Naira",
                body: "No dollar card or FX stress. Fund your wallet with NGN and rent in seconds.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: "Instant number delivery",
                body: "Your USA number activates immediately. Start receiving SMS within seconds of payment.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
                title: "Auto-renew",
                body: "Never lose your number unexpectedly — enable auto-renew and it stays active while your wallet is funded.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                ),
                title: "Full message log",
                body: "Every SMS is saved in your dashboard. Check messages from any device at any time.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ),
                title: "Real, non-VOIP numbers",
                body: "Our numbers are accepted by strict platforms. Not virtual — real USA numbers.",
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
      <section className="py-14 px-4">
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
                Ready to rent your number?
              </h2>
              <p className="text-green-100 text-base mb-7 max-w-xl mx-auto">
                Create a free account, choose your service and period, and get a USA number in under a minute.
              </p>
              <div className="flex justify-center">
                <AuthCTALink
                  dashboardPath="/dashboard/long-term"
                  label="Rent a Number"
                  className="bg-white text-green-600 font-semibold px-8 py-3 rounded-xl text-sm hover:bg-green-50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
