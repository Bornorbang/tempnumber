"use client";

import { useEffect, useState } from "react";

type Service = { api_name: string; service_name: string; price_ngn: number; stock: number; ttl: number };

export default function WholesalePrices() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/usa-wholesale-prices", { signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) throw new Error(data.error ?? "Could not load wholesale prices.");
        if (!controller.signal.aborted) setServices(data);
      })
      .catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Could not load wholesale prices."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [refresh]);
  const filtered = services.filter(service => `${service.service_name} ${service.api_name}`.toLowerCase().includes(search.toLowerCase()));
  return <section id="wholesale-prices" className="space-y-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-semibold text-[var(--text-primary)]">Reseller Wholesale Prices</h2></div>
      <button type="button" disabled={loading} onClick={() => { setLoading(true); setError(""); setRefresh(value => value + 1); }} className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm text-green-500 disabled:opacity-50">{loading ? "Loading…" : "Refresh prices"}</button>
    </div>
    <label className="block"><span className="sr-only">Search USA services</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search services…" className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-green-500" /></label>
    {error && <p role="alert" className="text-sm text-red-500">{error} Use Refresh prices to retry.</p>}
    <div className="max-h-[500px] overflow-auto rounded-xl border border-[var(--border-color)]">
      <table className="w-full text-left text-xs"><thead className="sticky top-0 bg-[var(--bg-card)] text-[var(--text-secondary)]"><tr className="border-b border-[var(--border-color)]"><th className="px-4 py-3">Service</th><th className="px-3 py-3 text-right">Duration</th><th className="px-3 py-3 text-right">Stock</th><th className="px-4 py-3 text-right whitespace-nowrap">Your cost (NGN)</th></tr></thead>
        <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
          {loading ? <tr><td colSpan={4} className="p-8 text-center">Loading wholesale prices…</td></tr> : error ? <tr><td colSpan={4} className="p-8 text-center">Prices unavailable.</td></tr> : filtered.length === 0 ? <tr><td colSpan={4} className="p-8 text-center">No services found.</td></tr> : filtered.map(service => <tr key={service.api_name} className="hover:bg-[var(--bg-card-inner)]">
            <td className="px-4 py-3"><p className="font-medium">{service.service_name}</p></td>
            <td className="px-3 py-3 text-right whitespace-nowrap">{service.ttl} min</td><td className={`px-3 py-3 text-right ${service.stock > 0 ? "text-green-500" : "text-red-500"}`}>{service.stock.toLocaleString("en-NG")}</td><td className="px-4 py-3 text-right font-bold text-green-500">₦{service.price_ngn.toLocaleString("en-NG")}</td>
          </tr>)}
        </tbody></table>
    </div>
    {!loading && !error && <p className="text-xs text-[var(--text-secondary)]">Showing {filtered.length} of {services.length} USA services. Prices refresh at most every 30 seconds; stock and final availability are checked when ordering.</p>}
  </section>;
}
