"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { FAQS } from "@/lib/faqs";

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
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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
