import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | ZHAcademie",
  description: "Information about ZHAcademie's refund and cancellation policies.",
}

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund Policy</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-6">Last updated: May 28, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Registration Fee Refunds</h2>
        <p>Our refund policy for registration fees is as follows:</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Rejected Applications</h3>
        <p>
          If your registration is rejected by our administrative team during the verification process, you may be
          eligible for a partial refund. The administration fee of 15% will be deducted from the total amount paid.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Approved Applications</h3>
        <p>
          Once your registration has been approved and your account has been activated, the registration fee is
          non-refundable.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Cancellation</h2>
        <p>If you wish to cancel our services after your registration has been approved:</p>
        <ul className="list-disc pl-8 my-4">
          <li>Within 7 days of approval: 50% refund of the registration fee</li>
          <li>After 7 days of approval: No refund will be issued</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Refund Process</h2>
        <p>To request a refund:</p>
        <ol className="list-decimal pl-8 my-4">
          <li>Contact our support team at refunds@zhacademie.com</li>
          <li>Provide your full name, email address, and payment reference</li>
          <li>Explain the reason for requesting a refund</li>
        </ol>
        <p>
          Refund requests will be processed within 14 business days. The refund will be issued using the same payment
          method that was used for the original transaction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Exceptional Circumstances</h2>
        <p>
          In exceptional circumstances (such as medical emergencies or visa denials), we may consider refund requests on
          a case-by-case basis. Supporting documentation will be required.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Service Interruptions</h2>
        <p>
          If our services are unavailable for an extended period due to technical issues, we may offer partial refunds
          or service extensions at our discretion.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to This Refund Policy</h2>
        <p>
          We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon
          posting on our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
        <p>If you have any questions about our Refund Policy, please contact us at refunds@zhacademie.com.</p>
      </div>
    </div>
  )
}
