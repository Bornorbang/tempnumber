import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const guides = {
  whatsapp: {
    name: "WhatsApp",
    intro: "Choose a temporary USA number for a WhatsApp SMS verification attempt and pay in Nigerian Naira. Select the WhatsApp service in your dashboard so the rental matches the platform you intend to use.",
    details: "WhatsApp can require additional checks or decline a number. A temporary number does not guarantee registration, remove an account restriction, or provide permanent control of an account.",
    caution: "WhatsApp may request verification again when you reinstall the app or change devices. A short rental will not remain available for future login or recovery. Use a number you control long term for an account you need to keep.",
    question: "Can I use the same number for WhatsApp Business?",
    answer: "Check the exact service listed in the dashboard before buying. Do not assume a WhatsApp rental includes WhatsApp Business or another verification flow. Availability and acceptance can differ.",
  },
  telegram: {
    name: "Telegram",
    intro: "Check temporary USA number availability for Telegram verification and pay in Naira. Choose Telegram in the USA dashboard and review the current stock, price, and rental window before confirming.",
    details: "Telegram may deliver a login code to an existing Telegram session rather than by SMS. Temp Number can display SMS received by the rented number; it cannot retrieve codes sent inside another Telegram session.",
    caution: "An existing session, two-step verification password, or later login challenge can affect access. Temporary SMS access does not provide permanent ownership of a Telegram account or guarantee that registration succeeds.",
    question: "What if Telegram sends the code inside the app?",
    answer: "Follow Telegram's available verification options. If SMS is not offered, the rental cannot receive an in-app code. Do not purchase another number assuming it will change Telegram's verification requirements.",
  },
  google: {
    name: "Google",
    intro: "View temporary USA numbers for Google SMS verification, including flows associated with Gmail, and pay directly in Naira. Select the Google service and check current availability in the dashboard.",
    details: "Google decides whether a number is eligible for each verification attempt. It can reject a number or request another verification method. A rental does not bypass eligibility checks or guarantee a Gmail account.",
    caution: "A temporary number should not be your ongoing Google recovery number. When the rental expires, you will not control future SMS sent to that number. Keep recovery methods you own and can access.",
    question: "Does renting a number create a Gmail account?",
    answer: "No. The rental supplies temporary access to SMS for the selected service. You complete Google's own sign-up or verification flow, subject to Google's requirements and acceptance decisions.",
  },
} as const;

type Service = keyof typeof guides;
function guideFor(service: string) {
  if (!Object.prototype.hasOwnProperty.call(guides, service)) notFound();
  return guides[service as Service];
}
export function generateStaticParams() {
  return Object.keys(guides).map((service) => ({ service }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const guide = guideFor(service);
  const title = `${guide.name} SMS Verification Numbers in Nigeria`;
  const description = `Rent a temporary USA number for ${guide.name} SMS verification. Pay in Naira. From ₦900; check live service prices, availability, and rental conditions.`;
  const url = `https://www.tempnumber.ng/services/${service}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website" } };
}

export default async function ServiceGuide({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const guide = guideFor(service);
  const faqs = [
    { q: guide.question, a: guide.answer },
    { q: `How much does a ${guide.name} number cost?`, a: "USA numbers start from ₦900 across the service catalogue. The price for your selected service may be higher. Check the pricing page and confirm the current price and stock in the dashboard before renting." },
    { q: "What happens if no SMS arrives?", a: "Eligible rentals that expire without an SMS code are refunded to your Temp Number wallet after the provider confirms their final state. A wallet refund is not a bank withdrawal. Check the rental status in your dashboard." },
  ];
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
    <Navbar />
    <article className="max-w-3xl mx-auto px-5 pt-28 pb-16 space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-green-600"><Link href="/">Home</Link> / <Link href="/pricing">Pricing</Link> / {guide.name}</nav>
      <h1 className="text-3xl sm:text-4xl font-bold">{guide.name} SMS verification numbers in Nigeria</h1>
      <p>{guide.intro}</p>
      <section className="space-y-3"><h2 className="text-2xl font-semibold">Price and availability</h2><p>USA numbers start from ₦900. The {guide.name} price varies with available stock. <Link href="/pricing" className="text-green-600 underline">View current service prices</Link> before placing an order.</p></section>
      <section className="space-y-3"><h2 className="text-2xl font-semibold">How to receive your SMS</h2><ol className="list-decimal pl-6 space-y-2"><li>Create a Temp Number account and fund your wallet in Naira.</li><li>Select {guide.name} in the USA dashboard and review the price and expiry time.</li><li>Rent an available number and enter it in the platform&apos;s verification flow.</li><li>Keep your rental open in the dashboard to check incoming SMS before it expires.</li></ol></section>
      <section className="space-y-3"><h2 className="text-2xl font-semibold">Before you rent for {guide.name}</h2><p>{guide.details}</p><p>{guide.caution}</p><p>Use numbers only for activity permitted by the platform. Do not assume voice calls, repeated codes, or extended access are included; review the selected rental&apos;s terms.</p></section>
      <section className="space-y-4"><h2 className="text-2xl font-semibold">Questions about {guide.name} rentals</h2>{faqs.map(({ q, a }) => <div key={q}><h3 className="font-semibold mb-2">{q}</h3><p>{a}</p></div>)}</section>
      <Link className="inline-block rounded-xl bg-green-600 text-white px-5 py-3 font-semibold" href={`/dashboard/usa?rent=${encodeURIComponent(guide.name)}`}>Check {guide.name} availability</Link>
      <nav aria-label="Related service guides" className="flex flex-wrap gap-4 text-green-600">{Object.entries(guides).filter(([key]) => key !== service).map(([key, item]) => <Link key={key} href={`/services/${key}`}>{item.name} verification guide</Link>)}</nav>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <Footer />
  </main>;
}
