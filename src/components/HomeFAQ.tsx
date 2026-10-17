"use client";

import { useState } from "react";
import Link from "next/link";

import { HOME_FAQS } from "@/lib/home-faqs";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
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
      <div hidden={!open}>
        <div className="px-5 py-4 bg-slate-50 dark:bg-[#0d1424] border-t border-slate-200 dark:border-white/10">
          <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
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
          {HOME_FAQS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <p className="text-center text-slate-500 dark:text-gray-400 text-sm mt-8">
          <Link href="/developers" className="text-green-500 hover:underline">Developer API documentation</Link>{" ? "}
          Still have questions?{" "}
          <Link href="/faq" className="text-green-500 hover:underline font-medium">
            View all FAQs
          </Link>{" "}
          or{" "}
          <Link href="/dashboard/support" className="text-green-500 hover:underline font-medium">
            contact support
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
