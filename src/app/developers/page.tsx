import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UsaApiDocumentation from "@/components/UsaApiDocumentation";
import WholesalePrices from "@/components/WholesalePrices";

export const metadata: Metadata = {
  title: "USA SMS Reseller API Documentation",
  description: "Integrate USA SMS verification into your platform with Temp Number's reseller API. API keys, Naira wallet billing, code examples and OpenAPI documentation.",
  alternates: { canonical: "https://tempnumber.ng/developers" },
};

export default function DevelopersPage() {
  return <main className="min-h-screen bg-[var(--bg-page)]"><Navbar /><div className="mx-auto max-w-4xl px-4 pb-16 pt-28"><h1 className="mb-3 text-3xl font-bold text-[var(--text-primary)]">USA Reseller API</h1><p className="mb-8 text-[var(--text-secondary)]">API reference and integration guide · v1</p><div className="space-y-6"><WholesalePrices /><UsaApiDocumentation /></div></div><Footer /></main>;
}
