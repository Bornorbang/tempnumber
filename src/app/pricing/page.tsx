"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NGN_RATE = 1600;
function usdToNgn(usd: string | number) {
  return (Math.ceil(Number(usd) * NGN_RATE) + 500).toLocaleString();
}

type Service = {
  service_name: string;
  api_name: string;
  price: string;
  ttl: number;
  stock: number;
  multiple_sms: string;
};

export default function PricingPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

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
    <main className="bg-[var(--bg-page)] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-base">
          Pay only for what you use. All prices are in Nigerian Naira (NGN).
          No hidden fees, no subscriptions required.
        </p>
      </section>

      {/* Services table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Service Prices
          </h2>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl pl-9 pr-4 py-2 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-[#111827] z-10">
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a2235]">
                  <th className="text-left text-slate-500 dark:text-gray-400 font-medium text-xs px-5 py-3">Service</th>
                  <th className="text-right text-slate-500 dark:text-gray-400 font-medium text-xs px-4 py-3">TTL</th>
                  <th className="text-right text-slate-500 dark:text-gray-400 font-medium text-xs px-4 py-3">Stock</th>
                  <th className="text-right text-slate-500 dark:text-gray-400 font-medium text-xs px-5 py-3">Price (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3">
                        <div className="h-3 w-28 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                      </td>
                      {[1, 2, 3].map((j) => (
                        <td key={j} className="px-4 py-3 text-right">
                          <div className="h-3 w-10 bg-slate-200 dark:bg-white/10 rounded animate-pulse ml-auto" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-red-400 text-sm">
                      Could not load prices. Please refresh.
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                      No services found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.api_name}
                      onClick={() => router.push("/dashboard")}
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-2.5">
                        <p className="text-slate-900 dark:text-white font-medium text-xs">{s.service_name}</p>
                        {s.multiple_sms === "true" && (
                          <p className="text-[10px] text-gray-400">Multi-SMS</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-500 dark:text-gray-400 text-xs">{s.ttl}m</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-medium ${
                          s.stock === 0 ? "text-red-400" : "text-slate-900 dark:text-white"
                        }`}>
                          {s.stock > 0 ? s.stock : "0"}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className="text-slate-900 dark:text-white font-semibold text-xs">
                          &#8358;{usdToNgn(s.price)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && !error && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-slate-400 text-xs">
                Showing {filtered.length} of {services.length} services
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-slate-400 text-xs">Live</span>
              </div>
            </div>
          )}
        </div>

      </section>

      <Footer />
    </main>
  );
}