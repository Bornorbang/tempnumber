"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "What exactly is Temp Number?",
    a: "Temp Number lets you rent a real USA phone number for a few minutes to receive one SMS verification code. Once done, the number expires — your personal number stays private.",
  },
  {
    q: "How do I pay?",
    a: "All payments are in Nigerian Naira (₦) — card or bank transfer. No dollar card or international payment needed.",
  },
  {
    q: "How long do I have to receive the code?",
    a: "Each number comes with a TTL (time-to-live) shown on the service listing. Most are between 10 and 30 minutes. The countdown starts the moment you rent.",
  },
  {
    q: "What if no SMS arrives?",
    a: "If you don't receive a code within the rental window, your full payment is automatically refunded to your wallet — no support ticket needed.",
  },
  {
    q: "Are these real numbers accepted everywhere?",
    a: "Yes. All numbers are genuine non-VoIP USA lines with valid area codes, accepted by every major platform including WhatsApp, Google, Instagram, and more.",
  },
  {
    q: "Can I reuse a number?",
    a: "No. Each rental is one-time use. This ensures every number is fresh and accepted by verification systems that block recycled numbers.",
  },
  {
    q: "Is my account information safe?",
    a: "Absolutely. We don't ask for your real phone number to sign up — just an email. All data is encrypted and never shared with third parties.",
  },
  {
    q: "Do you offer bulk or reseller pricing?",
    a: "Yes. Visit our Resellers page for wholesale API pricing and white-label platform options.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1a2235] transition-colors"
      >
        <span className="text-slate-900 dark:text-white font-medium text-sm">{q}</span>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-50 dark:bg-[#0d1424] border-t border-slate-200 dark:border-white/10">
          <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HomeFAQ() {
  return (
    <section className="bg-[var(--bg-page)] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Everything you need to know before you get started
          </p>
        </div>

        {/* 2-column grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {FAQS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <p className="text-center text-slate-500 dark:text-gray-400 text-sm mt-8">
          Still have questions?{" "}
          <Link href="/faq" className="text-green-500 hover:underline font-medium">
            View all FAQs
          </Link>{" "}
          or{" "}
          <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline font-medium">
            contact support
          </a>
          .
        </p>
      </div>
    </section>
  );
}
