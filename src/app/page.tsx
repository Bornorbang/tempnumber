import { getImageProps } from "next/image";
import { HOME_FAQS } from "@/lib/home-faqs";
﻿import type { Metadata } from "next";
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
  title: { absolute: "Buy Temporary USA Phone Numbers in Naira - Temp Number" },
  description:
    "Get a real, non-VOIP USA virtual number for SMS verification instantly. Pay in Naira — no foreign card needed. Supports WhatsApp, Telegram, Gmail & 100+ services. From ₦900.",
  alternates: { canonical: "https://www.tempnumber.ng" },
  openGraph: {
    title: "Buy Temporary USA Phone Numbers in Naira - Temp Number",
    description:
      "Get a real, non-VOIP USA virtual number for SMS verification instantly. Pay in Naira — no foreign card needed. From ₦900.",
    url: "https://www.tempnumber.ng",
    type: "website",
  },
  twitter: {
    title: "Buy Temporary USA Phone Numbers in Naira - Temp Number",
    description:
      "Real, non-VOIP USA virtual numbers for SMS verification. Pay in Naira. No foreign card. From ₦900.",
  },
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Buy Temporary USA Phone Numbers in Naira - Temp Number",
  url: "https://www.tempnumber.ng",
  description:
    "Nigeria's leading temporary USA virtual phone number service. Rent a real, non-VOIP USA number for SMS verification and pay in Naira.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tempnumber.ng" },
    ],
  },
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Home() {
  return (
    <main>
      <link rel="preload" as="image" media="(min-width: 1024px)" imageSrcSet={getImageProps({ src: "/hero-image.png", alt: "", width: 480, height: 560, sizes: "480px" }).props.srcSet} imageSizes="480px" />
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