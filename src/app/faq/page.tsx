"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    q: "What is Temp Number?",
    a: "Temp Number provides real phone numbers for SMS verification. We offer USA numbers (premium non-VoIP lines) and numbers from 150+ countries worldwide. You can rent temporary numbers for one-time use or long-term numbers (1-30 days) for extended access.",
  },
  {
    q: "How do I get a number?",
    a: "Create an account, top up your wallet in Naira via Paystack, then choose between USA or Global numbers. Select your service, rent instantly, and any SMS sent to your number will appear in your dashboard.",
  },
  {
    q: "What's the difference between USA and Global numbers?",
    a: "USA numbers are premium non-VoIP lines from our USA pool with the highest acceptance rates (starting from ₦450). Global numbers cover 150+ countries including UK, Canada, Philippines, Indonesia, and more. Both work for major platforms — choose based on what the service requires.",
  },
  {
    q: "Can I use the same number multiple times?",
    a: "Temporary numbers are one-time use only. Once you receive your SMS or the rental expires, the number is released. If you need ongoing access, consider our Long-Term USA numbers (1-30 days) with auto-renew, perfect for services requiring repeated verification.",
  },
  {
    q: "What if I don't receive an SMS?",
    a: "If no SMS arrives within the rental period, your wallet is refunded immediately and automatically. No need to contact support.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "We accept card payments (Visa, Mastercard, Verve) and bank transfers in Nigerian Naira (₦) via Paystack. No dollar card needed.",
  },
  {
    q: "Are you responsible if I get banned on a third-party platform?",
    a: "No. While we provide legitimate phone numbers, we are not responsible for any bans, suspensions, or issues you may face on third-party platforms. Temporary numbers are meant for temporary verification only — for ongoing use, we recommend Long-Term USA numbers.",
  },
  {
    q: "Is my personal data safe?",
    a: "Yes. We don't require your phone number to sign up — just an email. Your wallet and rental history are private. We never sell your data to third parties.",
  },
  {
    q: "Do you offer API access for developers?",
    a: "Our Developer API is coming soon! In the meantime, businesses and developers who need bulk access can explore our Reseller Plans with discounted rates and dedicated support.",
  },
  {
    q: "How do I contact support?",
    a: "Sign in and open the Support Centre from your dashboard. Select the issue you are experiencing and submit the requested information so our team can investigate it.",
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
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-base">
            Everything you need to know about Temp Number.
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <div className="mt-12 text-center p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl">
          <p className="text-slate-900 dark:text-white font-semibold mb-1">Still have questions?</p>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-4">
            Select your issue and send the information our team needs to resolve it.
          </p>
          <a
            href="/dashboard/support"
            className="inline-block bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Open Support Centre
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
