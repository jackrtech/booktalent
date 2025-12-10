import Image from "next/image"
import Link from "next/link"

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-2">BookTalent.ai Privacy Policy</h1>
          <p className="text-neutral-400 mb-8">
            Effective Date: December 1, 2025
            <br />
            Last Updated: December 1, 2025
          </p>

          <p className="text-balance">
            This Privacy Policy ("Policy") describes how Book Talent Inc. ("Book Talent," "we," "us," or "our")
            collects, uses, stores, and protects personal information when you use our website, BookTalent.ai (the
            "Platform"). By using the Platform, you agree to this Policy. If you do not agree, please discontinue use
            immediately.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">1.1. Information You Provide</h3>
          <p>
            We collect personal information that you voluntarily share when you create an account, build a profile,
            upload media, or interact with others on the Platform. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email, and contact details</li>
            <li>Username and password</li>
            <li>Photos, videos, resumes, performance reels, and other uploaded media</li>
            <li>Biographical information, physical stats, and career details</li>
            <li>Communications and messages sent through the Platform</li>
          </ul>
          <p>
            <strong>Note:</strong> We do not store or process your credit card or payment details. All payment
            transactions are securely handled by third-party payment processors compliant with PCI-DSS standards.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">1.2. Automatically Collected Information</h3>
          <p>When you visit or use BookTalent.ai, we automatically collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address, device type, and browser information</li>
            <li>Usage logs, activity data, and referral URLs</li>
            <li>Cookie identifiers and analytics data</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">1.3. Cookies & Tracking Technologies</h3>
          <p>
            We use cookies, pixels, and similar technologies to personalize your experience, analyze trends, and improve
            Platform performance. You may adjust your cookie settings through your browser at any time.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and improve the Platform</li>
            <li>Manage user accounts and profiles</li>
            <li>Facilitate professional connections between talent, agencies, and casting directors</li>
            <li>Send notifications, updates, and security alerts</li>
            <li>Enforce our Terms of Service and prevent misuse</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We may also use aggregated, anonymized data for analytics and research purposes.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4">3. How We Share Information</h2>
          <p>We may share personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              With trusted service providers assisting in Platform operations (e.g., hosting, analytics, email services)
            </li>
            <li>With affiliated entities and business partners for legitimate business or promotional purposes</li>
            <li>
              With law enforcement or regulators where legally required or necessary to protect our rights or users'
              safety
            </li>
            <li>With your consent or at your explicit direction</li>
          </ul>
          <p>
            <strong>We do not sell personal information.</strong>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">4. International Data Protection</h2>
          <p>
            Book Talent Inc. operates globally and may process information in multiple jurisdictions. By using our
            Platform, you consent to the transfer, storage, and processing of your information outside your country,
            including in jurisdictions that may have different data protection laws.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">5. Data Security</h2>
          <p>
            We implement industry-standard administrative, technical, and physical safeguards to protect your
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p>
            However, no online platform or storage system is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">6. Your Rights & Choices</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access or request deletion of your personal data</li>
            <li>Correct or update inaccurate information</li>
            <li>Withdraw consent to processing</li>
            <li>Disable cookies in your browser</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@booktalent.ai" className="text-cyan-400 hover:text-cyan-300">
              privacy@booktalent.ai
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">7. Children's Privacy</h2>
          <p>
            BookTalent.ai is not intended for individuals under 18. We do not knowingly collect personal information
            from minors. If you believe a minor has provided information, please contact us to have it removed.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this Policy periodically. Updates will be posted with a revised "Effective Date." Continued
            use of the Platform after updates means you accept the new Policy.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">9. Contact Us</h2>
          <p>
            Book Talent Inc.
            <br />
            Email:{" "}
            <a href="mailto:privacy@booktalent.ai" className="text-cyan-400 hover:text-cyan-300">
              privacy@booktalent.ai
            </a>
            <br />
            Website:{" "}
            <a href="https://booktalent.ai" className="text-cyan-400 hover:text-cyan-300">
              https://booktalent.ai
            </a>
          </p>

          <div className="mt-16 pt-8 border-t border-gray-700">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
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
