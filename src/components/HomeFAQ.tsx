"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "What exactly is Temp Number?",
    a: "Temp Number lets you rent real phone numbers for SMS verification. We offer USA numbers (starting from ₦450) and numbers from 150+ countries worldwide. Choose temporary rentals for one-time use, or long-term numbers (1-30 days) for extended access.",
  },
  {
    q: "How do I pay?",
    a: "All payments are in Nigerian Naira (₦) — card or bank transfer via Paystack. No dollar card or international payment needed.",
  },
  {
    q: "What's the difference between USA and Global numbers?",
    a: "USA numbers are from our premium USA pool with high acceptance rates. Global numbers cover 150+ countries including UK, Canada, Philippines, and more. Both work for all major platforms — choose based on the service's country requirements.",
  },
  {
    q: "What if no SMS arrives?",
    a: "If you don't receive a code within the rental window, your full payment is automatically refunded to your wallet — no support ticket needed.",
  },
  {
    q: "Can I keep a number for longer?",
    a: "Yes! For USA numbers, we offer Long-Term Rentals (1-30 days) tied to a specific service, or Dedicated Numbers (1 week - 1 month) that work with all services simultaneously. Perfect if you need ongoing access.",
  },
  {
    q: "Are temporary numbers meant for permanent use?",
    a: "No. Temporary numbers are designed for one-time verification only. If you need ongoing access or ownership, consider our Long-Term USA numbers (up to 30 days) with auto-renew options.",
  },
  {
    q: "Is my account information safe?",
    a: "Absolutely. We don't ask for your real phone number to sign up — just an email. All data is encrypted and never shared with third parties.",
  },
  {
    q: "Do you offer bulk or API access?",
    a: "Our Developer API is coming soon! For now, if you need bulk numbers or integration for your business, check out our Reseller Plans with discounted rates and priority support.",
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
