import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Need help with your temporary USA phone number or SMS verification? Contact the Temp Number support team. We respond within 24 hours on business days.",
  alternates: { canonical: "https://tempnumber.ng/contact" },
  openGraph: {
    title: "Contact Us - Temp Number",
    description:
      "Need help with your temporary USA virtual number or SMS verification? Reach the Temp Number team — we respond within 24 hours.",
    url: "https://tempnumber.ng/contact",
    type: "website",
  },
  twitter: {
    title: "Contact Us - Temp Number",
    description:
      "Reach the Temp Number support team. We respond within 24 hours on business days.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
