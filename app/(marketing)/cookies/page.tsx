import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | ZHAcademie",
  description: "Information about how ZHAcademie uses cookies on our platform.",
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-6">Last updated: May 28, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They
          are widely used to make websites work more efficiently and provide information to the website owners.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
        <p>ZHAcademie uses cookies for the following purposes:</p>
        <ul className="list-disc pl-8 my-4">
          <li>
            Authentication: We use cookies to identify you when you visit our website and as you navigate through the
            site.
          </li>
          <li>Status: We use cookies to determine if you are logged in to our website.</li>
          <li>
            Personalization: We use cookies to store information about your preferences and customize the website for
            you.
          </li>
          <li>
            Security: We use cookies as an element of the security measures to protect user accounts and our services.
          </li>
          <li>Analysis: We use cookies to analyze the use and performance of our website and services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function and cannot be switched off in our systems. They are
          usually only set in response to actions made by you which amount to a request for services, such as setting
          your privacy preferences, logging in, or filling in forms.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Performance Cookies</h3>
        <p>
          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of
          our site. They help us to know which pages are the most and least popular and see how visitors move around the
          site.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Functional Cookies</h3>
        <p>
          These cookies enable the website to provide enhanced functionality and personalization. They may be set by us
          or by third-party providers whose services we have added to our pages.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the
          service and deliver advertisements on and through the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Managing Cookies</h2>
        <p>
          Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from
          browser to browser. Please refer to your browser's help documentation for information on how to manage
          cookies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to This Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie
          Policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
        <p>If you have any questions about our Cookie Policy, please contact us at privacy@zhacademie.com.</p>
      </div>
    </div>
  )
}
