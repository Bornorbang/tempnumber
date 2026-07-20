"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import UpdateMarquee from "@/components/UpdateMarquee";

// ── Country list — codes match 5sim's /v1/guest/countries exactly ─────────────
const COUNTRIES = [
  { code: "afghanistan",             name: "Afghanistan" },
  { code: "albania",                 name: "Albania" },
  { code: "algeria",                 name: "Algeria" },
  { code: "angola",                  name: "Angola" },
  { code: "antiguaandbarbuda",       name: "Antigua & Barbuda" },
  { code: "argentina",               name: "Argentina" },
  { code: "armenia",                 name: "Armenia" },
  { code: "aruba",                   name: "Aruba" },
  { code: "australia",               name: "Australia" },
  { code: "austria",                 name: "Austria" },
  { code: "azerbaijan",              name: "Azerbaijan" },
  { code: "bahamas",                 name: "Bahamas" },
  { code: "bahrain",                 name: "Bahrain" },
  { code: "bangladesh",              name: "Bangladesh" },
  { code: "barbados",                name: "Barbados" },
  { code: "belgium",                 name: "Belgium" },
  { code: "belize",                  name: "Belize" },
  { code: "benin",                   name: "Benin" },
  { code: "bhutane",                 name: "Bhutan" },
  { code: "bih",                     name: "Bosnia & Herzegovina" },
  { code: "bolivia",                 name: "Bolivia" },
  { code: "botswana",                name: "Botswana" },
  { code: "brazil",                  name: "Brazil" },
  { code: "bulgaria",                name: "Bulgaria" },
  { code: "burkinafaso",             name: "Burkina Faso" },
  { code: "burundi",                 name: "Burundi" },
  { code: "cambodia",                name: "Cambodia" },
  { code: "cameroon",                name: "Cameroon" },
  { code: "canada",                  name: "Canada" },
  { code: "capeverde",               name: "Cape Verde" },
  { code: "chad",                    name: "Chad" },
  { code: "chile",                   name: "Chile" },
  { code: "colombia",                name: "Colombia" },
  { code: "comoros",                 name: "Comoros" },
  { code: "congo",                   name: "Congo" },
  { code: "costarica",               name: "Costa Rica" },
  { code: "croatia",                 name: "Croatia" },
  { code: "cyprus",                  name: "Cyprus" },
  { code: "czech",                   name: "Czech Republic" },
  { code: "denmark",                 name: "Denmark" },
  { code: "djibouti",                name: "Djibouti" },
  { code: "dominicana",              name: "Dominican Republic" },
  { code: "easttimor",               name: "East Timor" },
  { code: "ecuador",                 name: "Ecuador" },
  { code: "egypt",                   name: "Egypt" },
  { code: "england",                 name: "United Kingdom" },
  { code: "equatorialguinea",        name: "Equatorial Guinea" },
  { code: "estonia",                 name: "Estonia" },
  { code: "ethiopia",                name: "Ethiopia" },
  { code: "finland",                 name: "Finland" },
  { code: "france",                  name: "France" },
  { code: "frenchguiana",            name: "French Guiana" },
  { code: "gabon",                   name: "Gabon" },
  { code: "gambia",                  name: "Gambia" },
  { code: "georgia",                 name: "Georgia" },
  { code: "germany",                 name: "Germany" },
  { code: "ghana",                   name: "Ghana" },
  { code: "greece",                  name: "Greece" },
  { code: "guadeloupe",              name: "Guadeloupe" },
  { code: "guatemala",               name: "Guatemala" },
  { code: "guinea",                  name: "Guinea" },
  { code: "guineabissau",            name: "Guinea-Bissau" },
  { code: "guyana",                  name: "Guyana" },
  { code: "haiti",                   name: "Haiti" },
  { code: "honduras",                name: "Honduras" },
  { code: "hongkong",                name: "Hong Kong" },
  { code: "hungary",                 name: "Hungary" },
  { code: "india",                   name: "India" },
  { code: "indonesia",               name: "Indonesia" },
  { code: "ireland",                 name: "Ireland" },
  { code: "israel",                  name: "Israel" },
  { code: "italy",                   name: "Italy" },
  { code: "ivorycoast",              name: "Ivory Coast" },
  { code: "jamaica",                 name: "Jamaica" },
  { code: "jordan",                  name: "Jordan" },
  { code: "kazakhstan",              name: "Kazakhstan" },
  { code: "kenya",                   name: "Kenya" },
  { code: "kuwait",                  name: "Kuwait" },
  { code: "kyrgyzstan",              name: "Kyrgyzstan" },
  { code: "laos",                    name: "Laos" },
  { code: "latvia",                  name: "Latvia" },
  { code: "lesotho",                 name: "Lesotho" },
  { code: "liberia",                 name: "Liberia" },
  { code: "lithuania",               name: "Lithuania" },
  { code: "luxembourg",              name: "Luxembourg" },
  { code: "macau",                   name: "Macau" },
  { code: "madagascar",              name: "Madagascar" },
  { code: "malawi",                  name: "Malawi" },
  { code: "malaysia",                name: "Malaysia" },
  { code: "maldives",                name: "Maldives" },
  { code: "mauritania",              name: "Mauritania" },
  { code: "mauritius",               name: "Mauritius" },
  { code: "mexico",                  name: "Mexico" },
  { code: "moldova",                 name: "Moldova" },
  { code: "mongolia",                name: "Mongolia" },
  { code: "montenegro",              name: "Montenegro" },
  { code: "morocco",                 name: "Morocco" },
  { code: "mozambique",              name: "Mozambique" },
  { code: "namibia",                 name: "Namibia" },
  { code: "nepal",                   name: "Nepal" },
  { code: "netherlands",             name: "Netherlands" },
  { code: "newcaledonia",            name: "New Caledonia" },
  { code: "nicaragua",               name: "Nicaragua" },
  { code: "nigeria",                 name: "Nigeria" },
  { code: "northmacedonia",          name: "North Macedonia" },
  { code: "norway",                  name: "Norway" },
  { code: "oman",                    name: "Oman" },
  { code: "pakistan",                name: "Pakistan" },
  { code: "panama",                  name: "Panama" },
  { code: "papuanewguinea",          name: "Papua New Guinea" },
  { code: "paraguay",                name: "Paraguay" },
  { code: "peru",                    name: "Peru" },
  { code: "philippines",             name: "Philippines" },
  { code: "poland",                  name: "Poland" },
  { code: "portugal",                name: "Portugal" },
  { code: "puertorico",              name: "Puerto Rico" },
  { code: "reunion",                 name: "Reunion" },
  { code: "romania",                 name: "Romania" },
  { code: "russia",                  name: "Russia" },
  { code: "rwanda",                  name: "Rwanda" },
  { code: "saintkittsandnevis",      name: "Saint Kitts & Nevis" },
  { code: "saintlucia",              name: "Saint Lucia" },
  { code: "saintvincentandgrenadines", name: "Saint Vincent & Grenadines" },
  { code: "salvador",                name: "El Salvador" },
  { code: "samoa",                   name: "Samoa" },
  { code: "saudiarabia",             name: "Saudi Arabia" },
  { code: "senegal",                 name: "Senegal" },
  { code: "serbia",                  name: "Serbia" },
  { code: "seychelles",              name: "Seychelles" },
  { code: "sierraleone",             name: "Sierra Leone" },
  { code: "slovakia",                name: "Slovakia" },
  { code: "slovenia",                name: "Slovenia" },
  { code: "solomonislands",          name: "Solomon Islands" },
  { code: "southafrica",             name: "South Africa" },
  { code: "spain",                   name: "Spain" },
  { code: "srilanka",                name: "Sri Lanka" },
  { code: "suriname",                name: "Suriname" },
  { code: "swaziland",               name: "Swaziland" },
  { code: "sweden",                  name: "Sweden" },
  { code: "taiwan",                  name: "Taiwan" },
  { code: "tajikistan",              name: "Tajikistan" },
  { code: "tanzania",                name: "Tanzania" },
  { code: "thailand",                name: "Thailand" },
  { code: "togo",                    name: "Togo" },
  { code: "tunisia",                 name: "Tunisia" },
  { code: "turkmenistan",            name: "Turkmenistan" },
  { code: "uganda",                  name: "Uganda" },
  { code: "uruguay",                 name: "Uruguay" },
  { code: "usa",                     name: "United States" },
  { code: "uzbekistan",              name: "Uzbekistan" },
  { code: "venezuela",               name: "Venezuela" },
  { code: "vietnam",                 name: "Vietnam" },
  { code: "zambia",                  name: "Zambia" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Product = {
  name: string;
  Category: string;
  Qty: number;
  Price: number;
  price_ngn: number;
};

type Order = {
  id: number;
  getatext_id: number;
  number: string;
  service_name: string;
  country: string | null;
  status: string;
  sms_code: string | null;
  price_ngn: number;
  rented_at: string;
  end_time: string | null;
};

type Toast = { id: number; type: "success" | "error"; title: string; body: string };

// ── Helpers ───────────────────────────────────────────────────────────────────
function getToken() {
  return typeof window !== "undefined"
    ? (localStorage.getItem("tn_token") ?? "")
    : "";
}

// price_ngn from PHP is already an integer (ceil + margin); show no decimals
function fmtNgn(n: number) {
  return "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });
}

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

// ── Country → flag emoji ──────────────────────────────────────────────────────
const COUNTRY_ISO: Record<string, string> = {
  afghanistan:"AF", albania:"AL", algeria:"DZ", angola:"AO", antiguaandbarbuda:"AG",
  argentina:"AR", armenia:"AM", aruba:"AW", australia:"AU", austria:"AT",
  azerbaijan:"AZ", bahamas:"BS", bahrain:"BH", bangladesh:"BD", barbados:"BB",
  belgium:"BE", belize:"BZ", benin:"BJ", bhutane:"BT", bih:"BA",
  bolivia:"BO", botswana:"BW", brazil:"BR", bulgaria:"BG", burkinafaso:"BF",
  burundi:"BI", cambodia:"KH", cameroon:"CM", canada:"CA", capeverde:"CV",
  chad:"TD", chile:"CL", colombia:"CO", comoros:"KM", congo:"CG",
  costarica:"CR", croatia:"HR", cyprus:"CY", czech:"CZ", denmark:"DK",
  djibouti:"DJ", dominicana:"DO", easttimor:"TL", ecuador:"EC", egypt:"EG",
  england:"GB", equatorialguinea:"GQ", estonia:"EE", ethiopia:"ET", finland:"FI",
  france:"FR", frenchguiana:"GF", gabon:"GA", gambia:"GM", georgia:"GE",
  germany:"DE", ghana:"GH", greece:"GR", guadeloupe:"GP", guatemala:"GT",
  guinea:"GN", guineabissau:"GW", guyana:"GY", haiti:"HT", honduras:"HN",
  hongkong:"HK", hungary:"HU", india:"IN", indonesia:"ID", ireland:"IE",
  israel:"IL", italy:"IT", ivorycoast:"CI", jamaica:"JM", jordan:"JO",
  kazakhstan:"KZ", kenya:"KE", kuwait:"KW", kyrgyzstan:"KG", laos:"LA",
  latvia:"LV", lesotho:"LS", liberia:"LR", lithuania:"LT", luxembourg:"LU",
  macau:"MO", madagascar:"MG", malawi:"MW", malaysia:"MY", maldives:"MV",
  mauritania:"MR", mauritius:"MU", mexico:"MX", moldova:"MD", mongolia:"MN",
  montenegro:"ME", morocco:"MA", mozambique:"MZ", namibia:"NA", nepal:"NP",
  netherlands:"NL", newcaledonia:"NC", nicaragua:"NI", nigeria:"NG",
  northmacedonia:"MK", norway:"NO", oman:"OM", pakistan:"PK", panama:"PA",
  papuanewguinea:"PG", paraguay:"PY", peru:"PE", philippines:"PH", poland:"PL",
  portugal:"PT", puertorico:"PR", qatar:"QA", reunion:"RE", romania:"RO",
  russia:"RU", rwanda:"RW", saudiarabia:"SA", senegal:"SN", serbia:"RS",
  sierraleone:"SL", singapore:"SG", slovakia:"SK", slovenia:"SI", somalia:"SO",
  southafrica:"ZA", spain:"ES", srilanka:"LK", sweden:"SE", switzerland:"CH",
  taiwan:"TW", tajikistan:"TJ", tanzania:"TZ", thailand:"TH", togo:"TG",
  tunisia:"TN", turkmenistan:"TM", uganda:"UG", uruguay:"UY", usa:"US",
  uzbekistan:"UZ", venezuela:"VE", vietnam:"VN", zambia:"ZM",
};

function countryFlag(code: string): string {
  const iso = COUNTRY_ISO[(code ?? "").toLowerCase()];
  if (!iso) return "🌐";
  return iso.toUpperCase().split("").map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");
}

// ── Toast hook ────────────────────────────────────────────────────────────────
let _tid = 0;
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function add(type: Toast["type"], title: string, body: string) {
    const id = ++_tid;
    setToasts((t) => [...t, { id, type, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }
  function dismiss(id: number) { setToasts((t) => t.filter((x) => x.id !== id)); }
  return { toasts, add, dismiss };
}

// ── OrderRow — per-row live polling, copy, cancel ─────────────────────────────
function OrderRow({
  order,
  onRemove,
  addToast,
}: {
  order: Order;
  onRemove: (getatextId: number) => void;
  addToast: (type: Toast["type"], title: string, body: string) => void;
}) {
  const [code, setCode]             = useState<string | null>(order.sms_code ?? null);
  const [status, setStatus]         = useState(order.status);
  const [copied, setCopied]         = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Poll 5sim every 5 s while active and no code yet
  useEffect(() => {
    if (status !== "active" || code !== null) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/fivesim/check", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ order_id: order.getatext_id }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.sms_code) {
          setCode(data.sms_code);
          addToast("success", "Code received!", `${order.service_name.replace(/_/g, " ")}: ${data.sms_code}`);
        }
        if (data.status === "cancelled" || data.status === "expired") {
          if (data.refunded) {
            addToast("success", "Refunded", `₦${Number(order.price_ngn).toLocaleString()} returned to your wallet`);
          }
          onRemove(order.getatext_id);
        } else if (data.status !== "active") {
          setStatus(data.status);
        }
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, code]);

  async function handleCopy() {
    try { await navigator.clipboard.writeText(order.number); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  }

  async function handleCopyCode() {
    if (!code) return;
    try { await navigator.clipboard.writeText(code); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); } catch { /* ignore */ }
  }

  async function handleCancel() {
    if (cancelling || status !== "active") return;
    setCancelling(true);
    try {
      const res = await fetch("/api/fivesim/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ order_id: order.getatext_id }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.refunded) addToast("success", "Cancelled & refunded", `₦${Number(order.price_ngn).toLocaleString()} returned to your wallet`);
        else addToast("success", "Cancelled", "Number has been cancelled");
        onRemove(order.getatext_id);
      } else {
        addToast("error", "Cancel failed", data.error ?? "Could not cancel. Please try again.");
      }
    } catch {
      addToast("error", "Cancel failed", "Network error. Please try again.");
    } finally { setCancelling(false); }
  }

  const isActive = status === "active";
  const flag = countryFlag(order.country ?? "");

  return (
    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-inner)] transition-colors">
      {/* Flag */}
      <td className="pl-3 pr-1 py-2.5 text-base text-center leading-none">{flag}</td>

      {/* Number */}
      <td className="px-2 py-2.5">
        <button onClick={handleCopy} title="Click to copy" className="flex items-center gap-1 group font-mono text-xs text-[var(--text-primary)] hover:text-green-500 transition-colors">
          <span>{order.number}</span>
          {copied ? (
            <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </button>
      </td>

      {/* Service */}
      <td className="px-2 py-2.5 text-[var(--text-secondary)] text-xs capitalize whitespace-nowrap">
        {order.service_name.replace(/_/g, " ")}
      </td>

      {/* Code */}
      <td className="px-2 py-2.5">
        {code ? (
          <button onClick={handleCopyCode} title="Click to copy code" className="flex items-center gap-1 group font-mono text-xs text-green-500 font-bold tracking-wide hover:text-green-400 transition-colors">
            <span>{code}</span>
            {codeCopied ? (
              <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
        ) : isActive ? (
          <svg className="w-3.5 h-3.5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <span className="text-gray-500 text-xs">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-2 py-2.5">
        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
          status === "active"    ? "bg-green-500/15 text-green-500"   :
          status === "completed" ? "bg-blue-500/15 text-blue-400"     :
          status === "cancelled" ? "bg-orange-500/15 text-orange-400" :
          status === "expired"   ? "bg-red-500/15 text-red-400"       :
                                   "bg-gray-200/60 dark:bg-white/5 text-gray-400"
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>

      {/* Cancel */}
      <td className="px-2 py-2.5">
        {isActive && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
          >
            {cancelling ? (
              <><svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Cancelling</>
            ) : "Cancel"}
          </button>
        )}
      </td>
    </tr>
  );
}

// ── Toast container ───────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none w-80">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border ${
          t.type === "success" ? "bg-[var(--bg-card)] border-green-500/30" : "bg-[var(--bg-card)] border-red-500/30"
        }`}>
          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${t.type === "success" ? "bg-green-500/15" : "bg-red-500/15"}`}>
            {t.type === "success" ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--text-primary)] text-sm font-semibold leading-tight">{t.title}</p>
            <p className="text-gray-400 text-xs mt-0.5">{t.body}</p>
          </div>
          <button onClick={() => onDismiss(t.id)} className="flex-shrink-0 text-gray-400 hover:text-[var(--text-primary)] transition-colors mt-0.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GlobalPage() {
  const { user, refreshUser } = useAuth();
  const { toasts, add: addToast, dismiss } = useToast();

  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedService, setSelectedService] = useState<Product | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [buyingProduct, setBuyingProduct] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersPage, setOrdersPage] = useState(1);
  const ORDERS_PAGE_SIZE = 10;

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Store this dashboard as the last visited so payment callback can redirect back here
  useEffect(() => {
    try {
      sessionStorage.setItem("tn_last_dashboard", "/dashboard/global");
    } catch { /* ignore */ }
  }, []);

  // Refresh user data if returning from successful payment
  useEffect(() => {
    try {
      if (sessionStorage.getItem("tn_payment_success") === "1") {
        sessionStorage.removeItem("tn_payment_success");
        refreshUser();
      }
    } catch { /* ignore */ }
  }, [refreshUser]);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node))
        setServiceDropdownOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  async function loadProducts(country: string) {
    setProductsLoading(true);
    setProductsError(null);
    setProducts([]);
    try {
      const res = await fetch(
        `/api/fivesim/products?country=${encodeURIComponent(country)}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) setProductsError(data.error ?? "Failed to load products.");
      else if (Array.isArray(data) && data.length > 0) setProducts(data);
      else if (Array.isArray(data)) setProductsError("No services available for this country.");
      else setProductsError(data.error ?? "Unexpected error. Try again.");
    } catch {
      setProductsError("Network error. Please check your connection.");
    } finally { setProductsLoading(false); }
  }

  function selectCountry(code: string) {
    setSelectedCountry(code);
    setDropdownOpen(false);
    setCountrySearch("");
    setSelectedService(null);
    setServiceSearch("");
    setServiceDropdownOpen(false);
    loadProducts(code);
  }

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/fivesim/orders", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only keep active and completed-with-code orders;
        // cancelled and expired are removed from the table
        setOrders(data.filter((o: Order) =>
          o.status === "active" || (o.status === "completed" && o.sms_code)
        ));
      }
    } finally { setOrdersLoading(false); }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  function removeOrder(getatextId: number) {
    setOrders((prev) => prev.filter((o) => o.getatext_id !== getatextId));
  }

  async function rentNow() {
    if (!selectedService || !selectedCountry || buyingProduct) return;
    setBuyingProduct(true);
    setBuyError(null);
    try {
      const res = await fetch("/api/fivesim/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ country: selectedCountry, product: String(selectedService.name) }),
      });
      const data = await res.json();
      if (res.ok) {
        refreshUser();
        loadOrders();
        addToast("success", "Number rented!", `${String(selectedService.name).replace(/_/g, " ")} — waiting for SMS`);
        setSelectedService(null);
      } else {
        setBuyError(data.error ?? "Failed to rent. Please try again.");
      }
    } catch { setBuyError("Network error. Please try again."); }
    finally { setBuyingProduct(false); }
  }

  const selectedCountryName = COUNTRIES.find((c) => c.code === selectedCountry)?.name;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Greeting */}
      <div>
        <p className="text-gray-400 text-sm">Good to see you,</p>
        <div className="flex items-center gap-2 overflow-hidden">
          <h1 className="text-[var(--text-primary)] text-2xl font-bold flex-shrink-0">
            {user?.name?.split(" ")[0] ?? "there"} &#128075;
          </h1>
          <UpdateMarquee />
        </div>
      </div>

      {/* Wallet balance */}
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 right-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-green-100/70 text-sm mb-1">Wallet Balance</p>
            <p className="text-white text-2xl font-bold tracking-tight">
              &#8358;{(user?.wallet_balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/wallet" className="bg-white text-green-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Top Up
            </Link>
            <Link href="/dashboard/history" className="bg-white/15 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 transition-colors">
              History
            </Link>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT: selectors */}
        <div className="flex flex-col gap-5">

          {/* Card 1 — Country */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl">
            <div className="p-5 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-green-500/15 text-green-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                <h2 className="text-[var(--text-primary)] font-bold text-base">Select Country</h2>
              </div>
              <p className="text-gray-400 text-sm">Choose the country you need a number from.</p>
            </div>
            <div className="p-5">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="w-full flex items-center justify-between bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-sm rounded-xl px-4 py-2.5 text-left transition-colors hover:border-green-500 focus:outline-none focus:border-green-500"
                >
                  <span className={selectedCountry ? "text-[var(--text-primary)]" : "text-gray-500"}>
                    {selectedCountry
                      ? `${countryFlag(selectedCountry)} ${selectedCountryName}`
                      : "Choose a country…"}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-[var(--border-color)]">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search country…"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full bg-[var(--bg-card-inner)] text-[var(--text-primary)] text-sm px-3 py-2 rounded-lg border border-[var(--border-color)] focus:outline-none focus:border-green-500 placeholder-gray-500"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {filteredCountries.length === 0 ? (
                        <p className="text-gray-500 text-sm p-4 text-center">No countries found</p>
                      ) : filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => selectCountry(c.code)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-card-inner)] flex items-center gap-2.5 ${
                            selectedCountry === c.code ? "text-green-500 font-medium" : "text-[var(--text-primary)]"
                          }`}
                        >
                          <span className="text-base leading-none">{countryFlag(c.code)}</span>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 — Service */}
          <div className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl transition-opacity ${!selectedCountry ? "opacity-50" : ""}`}>
            <div className="p-5 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-green-500/15 text-green-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="text-[var(--text-primary)] font-bold text-base">Select Service</h2>
              </div>
              <p className="text-gray-400 text-sm">
                {selectedCountry ? `Services available in ${selectedCountryName}` : "Select a country first to unlock services."}
              </p>
            </div>
            <div className="p-5 space-y-3">
              {/* Service dropdown */}
              <div className="relative" ref={serviceDropdownRef}>
                <button
                  disabled={!selectedCountry}
                  onClick={() => selectedCountry && setServiceDropdownOpen((o) => !o)}
                  className={`w-full flex items-center justify-between border text-sm rounded-xl px-4 py-2.5 text-left transition-colors ${
                    !selectedCountry
                      ? "bg-[var(--bg-card-inner)] border-[var(--border-color)] cursor-not-allowed"
                      : "bg-[var(--bg-card-inner)] border-[var(--border-color)] hover:border-green-500 focus:outline-none focus:border-green-500"
                  }`}
                >
                  {productsLoading ? (
                    <span className="flex items-center gap-2 text-gray-500">
                      <Spinner className="w-3.5 h-3.5 text-green-500" /> Loading services…
                    </span>
                  ) : (
                    <span className={selectedService ? "text-[var(--text-primary)]" : "text-gray-500"}>
                      {selectedService
                        ? String(selectedService.name).replace(/_/g, " ")
                        : selectedCountry ? "Choose a service…" : "Choose a country first"}
                    </span>
                  )}
                  <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${serviceDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {serviceDropdownOpen && products.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-[var(--border-color)]">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search service…"
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="w-full bg-[var(--bg-card-inner)] text-[var(--text-primary)] text-sm px-3 py-2 rounded-lg border border-[var(--border-color)] focus:outline-none focus:border-green-500 placeholder-gray-500"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {products
                        .filter((p) => String(p.name).toLowerCase().includes(serviceSearch.toLowerCase()))
                        .map((p) => {
                          const inStock = p.Qty > 0;
                          return (
                            <button
                              key={p.name}
                              disabled={!inStock}
                              onClick={() => {
                                setSelectedService(p);
                                setServiceDropdownOpen(false);
                                setServiceSearch("");
                              }}
                              className={`w-full text-left px-4 py-2.5 transition-colors hover:bg-[var(--bg-card-inner)] ${
                                !inStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                              } ${selectedService?.name === p.name ? "text-green-500" : "text-[var(--text-primary)]"}`}
                            >
                              <span className="text-sm font-medium capitalize">{String(p.name).replace(/_/g, " ")}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {productsError && <p className="text-red-400 text-sm text-center py-1">{productsError}</p>}

              {/* Rent Now panel — appears after service is selected */}
              {selectedService && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 bg-[var(--bg-card-inner)] border border-green-500/25 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-[var(--text-primary)] text-sm font-medium capitalize">{String(selectedService.name).replace(/_/g, " ")}</p>
                      <p className="text-green-500 font-bold text-base mt-0.5">{fmtNgn(selectedService.price_ngn)}</p>
                    </div>
                    <button
                      onClick={rentNow}
                      disabled={buyingProduct}
                      className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                      {buyingProduct ? <><Spinner className="w-4 h-4" /> Renting…</> : "Rent Now"}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 px-1">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-400 text-[11px]">Prices shown may differ from the actual price charged.</p>
                  </div>
                </div>
              )}

              {buyError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span>{buyError}</span>
                  <button onClick={() => setBuyError(null)} className="flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: orders table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] flex items-center justify-between">
            <h2 className="text-[var(--text-primary)] font-semibold text-sm">Your Orders</h2>
            <Link href="/dashboard/rentals?tab=global" className="text-green-500 text-sm hover:underline whitespace-nowrap">
              View all →
            </Link>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12"><Spinner className="w-6 h-6 text-green-500" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-sm">No orders yet. Select a country and rent a number!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[var(--bg-card-inner)]">
                    <tr className="border-b border-[var(--border-color)]">
                      <th className="pl-3 pr-1 py-2.5 w-8" />
                      <th className="px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Number</th>
                      <th className="px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                      <th className="px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                      <th className="px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="px-2 py-2.5 w-20" />
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .slice((ordersPage - 1) * ORDERS_PAGE_SIZE, ordersPage * ORDERS_PAGE_SIZE)
                      .map((order) => (
                        <OrderRow
                          key={order.getatext_id}
                          order={order}
                          onRemove={removeOrder}
                          addToast={addToast}
                        />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {orders.length > ORDERS_PAGE_SIZE && (
                <div className="px-5 py-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <p className="text-gray-500 text-xs">
                    Showing{" "}
                    <span className="text-[var(--text-primary)]">
                      {(ordersPage - 1) * ORDERS_PAGE_SIZE + 1}–{Math.min(ordersPage * ORDERS_PAGE_SIZE, orders.length)}
                    </span>{" "}
                    of <span className="text-[var(--text-primary)]">{orders.length}</span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                      disabled={ordersPage === 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setOrdersPage((p) => Math.min(Math.ceil(orders.length / ORDERS_PAGE_SIZE), p + 1))}
                      disabled={ordersPage === Math.ceil(orders.length / ORDERS_PAGE_SIZE)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

