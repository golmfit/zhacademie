import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ZHAcademie</h3>
            <p className="text-gray-300">Helping international students achieve their educational dreams abroad.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-white transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>123 Education Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">Email: info@zhacademie.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ZHAcademie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
