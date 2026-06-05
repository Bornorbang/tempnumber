"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    q: "What is Temp Number?",
    a: "Temp Number lets you rent real, non-VOIP USA phone numbers for a few minutes. You receive an SMS verification code on it, then the number expires — keeping your personal number private.",
  },
  {
    q: "How do I get a number?",
    a: "Create an account, top up your wallet in Naira, then choose a service. You'll instantly receive a USA number and any SMS sent to it will appear in your dashboard.",
  },
  {
    q: "How much does it cost?",
    a: "Prices vary by service. Most numbers start from ₦450. Check our Pricing page for live prices. There are no subscription fees — you only pay per number you rent.",
  },
  {
    q: "Can I use the same number multiple times?",
    a: "No. Each number is one-time use. Once you've received your SMS or the rental period expires, the number is released. This is by design — it ensures privacy and that numbers are always fresh.",
  },
  {
    q: "What if I don't receive an SMS?",
    a: "If no SMS arrives within the rental period, your wallet is refunded immediately and automatically. No need to contact support.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "We accept card payments and bank transfers in Nigerian Naira (₦). No dollar card needed.",
  },
  {
    q: "Is my personal data safe?",
    a: "Yes. We don't require a phone number to sign up — just an email. Your wallet and rental history are private to your account. We never sell your data.",
  },
  {
    q: "Can I use Temp Number for illegal activities?",
    a: "No. Temp Number is strictly for legitimate use cases such as protecting your privacy during sign-ups. Using our service for fraud, spam, or any illegal purpose will result in an immediate account ban.",
  },
  {
    q: "Do you offer reseller pricing?",
    a: "Yes. If you resell SMS verification services, visit our Resellers page to see our wholesale pricing, which is lower than retail.",
  },
  {
    q: "How do I contact support?",
    a: "Use our Contact page or email us at support@tempnumber.ng. We respond within 24 hours on business days.",
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
            We&apos;re here to help. Reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
