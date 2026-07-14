import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Temp Number, Nigeria's trusted temporary USA virtual phone number and SMS verification service. Know your rights and responsibilities.",
  alternates: { canonical: "https://tempnumber.ng/legal/terms" },
  openGraph: {
    title: "Terms of Service - Temp Number",
    description: "Read the Terms of Service for Temp Number, Nigeria's trusted temporary USA virtual phone number service.",
    url: "https://tempnumber.ng/legal/terms",
    type: "website",
  },
  twitter: {
    title: "Terms of Service - Temp Number",
    description: "Read the Terms of Service for Temp Number, Nigeria's trusted temporary USA virtual phone number service.",
  },
};

const LAST_UPDATED = "14 July 2026";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Last updated: <span className="font-medium">{LAST_UPDATED}</span>
            </p>
          </div>

          <div className="prose-legal">
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using the Temp Number platform (available at our website and any associated
                mobile or web application), you agree to be bound by these Terms of Service
                (&ldquo;Terms&rdquo;). If you do not agree with any part of these Terms, you must not use our
                services.
              </p>
              <p>
                Temp Number (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a digital service
                that provides temporary, virtual phone numbers for SMS verification purposes, priced in
                Nigerian Naira (NGN). These Terms constitute a legally binding agreement between you and
                Temp Number.
              </p>
            </Section>

            <Section title="2. Eligibility">
              <p>
                You must be at least 18 years old or the age of majority in your jurisdiction to create an
                account and use our services. By using Temp Number, you represent and warrant that you meet
                this requirement and that all information you provide is accurate and truthful.
              </p>
            </Section>

            <Section title="3. Description of Service">
              <p>
                Temp Number provides access to virtual phone numbers that can receive SMS messages,
                typically for one-time password (OTP) or account verification purposes. We offer three
                product tiers:
              </p>
              <ul>
                <li>
                  <strong>Standard Rentals</strong> — temporary numbers rented for a short session
                  (typically 5–30 minutes). Numbers may be shared across customers and are not exclusively
                  assigned.
                </li>
                <li>
                  <strong>Long-Term Rentals</strong> — a number tied to a specific service (e.g.
                  WhatsApp, Telegram) for 1–30 days.
                </li>
                <li>
                  <strong>Dedicated Numbers</strong> — a personal USA phone number assigned exclusively
                  to you for 1 week, 2 weeks, or 1 month. Works with all services simultaneously.
                </li>
              </ul>
              <ul>
                <li>We do not guarantee that a specific service or country will always be available.</li>
                <li>SMS delivery depends on the originating platform and is not guaranteed.</li>
                <li>Numbers are provisioned through third-party telephony APIs and subject to their availability.</li>
              </ul>
            </Section>

            <Section title="3b. Long-Term Rentals">
              <p>
                Long-Term Rentals assign a virtual phone number to a specific service (e.g. WhatsApp,
                Telegram) for an extended period (1 day to 30 days). By renting a long-term number, you
                agree to the following additional terms:
              </p>
              <ul>
                <li>
                  <strong>No cancellations or refunds.</strong> Long-term rentals are non-cancellable and
                  non-refundable once confirmed. The full rental cost is deducted from your wallet at the
                  time of rental.
                </li>
                <li>
                  <strong>Auto-renew.</strong> If you enable auto-renew, your wallet will be charged the
                  same rental price automatically before the number expires. If your wallet balance is
                  insufficient at renewal time, auto-renew will be disabled and the number will expire.
                  You can turn auto-renew on or off at any time from your dashboard.
                </li>
                <li>
                  <strong>Manual renewal.</strong> You may also manually renew an active rental at any
                  time from your dashboard. The renewal cost will be deducted from your wallet.
                </li>
                <li>
                  <strong>Availability.</strong> Long-term number availability depends on pool stock.
                  We do not guarantee availability for any specific service or period.
                </li>
                <li>SMS delivery to your long-term number is not guaranteed and depends on the originating platform.</li>
              </ul>
            </Section>

            <Section title="3c. Dedicated Numbers">
              <p>
                Dedicated Numbers give you a personal USA phone number assigned exclusively to you for a
                fixed rental period (1 week, 2 weeks, or 1 month). Unlike long-term rentals, a dedicated
                number is not tied to a single service — it can receive SMS and calls from any platform
                simultaneously. By renting a dedicated number, you agree to the following additional terms:
              </p>
              <ul>
                <li>
                  <strong>Exclusive assignment.</strong> Your dedicated number is reserved solely for you
                  for the duration of the rental and will not be shared with other users.
                </li>
                <li>
                  <strong>Non-cancellable.</strong> Dedicated number rentals cannot be cancelled and no
                  refund is issued once the number has been activated, except where the number cannot be
                  provisioned due to a technical failure on our part.
                </li>
                <li>
                  <strong>Auto-renew.</strong> If you enable auto-renew, your wallet will be charged the
                  same amount before the number’s expiry. If your balance is insufficient, auto-renew will
                  be disabled and the number permanently released. You can toggle auto-renew at any time
                  from your dashboard.
                </li>
                <li>
                  <strong>Permanent release on expiry.</strong> Once a dedicated number expires and is not
                  renewed, it is permanently released and cannot be recovered.
                </li>
                <li>
                  <strong>Availability.</strong> Dedicated numbers are subject to stock. We do not guarantee
                  availability at any given time.
                </li>
                <li>SMS delivery is not guaranteed and depends on the originating platform.</li>
              </ul>
            </Section>

            <Section title="3d. Temporary Email">
              <p>
                Temp Mail provides disposable email addresses for short-term use. Each generated email
                address is made available in your dashboard for 24 hours, unless it is renewed in
                accordance with the options shown in your dashboard.
              </p>
              <ul>
                <li>
                  <strong>Wallet charge.</strong> The displayed charge is deducted from your wallet when
                  an email address is successfully generated.
                </li>
                <li>
                  <strong>No refunds.</strong> Temporary Email charges are final. Once an email address
                  has been generated, it cannot be cancelled, returned, or refunded, including where it
                  is unused or removed from your dashboard.
                </li>
                <li>
                  <strong>Availability.</strong> Temporary Email delivery and availability depend on our
                  provider and the sending service. We do not guarantee that every third-party service
                  will accept a disposable email address or that every message will be delivered.
                </li>
              </ul>
            </Section>

            <Section title="4. Account Registration">
              <p>
                To access paid features, you must register for an account using a valid email address and
                a secure password. You are responsible for maintaining the confidentiality of your login
                credentials. You agree to notify us immediately at{" "}
                <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline">
                  support@tempnumber.ng
                </a>{" "}
                if you suspect any unauthorized use of your account.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms, engage in
                fraudulent activity, or are inactive for an extended period.
              </p>
            </Section>

            <Section title="5. Wallet and Payments">
              <p>
                Temp Number uses a prepaid wallet system. You must fund your wallet before renting any
                number. All transactions are processed in Nigerian Naira (NGN).
              </p>
              <ul>
                <li>
                  Wallet top-ups are final and non-refundable once credited to your account, except where
                  required by applicable law.
                </li>
                <li>
                  Charges for a rental are deducted from your wallet at the time of rental. If your balance
                  is insufficient, the rental will not proceed.
                </li>
                <li>
                  We are not responsible for failed SMS deliveries once a number has been successfully
                  rented and the charge deducted.
                </li>
                <li>
                  Prices displayed are in NGN and are subject to change. Current prices are always shown
                  before you confirm a rental.
                </li>
                <li>
                  <strong>Admin adjustments.</strong> Temp Number administrators may credit or debit your
                  wallet balance at their discretion, for example to resolve disputes, apply promotional
                  credits, or correct billing errors. All such adjustments are logged and visible in your
                  account history.
                </li>
              </ul>
            </Section>

            <Section title="6. Refund Policy">
              <p>
                Given the digital and time-sensitive nature of our service, all completed transactions are
                generally non-refundable. However, we will consider refunds in the following circumstances:
              </p>
              <ul>
                <li>
                  A standard number was successfully rented but no SMS was received within the rental
                  window due to a confirmed technical issue on our part.
                </li>
                <li>A duplicate charge occurred on your account due to a technical error.</li>
                <li>
                  A dedicated number was charged but could not be provisioned due to a technical failure
                  on our side (e.g. the number was not assigned by our provider).
                </li>
              </ul>
              <p>
                Long-term rentals and dedicated number rentals are <strong>non-refundable</strong> once
                successfully activated, including in cases where the number expires unused or auto-renew
                is disabled due to insufficient balance.
              </p>
              <p>
                All refund requests must be submitted within 24 hours of the transaction and include your
                transaction reference. Contact us at{" "}
                <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline">
                  support@tempnumber.ng
                </a>
                .
              </p>
            </Section>

            <Section title="7. Prohibited Uses">
              <p>You agree not to use Temp Number for:</p>
              <ul>
                <li>Any illegal activities under Nigerian law or the laws of your jurisdiction.</li>
                <li>
                  Fraudulent account creation, identity theft, or impersonation on any platform.
                </li>
                <li>
                  Circumventing security or fraud detection systems of third-party services in an
                  unauthorized manner.
                </li>
                <li>Spamming, phishing, or any abusive communications.</li>
                <li>Reselling access to our platform without an authorized reseller agreement.</li>
                <li>
                  Automated or bulk rentals intended to manipulate or abuse third-party platforms at scale.
                </li>
              </ul>
              <p>
                Violation of these restrictions will result in immediate account termination and may be
                reported to relevant authorities.
              </p>
            </Section>

            <Section title="8. Intellectual Property">
              <p>
                All content, trademarks, logos, and software on the Temp Number platform are owned by or
                licensed to Temp Number. You may not copy, reproduce, modify, distribute, or reverse-engineer
                any part of the platform without our prior written consent.
              </p>
            </Section>

            <Section title="9. Privacy">
              <p>
                Your use of Temp Number is also governed by our{" "}
                <a href="/legal/privacy" className="text-green-500 hover:underline">
                  Privacy Policy
                </a>
                , which is incorporated into these Terms by reference. By using our services, you consent
                to the collection and use of your information as described therein.
              </p>
            </Section>

            <Section title="10. Disclaimer of Warranties">
              <p>
                Temp Number is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
                We make no warranties, express or implied, including but not limited to warranties of
                merchantability, fitness for a particular purpose, or non-infringement. We do not warrant
                that the service will be uninterrupted, error-free, or that SMS messages will always be
                delivered.
              </p>
            </Section>

            <Section title="11. Third-Party Platform Liability">
              <p>
                Temp Number provides phone numbers for SMS verification purposes only. We are <strong>not responsible</strong> for:
              </p>
              <ul>
                <li>
                  Any bans, suspensions, restrictions, or account terminations you may experience on third-party platforms
                  (such as WhatsApp, Google, Facebook, Telegram, or any other service) as a result of using our numbers.
                </li>
                <li>
                  Third-party platforms&apos; acceptance or rejection of our numbers, as each platform maintains its own
                  verification policies which may change without notice.
                </li>
                <li>
                  Any issues, disputes, or damages arising from your use of third-party services, including but not
                  limited to data loss, privacy violations, or service interruptions.
                </li>
              </ul>
              <p>
                <strong>Important:</strong> Temporary numbers are designed for <strong>one-time verification only</strong>.
                They are <strong>not suitable</strong> for permanent account ownership or long-term use. If you require ongoing
                access to a service or need stable account ownership, we strongly recommend using our <strong>Long-Term USA Numbers</strong>
                (available for 1-30 days with auto-renew options). Using temporary numbers for purposes requiring permanent phone
                access may result in account issues on third-party platforms, for which we bear no responsibility.
              </p>
              <p>
                By using our service, you acknowledge that you are solely responsible for how you use the numbers we provide
                and any consequences that may arise from such use.
              </p>
            </Section>

            <Section title="12. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, Temp Number shall not be liable for any indirect,
                incidental, special, or consequential damages arising from your use of (or inability to
                use) our services, including but not limited to lost profits, data loss, or business
                interruption. Our total liability for any claim shall not exceed the amount you paid to us
                in the 30 days preceding the event giving rise to the claim.
              </p>
            </Section>

            <Section title="13. Modifications to Terms">
              <p>
                We reserve the right to update these Terms at any time. Changes will be posted on this
                page with an updated &ldquo;Last Updated&rdquo; date. Continued use of our services after
                changes take effect constitutes your acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="14. Governing Law">
              <p>
                These Terms are governed by and construed in accordance with the laws of the Federal
                Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the
                courts located in Nigeria.
              </p>
            </Section>

            <Section title="15. Contact Us">
              <p>
                For questions about these Terms, please contact us at:
              </p>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 mt-4 not-prose">
                <p className="text-[var(--text-primary)] font-semibold text-sm mb-1">Temp Number Support</p>
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
