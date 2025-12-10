import Image from "next/image"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      <header>
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <nav className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center">
              <Image src="/booktalent-logo.svg" alt="Book Talent" width={70} height={50} className="h-[50px] w-auto" />
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        <div className="prose prose-invert prose-neutral max-w-none">
          <h1 className="text-4xl font-bold mb-2">BookTalent.ai Terms of Service</h1>
          <p className="text-neutral-400 mb-8">
            Effective Date: December 1, 2025
            <br />
            Last Updated: December 1, 2025
          </p>

          <p className="text-balance">
            These Terms of Service ("Terms") govern your access to and use of BookTalent.ai (the "Platform"), owned and
            operated by Book Talent Inc. ("Book Talent," "we," "us," or "our"). By accessing or using the Platform, you
            agree to these Terms. If you do not agree, you must not use the Platform.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">1. Definitions</h2>
          <p>
            <strong>1.1.</strong> "Platform" means the website, app, and related services provided at
            https://booktalent.ai.
          </p>
          <p>
            <strong>1.2.</strong> "User" means any individual or entity accessing or using the Platform.
          </p>
          <p>
            <strong>1.3.</strong> "Content" means any images, photos, videos, text, audio, or other materials uploaded
            or shared on the Platform.
          </p>
          <p>
            <strong>1.4.</strong> "Subscription" means a recurring paid plan (monthly or annual) granting access to
            specific Platform features or areas.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">2. User Accounts</h2>
          <p>
            <strong>2.1.</strong> To use certain features, you must create an account and provide accurate, current, and
            complete information.
          </p>
          <p>
            <strong>2.2.</strong> You are responsible for maintaining the confidentiality of your credentials and for
            all activity under your account.
          </p>
          <p>
            <strong>2.3.</strong> You agree not to share your login credentials or access with any other individual.
          </p>
          <p>
            <strong>2.4.</strong> Book Talent reserves the right to verify your identity and restrict access if we
            believe your account is being misused or misrepresented.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">3. Age Restriction & Mature Content</h2>
          <p>
            <strong>3.1. No Minors:</strong> You must be 18 years of age or older to use BookTalent.ai or access any
            portion of the Platform that contains artistic nude or mature content.
          </p>
          <p>
            <strong>3.2. Restricted Areas:</strong> Certain areas of the Platform may include artistic or professional
            nude imagery intended for mature audiences, consistent with the standards of fine art, modeling, and
            performance portfolios. These sections are not pornographic and are available only to verified members.
          </p>
          <p>
            <strong>3.3. Identity Verification:</strong> To access areas containing artistic nude content, Users may be
            required to undergo identity verification to confirm age and authenticity of professional intent. Book
            Talent reserves the right to deny or revoke access to any User who fails to meet verification standards.
          </p>
          <p>
            <strong>3.4. Compliance:</strong> You agree not to share, download, or distribute any artistic nude content
            outside the Platform. Unauthorized use or dissemination of member content is strictly prohibited and may
            result in legal action.
          </p>
          <p>
            <strong>3.5. Reporting & Moderation:</strong> Users may report any inappropriate, explicit, or non-artistic
            material. Book Talent reserves the right to remove any content it deems inconsistent with professional or
            artistic standards.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">4. Subscription Plans & Recurring Billing</h2>
          <p>
            <strong>4.1. Plans:</strong> Access to premium or professional features requires a paid recurring
            subscription (monthly or annual).
          </p>
          <p>
            <strong>4.2. Automatic Renewal:</strong> Subscriptions automatically renew at the end of each billing period
            unless canceled.
          </p>
          <p>
            <strong>4.3. Billing Authorization:</strong> By subscribing, you authorize Book Talent and its payment
            processors to charge your chosen payment method on a recurring basis until you cancel.
          </p>
          <p>
            <strong>4.4. Cancellation:</strong> You may cancel anytime in your account settings. Cancellations take
            effect at the end of the current billing cycle. No prorated refunds are issued.
          </p>
          <p>
            <strong>4.5. Price Changes:</strong> We may modify pricing with 30 days' notice. Continued use after such
            notice constitutes acceptance of new pricing.
          </p>
          <p>
            <strong>4.6. Refund Policy:</strong> Except where required by law, all fees are non-refundable.
          </p>
          <p>
            <strong>4.7. Third-Party Processing:</strong> All transactions are handled through secure, PCI-DSS-compliant
            payment processors. Book Talent does not store your credit card information.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Upload, share, or solicit sexually explicit or pornographic material (as distinct from professional
              artistic work).
            </li>
            <li>Misrepresent your identity or credentials.</li>
            <li>Attempt to scrape, copy, or distribute member content without consent.</li>
            <li>Engage in harassment, discrimination, or abuse of any kind.</li>
            <li>Violate any applicable local, national, or international law.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">6. User Content</h2>
          <p>
            <strong>6.1.</strong> You retain ownership of all content you upload but grant Book Talent a worldwide,
            non-exclusive, royalty-free license to host, display, and distribute it for the purpose of operating and
            promoting the Platform.
          </p>
          <p>
            <strong>6.2.</strong> You represent that your content:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Is your own or properly licensed,</li>
            <li>Does not infringe on third-party rights,</li>
            <li>Is appropriate for professional artistic presentation.</li>
          </ul>
          <p>
            <strong>6.3.</strong> Book Talent reserves the right to moderate, remove, or restrict access to any content
            it deems inappropriate or noncompliant with these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">7. Intellectual Property</h2>
          <p>
            All Platform content, features, and branding are owned by or licensed to Book Talent Inc. and protected by
            copyright and trademark laws. Unauthorized use or duplication is prohibited.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Book Talent Inc. shall not be liable for indirect, incidental,
            consequential, or punitive damages, including lost profits or data, arising from your use or inability to
            use the Platform.
          </p>
          <p>Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Book Talent Inc., its officers, employees, and affiliates from any
            claims or damages resulting from your content, account activity, or breach of these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">10. Termination</h2>
          <p>
            We may suspend or terminate your access at any time, without notice, for any violation of these Terms or
            misuse of the Platform.
          </p>
          <p>Upon termination, your access rights immediately cease, and no refunds will be provided.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4">11. Governing Law & Dispute Resolution</h2>
          <p>These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of laws.</p>
          <p>
            Disputes shall be resolved exclusively through binding arbitration under the rules of the American
            Arbitration Association (AAA).
          </p>
          <p>You waive any right to participate in class actions or jury trials.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4">12. International Use</h2>
          <p>
            Book Talent operates globally but does not guarantee compliance with laws in every jurisdiction. You are
            responsible for ensuring your use of the Platform complies with local laws.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">13. Changes to Terms</h2>
          <p>
            We may revise these Terms from time to time. Updates take effect upon posting. Continued use constitutes
            acceptance of the new Terms.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">14. Contact Information</h2>
          <p>
            Book Talent Inc.
            <br />
            Email:{" "}
            <a href="mailto:support@booktalent.ai" className="text-cyan-400 hover:text-cyan-300">
              support@booktalent.ai
            </a>
            <br />
            Website:{" "}
            <a href="https://booktalent.ai" className="text-cyan-400 hover:text-cyan-300">
              https://booktalent.ai
            </a>
          </p>
        </div>
      </div>

      <footer className="border-t" style={{ borderColor: "#6C6C73" }}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image src="/booktalent-logo.svg" alt="BookTalent" width={30} height={30} />
            </Link>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-4 text-gray-400 text-xs">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
              <div className="text-gray-500 text-xs">© 2025 Book Talent. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
