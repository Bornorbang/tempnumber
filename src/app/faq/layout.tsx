import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Got questions about temporary USA virtual phone numbers? Find answers about pricing in Naira, SMS verification, non-VOIP numbers, refunds, and how Temp Number works.",
  alternates: { canonical: "https://tempnumber.ng/faq" },
  openGraph: {
    title: "Frequently Asked Questions - Temp Number",
    description:
      "Everything you need to know about renting temporary USA non-VOIP virtual numbers for SMS verification and paying in Naira.",
    url: "https://tempnumber.ng/faq",
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
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Temp Number?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Temp Number lets you rent real, non-VOIP USA phone numbers for a few minutes. You receive an SMS verification code on it, then the number expires — keeping your personal number private.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get a USA virtual number?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Create an account, top up your wallet in Naira, then choose a service. You'll instantly receive a USA number and any SMS sent to it will appear in your dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a temporary USA phone number cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prices vary by service. Most numbers start from ₦450. Check our Pricing page for live prices. There are no subscription fees — you only pay per number you rent.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the same number multiple times?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Each number is one-time use. Once you've received your SMS or the rental period expires, the number is released. This ensures privacy and that numbers are always fresh.",
      },
    },
    {
      "@type": "Question",
      name: "What if I don't receive an SMS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If no SMS arrives within the rental period, your wallet is refunded immediately and automatically. No need to contact support.",
      },
    },
    {
      "@type": "Question",
      name: "Which payment methods are accepted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept card payments and bank transfers in Nigerian Naira (₦). No dollar card needed.",
      },
    },
    {
      "@type": "Question",
      name: "Is my personal data safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We don't require a phone number to sign up — just an email. Your wallet and rental history are private to your account. We never sell your data.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer reseller pricing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. If you resell SMS verification services, visit our Resellers page to see our wholesale pricing, which is lower than retail.",
      },
    },
    {
      "@type": "Question",
      name: "Are the numbers non-VOIP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All numbers on Temp Number are real, non-VOIP USA numbers, which means they are accepted by platforms that reject VOIP numbers.",
      },
    },
  ],
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
