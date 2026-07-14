import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { absolute: "Temporary Disposable Emails - Temp Number" },
  description:
    "Use a Temporary Email address to protect your real inbox. Learn about Temp Mail and disposable email addresses for quick, private sign-ups.",
  keywords: ["Temporary Email", "Temp Mail", "Disposable Email Address"],
  alternates: { canonical: "https://tempnumber.ng/temporary-email" },
  openGraph: {
    title: "Temporary Email & Temp Mail | Temp Number",
    description:
      "Keep your real inbox private with a temporary email and disposable email address for short-term online sign-ups.",
    url: "https://tempnumber.ng/temporary-email",
    siteName: "Temp Number",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temporary Email & Temp Mail | Temp Number",
    description:
      "Keep your real inbox private with a temporary email and disposable email address for short-term online sign-ups.",
  },
};

const BENEFITS = [
  {
    title: "Protect your privacy",
    body: "Keep your personal address off websites you do not fully trust or only plan to use once.",
  },
  {
    title: "Keep spam away",
    body: "Separate one-off confirmations, promotions, and automated messages from your everyday inbox.",
  },
  {
    title: "Use it when you need it",
    body: "A disposable address is useful for short trials, downloads, community sign-ups, and quick confirmations.",
  },
];

const USE_CASES = [
  "Signing up for a short trial or one-time offer",
  "Downloading a guide, template, or free resource",
  "Testing a website or application",
  "Receiving a confirmation without sharing your main inbox",
];

const FAQS = [
  {
    question: "What is a Temporary Email?",
    answer:
      "A Temporary Email is an address intended for short-term use. It lets you receive email without giving a website the address you use for personal, work, or important accounts.",
  },
  {
    question: "Is Temp Mail the same as a disposable email address?",
    answer:
      "Yes. Temp Mail is a common name for a disposable email address: an inbox created for a limited purpose and limited time.",
  },
  {
    question: "When should I use a disposable email address?",
    answer:
      "Use one for low-risk, short-lived interactions such as testing a service or receiving a one-time confirmation. Do not use it for banking, account recovery, or anything you need to access long term.",
  },
  {
    question: "How long is a Temporary Email active?",
    answer:
      "10 Minute Mail describes a temporary inbox that expires shortly after it is created—often after ten minutes. It is designed for quick confirmations rather than ongoing communication.",
  },
  {
    question: "How much does a Temporary Email cost?",
    answer: "A temporary email costs ₦700 for 24 hours. The amount is deducted from your Temp Number wallet when you generate or renew an address.",
  },
  {
    question: "Can I receive and read messages in my Temporary Email?",
    answer: "Yes. Open the messages button beside an active address in your dashboard to refresh the inbox and read received emails.",
  },
  {
    question: "Can I delete a Temporary Email?",
    answer: "Yes. You can remove an address from your dashboard whenever you no longer need it. Temporary Email is intended for short-term, low-risk uses, not important accounts or password recovery.",
  },
];

export default function TemporaryEmailAddressesPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />

      <section className="border-b border-slate-200 px-4 pb-16 pt-28 dark:border-white/10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
            Private inboxes for short-term use
          </span>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl dark:text-white">
            Temporary Email for a{" "}
            <span className="text-green-500">cleaner, more private inbox</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-gray-300">
            Use a Temporary Email address when you need to sign up online without giving away your real inbox. Temp Mail helps reduce unwanted messages while keeping your personal email private.
          </p>
          <Link
            href="/dashboard/temp-mail"
            className="mt-7 inline-flex rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-400"
          >
            Get Email Now
          </Link>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Why use Temp Mail?</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-gray-300">
              Your email address is often required for everyday tasks on the internet. But sharing it with every service can lead to spam, advertising mailings, and unnecessary exposure. A Temporary Email gives you a simple address for short-term use, so your primary mailbox stays organised.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <article key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[var(--bg-card)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-sm font-bold text-green-600 dark:text-green-400">
                  0{index + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400">{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Disposable Email Address</span>
            <h2 className="mb-4 mt-2 text-2xl font-bold text-slate-900 dark:text-white">A practical layer of inbox privacy</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-gray-300">
              A disposable email address is made for temporary interactions. It can receive the email you need for a sign-up, then expire after its useful life. This keeps your real mailbox cleaner and gives you more control over where your personal address is shared.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[var(--bg-card)]">
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Useful for</h3>
            <ul className="space-y-3">
              {USE_CASES.map((useCase) => (
                <li key={useCase} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 13 4 4L19 7" />
                  </svg>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">How Temporary Email works</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ["1", "Create an address", "Generate a temporary address instead of entering your personal email."],
              ["2", "Receive what you need", "Use the inbox for the confirmation or message required by the service."],
              ["3", "Let it expire", "When you no longer need it, the disposable inbox can be discarded."],
            ].map(([step, title, body]) => (
              <div key={step} className="text-center">
                <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">{step}</span>
                <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">Temporary Email FAQ</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[var(--bg-card)]">
                <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400">{faq.question === "How long is a Temporary Email active?" ? "Each Temp Number temporary email is active for 24 hours. Renew it before it expires to keep it available in your dashboard for another 24 hours." : faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="get-email-now" className="px-4 pb-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 px-8 py-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Temporary Email
          </span>
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Create a Temporary Email</h2>
          <p className="mx-auto mb-7 max-w-xl text-sm leading-relaxed text-green-50">
            Generate a disposable email address for quick sign-ups, read messages from your dashboard, and renew it when you need more time.
          </p>
          <Link href="/dashboard/temp-mail" className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50">
            Get Email Now
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
