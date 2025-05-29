import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | ZHAcademie",
  description: "Terms and conditions for using the ZHAcademie platform.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-6">Last updated: May 28, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>Welcome to ZHAcademie. These Terms of Service govern your use of our website, services, and applications.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
        <p>
          By accessing or using ZHAcademie, you agree to be bound by these Terms. If you disagree with any part of the
          terms, you may not access the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Service Description</h2>
        <p>
          ZHAcademie provides educational consulting services, application assistance, visa guidance, and document
          management for international students seeking education abroad.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Registration</h2>
        <p>
          To access certain features of our platform, you must register and provide payment information. You are
          responsible for maintaining the confidentiality of your account details.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment Terms</h2>
        <p>
          Users must provide valid payment reference during registration. Payments are verified by our administrative
          team before account approval.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Responsibilities</h2>
        <p>
          Users are responsible for the accuracy of information provided during the application process. Providing false
          information may result in account termination.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Document Upload</h2>
        <p>
          Users may upload personal documents through our platform. ZHAcademie will handle these documents with
          confidentiality but is not responsible for any breaches outside our control.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
        <p>
          The content, features, and functionality of ZHAcademie are owned by the company and are protected by
          international copyright, trademark, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
        <p>
          ZHAcademie is not responsible for the outcome of university applications, visa applications, or other
          processes facilitated through our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
        <p>
          We may terminate or suspend your account at our sole discretion, without prior notice or liability, for any
          reason.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these
          Terms periodically.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at legal@zhacademie.com.</p>
      </div>
    </div>
  )
}
