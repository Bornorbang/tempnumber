import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Temp Number's Privacy Policy. Learn how we collect, use, and protect your personal data when you use our temporary USA virtual phone number service.",
  alternates: { canonical: "https://tempnumber.ng/legal/privacy" },
  openGraph: {
    title: "Privacy Policy - Temp Number",
    description: "Read Temp Number's Privacy Policy. Learn how we collect, use, and protect your personal data.",
    url: "https://tempnumber.ng/legal/privacy",
    type: "website",
  },
  twitter: {
    title: "Privacy Policy - Temp Number",
    description: "Read Temp Number's Privacy Policy. Learn how we collect, use, and protect your personal data.",
  },
};

const LAST_UPDATED = "1 June 2025";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg-page)] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-block bg-green-500/10 text-green-500 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Legal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
              Privacy Policy
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Last updated: <span className="font-medium">{LAST_UPDATED}</span>
            </p>
          </div>

          <div className="prose-legal">
            <Section title="1. Introduction">
              <p>
                Temp Number (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
                protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
                safeguard your personal information when you use our platform and services.
              </p>
              <p>
                By using Temp Number, you consent to the data practices described in this policy. If you
                do not agree, please discontinue use of our services.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We collect the following categories of information:</p>
              <p><strong className="text-[var(--text-primary)]">a) Account Information</strong></p>
              <ul>
                <li>Full name and email address (collected at registration)</li>
                <li>Password (stored as a one-way cryptographic hash — we never store plain-text passwords)</li>
              </ul>
              <p><strong className="text-[var(--text-primary)]">b) Transaction Data</strong></p>
              <ul>
                <li>Wallet top-up amounts and payment method references</li>
                <li>Number rental history (service name, number rented, rental duration, cost)</li>
                <li>SMS codes received on rented numbers while they are assigned to your account</li>
              </ul>
              <p><strong className="text-[var(--text-primary)]">c) Usage and Technical Data</strong></p>
              <ul>
                <li>IP address, browser type, and device information</li>
                <li>Pages visited, timestamps, and session duration</li>
                <li>Error logs and performance data for service improvement</li>
              </ul>
              <p><strong className="text-[var(--text-primary)]">d) Communications</strong></p>
              <ul>
                <li>Messages you send to our support team</li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Create and manage your account</li>
                <li>Process wallet top-ups and number rental transactions</li>
                <li>Display your transaction history and wallet balance</li>
                <li>Communicate with you about your account, service updates, or support requests</li>
                <li>Detect and prevent fraud, abuse, or unauthorized access</li>
                <li>Comply with legal obligations under Nigerian law</li>
                <li>Improve the performance, reliability, and features of our platform</li>
              </ul>
              <p>
                We do not use your personal data for advertising or sell it to third-party marketers.
              </p>
            </Section>

            <Section title="4. Data Sharing and Third Parties">
              <p>
                We do not sell or rent your personal information. We may share your data with the following
                parties only as necessary to provide our services:
              </p>
              <ul>
                <li>
                  <strong className="text-[var(--text-primary)]">Telephony Providers:</strong> We use
                  third-party SMS number provisioning APIs (such as Getatext) to supply virtual numbers.
                  These providers receive only the minimum data required to fulfill your rental (e.g.,
                  selected service and country). We do not share your name or email with them.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Payment Processors:</strong> When you
                  top up via a payment gateway, your payment details are processed directly by that
                  provider (e.g., Paystack or Flutterwave) under their own privacy policies. We only
                  receive a transaction reference and the credited amount.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Legal Compliance:</strong> We may
                  disclose information if required by law, court order, or governmental authority in
                  Nigeria.
                </li>
              </ul>
            </Section>

            <Section title="5. Data Retention">
              <p>
                We retain your account information for as long as your account is active. Transaction
                records are retained for at least 5 years to comply with Nigerian financial regulations.
                You may request account deletion by contacting us; however, some records may be retained
                as required by law.
              </p>
            </Section>

            <Section title="6. Security">
              <p>
                We implement industry-standard security measures including:
              </p>
              <ul>
                <li>HTTPS encryption for all data in transit</li>
                <li>bcrypt password hashing with a work factor of 12</li>
                <li>JWT-based authentication with short-lived tokens</li>
                <li>Database access restricted to the application server only</li>
                <li>Regular security reviews of our backend infrastructure</li>
              </ul>
              <p>
                Despite these measures, no system is 100% secure. If you believe your account has been
                compromised, contact us immediately at{" "}
                <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline">
                  support@tempnumber.ng
                </a>
                .
              </p>
            </Section>

            <Section title="7. Cookies and Local Storage">
              <p>
                Temp Number uses browser <strong className="text-[var(--text-primary)]">localStorage</strong>{" "}
                to store your authentication token on your device. This is necessary for you to stay
                logged in across browser sessions. We do not use third-party tracking cookies.
              </p>
              <p>
                You can clear this data at any time through your browser&apos;s developer tools or
                storage settings, which will log you out.
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>Under Nigerian data protection law (NDPR), you have the right to:</p>
              <ul>
                <li>
                  <strong className="text-[var(--text-primary)]">Access:</strong> Request a copy of the
                  personal data we hold about you.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Correction:</strong> Request correction
                  of inaccurate or incomplete data.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Deletion:</strong> Request deletion of
                  your account and associated personal data, subject to legal retention requirements.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Objection:</strong> Object to the
                  processing of your data in certain circumstances.
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline">
                  support@tempnumber.ng
                </a>
                . We will respond within 30 days.
              </p>
            </Section>

            <Section title="9. Children's Privacy">
              <p>
                Temp Number is not intended for users under the age of 18. We do not knowingly collect
                personal information from minors. If we become aware that a minor has registered, we will
                promptly delete their account and associated data.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. The &ldquo;Last Updated&rdquo; date
                at the top of this page reflects the most recent revision. Continued use of our services
                after changes constitutes your acceptance of the updated policy. For significant changes,
                we will notify registered users via email.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                For privacy-related inquiries or to exercise your data rights, please contact us:
              </p>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 mt-4 not-prose">
                <p className="text-[var(--text-primary)] font-semibold text-sm mb-1">Temp Number — Privacy Team</p>
                <p className="text-[var(--text-secondary)] text-sm">
                  Email:{" "}
                  <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline">
                    support@tempnumber.ng
                  </a>
                </p>
                <p className="text-[var(--text-secondary)] text-sm">Website: tempnumber.ng</p>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .prose-legal > div + div { margin-top: 2rem; }
        .prose-legal h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .prose-legal p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.75;
          margin-bottom: 0.75rem;
        }
        .prose-legal ul {
          margin: 0.5rem 0 0.75rem 1.25rem;
          list-style: disc;
        }
        .prose-legal li {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.7;
          margin-bottom: 0.35rem;
        }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
