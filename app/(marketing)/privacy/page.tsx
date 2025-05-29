import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | ZHAcademie",
  description: "How ZHAcademie handles and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-6">Last updated: May 28, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          At ZHAcademie, we respect your privacy and are committed to protecting your personal data. This Privacy Policy
          explains how we collect, use, and safeguard your information when you use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>We collect personal information you provide when registering, including:</p>
        <ul className="list-disc pl-8 my-4">
          <li>Full name</li>
          <li>Email address</li>
          <li>Date of birth</li>
          <li>Country of residence</li>
          <li>Payment reference information</li>
          <li>Documents uploaded for application purposes</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-8 my-4">
          <li>Provide and manage our services</li>
          <li>Process applications to educational institutions</li>
          <li>Assist with visa applications</li>
          <li>Verify payment information</li>
          <li>Communicate important updates</li>
          <li>Improve our services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Storage and Security</h2>
        <p>
          We use Firebase and other secure cloud services to store your data. We implement appropriate security measures
          to protect against unauthorized access or alteration of your information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Document Handling</h2>
        <p>
          Documents uploaded to our platform are stored securely and accessed only by authorized personnel for the
          purpose of processing your applications.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Sharing</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-8 my-4">
          <li>Educational institutions as part of your application</li>
          <li>Visa processing authorities where required</li>
          <li>Service providers who assist us in delivering our services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-8 my-4">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Request restriction of processing</li>
          <li>Request transfer of your data</li>
          <li>Withdraw consent</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies</h2>
        <p>
          We use cookies to enhance your experience on our website. Please refer to our Cookie Policy for more
          information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@zhacademie.com.</p>
      </div>
    </div>
  )
}
