import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesAndCountries from "@/components/ServicesAndCountries";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import HomeFAQ from "@/components/HomeFAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { absolute: "Buy Temporary USA Phone Numbers & Pay in Naira - Temp Number" },
  description:
    "Get a real, non-VOIP USA virtual number for SMS verification instantly. Pay in Naira — no foreign card needed. Supports WhatsApp, Telegram, Gmail & 100+ services. From ₦450.",
  alternates: { canonical: "https://tempnumber.ng" },
  openGraph: {
    title: "Buy Temporary USA Phone Numbers & Pay in Naira - Temp Number",
    description:
      "Get a real, non-VOIP USA virtual number for SMS verification instantly. Pay in Naira — no foreign card needed. From ₦450.",
    url: "https://tempnumber.ng",
    type: "website",
  },
  twitter: {
    title: "Buy Temporary USA Phone Numbers & Pay in Naira - Temp Number",
    description:
      "Real, non-VOIP USA virtual numbers for SMS verification. Pay in Naira. No foreign card. From ₦450.",
  },
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Buy Temporary USA Phone Numbers & Pay in Naira - Temp Number",
  url: "https://tempnumber.ng",
  description:
    "Nigeria's leading temporary USA virtual phone number service. Rent a real, non-VOIP USA number for SMS verification and pay in Naira.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tempnumber.ng" },
    ],
  },
};

const homeFaqSchema = {
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
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <ServicesAndCountries />
      <WhyChoose />
      <HomeFAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}