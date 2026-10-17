import { FAQS } from "@/lib/faqs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Got questions about temporary USA virtual phone numbers? Find answers about pricing in Naira, SMS verification, non-VOIP numbers, refunds, and how Temp Number works.",
  alternates: { canonical: "https://www.tempnumber.ng/faq" },
  openGraph: {
    title: "Frequently Asked Questions - Temp Number",
    description:
      "Everything you need to know about renting temporary USA non-VOIP virtual numbers for SMS verification and paying in Naira.",
    url: "https://www.tempnumber.ng/faq",
    type: "website",
  },
  twitter: {
    title: "Frequently Asked Questions - Temp Number",
    description:
      "Everything you need to know about temporary USA virtual numbers for SMS verification. Pay in Naira.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question", name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
