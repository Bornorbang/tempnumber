"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NGN_RATE = 1600;
const FIVESIM_MARGIN = 700;

function usdToNgn(usd: string | number) {
  return (Math.ceil(Number(usd) * NGN_RATE) + 700).toLocaleString();
}
function fivesimToNgn(price: number) {
  return (Math.ceil(price * NGN_RATE) + FIVESIM_MARGIN).toLocaleString();
}

type Service = {
  service_name: string;
  api_name: string;
  price: string;
  ttl: number;
  stock: number;
  multiple_sms: string;
};

type FivesimProduct = {
  name: string;
  Category: string;
  Qty: number;
  Price: number;
};

const COUNTRY_ISO: Record<string, string> = {
  afghanistan:"AF", albania:"AL", algeria:"DZ", angola:"AO", argentina:"AR",
  armenia:"AM", australia:"AU", austria:"AT", azerbaijan:"AZ", bahrain:"BH",
  bangladesh:"BD", belgium:"BE", brazil:"BR", bulgaria:"BG", cambodia:"KH",
  cameroon:"CM", canada:"CA", chile:"CL", colombia:"CO", croatia:"HR",
  czech:"CZ", denmark:"DK", egypt:"EG", england:"GB", estonia:"EE",
  ethiopia:"ET", finland:"FI", france:"FR", georgia:"GE", germany:"DE",
  ghana:"GH", greece:"GR", hungary:"HU", india:"IN", indonesia:"ID",
  ireland:"IE", israel:"IL", italy:"IT", ivorycoast:"CI", jordan:"JO",
  kazakhstan:"KZ", kenya:"KE", kuwait:"KW", laos:"LA", latvia:"LV",
  lithuania:"LT", malaysia:"MY", mexico:"MX", moldova:"MD", mongolia:"MN",
  morocco:"MA", netherlands:"NL", nigeria:"NG", norway:"NO", pakistan:"PK",
  peru:"PE", philippines:"PH", poland:"PL", portugal:"PT", romania:"RO",
  russia:"RU", saudiarabia:"SA", senegal:"SN", serbia:"RS", singapore:"SG",
  slovakia:"SK", southafrica:"ZA", spain:"ES", srilanka:"LK", sweden:"SE",
  taiwan:"TW", tajikistan:"TJ", tanzania:"TZ", thailand:"TH", tunisia:"TN",
  ukraine:"UA", usa:"US", uzbekistan:"UZ", venezuela:"VE", vietnam:"VN",
};

function countryFlag(code: string): string {
  const iso = COUNTRY_ISO[(code ?? "").toLowerCase()];
  if (!iso) return "\uD83C\uDF10";
  return iso.toUpperCase().split("").map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");
}

const COUNTRIES = [
  { code: "england",      name: "United Kingdom" },
  { code: "usa",          name: "United States" },
  { code: "russia",       name: "Russia" },
  { code: "india",        name: "India" },
  { code: "indonesia",    name: "Indonesia" },
  { code: "brazil",       name: "Brazil" },
  { code: "philippines",  name: "Philippines" },
  { code: "pakistan",     name: "Pakistan" },
  { code: "bangladesh",   name: "Bangladesh" },
  { code: "nigeria",      name: "Nigeria" },
  { code: "germany",      name: "Germany" },
  { code: "france",       name: "France" },
  { code: "canada",       name: "Canada" },
  { code: "australia",    name: "Australia" },
  { code: "netherlands",  name: "Netherlands" },
  { code: "sweden",       name: "Sweden" },
  { code: "ukraine",      name: "Ukraine" },
  { code: "kazakhstan",   name: "Kazakhstan" },
  { code: "vietnam",      name: "Vietnam" },
  { code: "malaysia",     name: "Malaysia" },
  { code: "mexico",       name: "Mexico" },
  { code: "kenya",        name: "Kenya" },
  { code: "ghana",        name: "Ghana" },
  { code: "egypt",        name: "Egypt" },
];

export default function PricingPage() {
  const router = useRouter();

  // USA (Getatext)
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  // All Countries (5sim)
  const [selectedCountry, setSelectedCountry] = useState("england");
  const [globalProducts, setGlobalProducts] = useState<FivesimProduct[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdown, setCountryDropdown] = useState(false);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((data) => {
        const arr: Service[] = Array.isArray(data) ? data : [data];
        setServices(arr.filter((s) => s && s.service_name));
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    setGlobalLoading(true);
    setGlobalError(false);
    setGlobalProducts([]);
    fetch(`/api/prices/global?country=${encodeURIComponent(selectedCountry)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setGlobalError(true); setGlobalLoading(false); return; }
        const products: FivesimProduct[] = Object.entries(
          data as Record<string, { Category: string; Qty: number; Price: number }>
        )
          .map(([name, p]) => ({
            name,
            Category: p.Category ?? "activation",
            Qty: p.Qty ?? 0,
            Price: p.Price ?? 0,
          }))
          .filter((p) => p.Category === "activation")
          .sort((a, b) => {
            if ((a.Qty > 0) !== (b.Qty > 0)) return a.Qty > 0 ? -1 : 1;
            return a.Price - b.Price;
          });
        setGlobalProducts(products);
        setGlobalLoading(false);
      })
      .catch(() => { setGlobalError(true); setGlobalLoading(false); });
  }, [selectedCountry]);

  const filtered = services.filter((s) =>
    s.service_name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGlobal = globalProducts.filter((p) =>
    p.name.replace(/_/g, " ").toLowerCase().includes(globalSearch.toLowerCase())
  );

  const selectedCountryInfo = COUNTRIES.find((c) => c.code === selectedCountry);
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
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

      {/* USA Service Prices */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl">{countryFlag("usa")}</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              USA Service Prices
            </h2>
          </div>
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
                      <td className="px-5 py-3"><div className="h-3 w-28 bg-slate-200 dark:bg-white/10 rounded animate-pulse" /></td>
                      {[1, 2, 3].map((j) => (
                        <td key={j} className="px-4 py-3 text-right"><div className="h-3 w-10 bg-slate-200 dark:bg-white/10 rounded animate-pulse ml-auto" /></td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr><td colSpan={4} className="text-center py-12 text-red-400 text-sm">Could not load prices. Please refresh.</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">No services found.</td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.api_name}
                      onClick={() => router.push("/dashboard/usa")}
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-2.5">
                        <p className="text-slate-900 dark:text-white font-medium text-xs">{s.service_name}</p>
                        {s.multiple_sms === "true" && <p className="text-[10px] text-gray-400">Multi-SMS</p>}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-500 dark:text-gray-400 text-xs">{s.ttl}m</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-medium ${s.stock === 0 ? "text-red-400" : "text-slate-900 dark:text-white"}`}>
                          {s.stock > 0 ? s.stock : "0"}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className="text-slate-900 dark:text-white font-semibold text-xs">&#8358;{usdToNgn(s.price)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && !error && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-slate-400 text-xs">Showing {filtered.length} of {services.length} services</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-slate-400 text-xs">Live</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* All Countries Prices (5sim) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl">{"\uD83C\uDF0D"}</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Countries Prices
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Country selector */}
            <div className="relative">
              <button
                onClick={() => setCountryDropdown((o) => !o)}
                className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-2 hover:border-green-500 transition-colors focus:outline-none min-w-[160px] justify-between"
              >
                <span>{countryFlag(selectedCountry)} {selectedCountryInfo?.name ?? selectedCountry}</span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${countryDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {countryDropdown && (
                <div className="absolute z-50 right-0 mt-1 w-56 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-2 border-b border-slate-100 dark:border-white/10">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1a2235] text-slate-900 dark:text-white text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none placeholder-gray-400"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setSelectedCountry(c.code); setCountryDropdown(false); setCountrySearch(""); }}
                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${selectedCountry === c.code ? "text-green-500 font-medium" : "text-slate-900 dark:text-white"}`}
                      >
                        <span>{countryFlag(c.code)}</span>{c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Service search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl pl-9 pr-4 py-2 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-[#111827] z-10">
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a2235]">
                  <th className="text-left text-slate-500 dark:text-gray-400 font-medium text-xs px-5 py-3">Service</th>
                  <th className="text-right text-slate-500 dark:text-gray-400 font-medium text-xs px-4 py-3">Stock</th>
                  <th className="text-right text-slate-500 dark:text-gray-400 font-medium text-xs px-5 py-3">Price (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {globalLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3"><div className="h-3 w-28 bg-slate-200 dark:bg-white/10 rounded animate-pulse" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-3 w-10 bg-slate-200 dark:bg-white/10 rounded animate-pulse ml-auto" /></td>
                      <td className="px-5 py-3 text-right"><div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : globalError ? (
                  <tr><td colSpan={3} className="text-center py-12 text-red-400 text-sm">Could not load prices. Please try another country.</td></tr>
                ) : filteredGlobal.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-12 text-slate-400 text-sm">No activation services found for this country.</td></tr>
                ) : (
                  filteredGlobal.map((p) => (
                    <tr
                      key={p.name}
                      onClick={() => router.push("/dashboard/global")}
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-2.5">
                        <p className="text-slate-900 dark:text-white font-medium text-xs capitalize">{p.name.replace(/_/g, " ")}</p>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-medium ${p.Qty === 0 ? "text-red-400" : "text-slate-900 dark:text-white"}`}>
                          {p.Qty > 0 ? p.Qty.toLocaleString() : "0"}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className="text-slate-900 dark:text-white font-semibold text-xs">&#8358;{fivesimToNgn(p.Price)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!globalLoading && !globalError && globalProducts.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-slate-400 text-xs">
                Showing {filteredGlobal.length} activation services &middot; {countryFlag(selectedCountry)} {selectedCountryInfo?.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-slate-400 text-xs">Live</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-slate-400 dark:text-gray-500 text-xs mt-3 text-center">
          Prices may vary slightly by operator at time of purchase.
        </p>
      </section>

      <Footer />
    </main>
  );
}
