import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Verification Number Prices in Naira",
  description:
    "Live prices for temporary USA non-VOIP virtual numbers in Nigerian Naira. WhatsApp, Telegram, Gmail, Instagram & 100+ SMS verification services. Pay in Naira, no subscription. From ₦450.",
  alternates: { canonical: "https://tempnumber.ng/pricing" },
  openGraph: {
    title: "SMS Verification Number Prices in Naira - Temp Number",
    description:
      "Live prices for temporary USA non-VOIP virtual numbers in Nigerian Naira. 100+ SMS verification services. No subscription — from ₦450.",
    url: "https://tempnumber.ng/pricing",
    type: "website",
  },
  twitter: {
    title: "SMS Verification Number Prices in Naira - Temp Number",
    description:
      "Live prices for USA non-VOIP virtual numbers. Pay in Naira. 100+ services. From ₦450.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
