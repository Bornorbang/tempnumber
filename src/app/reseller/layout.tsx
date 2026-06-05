import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Verification Reseller Program",
  description:
    "Launch your own SMS verification business with Temp Number's reseller program. Wholesale USA non-VOIP virtual numbers at lower prices, paid in Naira. White-label platform available.",
  alternates: { canonical: "https://tempnumber.ng/reseller" },
  openGraph: {
    title: "SMS Verification Reseller Program - Temp Number",
    description:
      "Resell temporary USA non-VOIP virtual numbers at wholesale prices in Naira. White-label SMS verification platform for Nigerian resellers.",
    url: "https://tempnumber.ng/reseller",
    type: "website",
  },
  twitter: {
    title: "SMS Verification Reseller Program - Temp Number",
    description:
      "Wholesale USA non-VOIP virtual numbers in Naira. Launch your own SMS verification business.",
  },
};

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
