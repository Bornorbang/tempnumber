import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAuthProvider from "@/components/GoogleAuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tempnumber.ng"),
  title: {
    default: "Buy Temporary USA Phone Numbers & Pay in Naira - Temp Number",
    template: "%s - Temp Number",
  },
  description:
    "Get a real, non-VOIP USA phone number for SMS verification in seconds. Pay in Naira — no foreign card needed. Instant OTP numbers for WhatsApp, Telegram, Gmail & 100+ services. From ₦450.",
  keywords: [
    "temporary phone number Nigeria",
    "virtual phone number Nigeria",
    "non-VOIP number Nigeria",
    "buy USA number Naira",
    "SMS verification Nigeria",
    "temp number Nigeria",
    "OTP number Nigeria",
    "disposable phone number Nigeria",
    "virtual number Nigeria",
    "USA phone number Nigeria",
    "temporary number for verification",
    "SMS number pay Naira",
  ],
  authors: [{ name: "Temp Number", url: "https://tempnumber.ng" }],
  creator: "Temp Number",
  publisher: "Temp Number",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Temp Number",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Temp Number - Buy Temporary USA Phone Numbers & Pay in Naira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Tempnumber_ng",
    creator: "@Tempnumber_ng",
    images: ["/og-image.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Temp Number",
  url: "https://tempnumber.ng",
  logo: "https://tempnumber.ng/updated-logo.png",
  description:
    "Nigeria's leading temporary USA phone number service. Rent real, non-VOIP USA virtual numbers for SMS verification and pay in Naira.",
  email: "support@tempnumber.ng",
  foundingDate: "2024",
  sameAs: [
    "https://x.com/Tempnumber_ng",
    "https://tiktok.com/@tempnumber.ng",
    "https://whatsapp.com/channel/0029Vb7uTgC30LKUfBRj3p2L",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@tempnumber.ng",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Temp Number",
  url: "https://tempnumber.ng",
  description:
    "Rent temporary USA virtual phone numbers and pay in Naira. Instant SMS verification for any platform. Non-VOIP numbers from ₦450.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://tempnumber.ng/pricing?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ThemeProvider>
          <GoogleAuthProvider>
            <AuthProvider>{children}</AuthProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
