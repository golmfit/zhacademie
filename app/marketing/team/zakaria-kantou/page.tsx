import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, Linkedin, Youtube, Instagram } from "lucide-react"

export default function ZakariaKantouPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/marketing/about"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to About
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Profile Image */}
              <div className="text-center md:text-left">
                <div className="relative inline-block">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/me1.jpg-nEKV4a9I9TTBR2lObpmwRu65HSXIUU.jpeg"
                    alt="Zakaria Kantou"
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl mx-auto"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Zakaria Kantou</h1>
                <p className="text-xl text-primary font-semibold mb-6">Founder & CEO</p>

                <div className="prose prose-lg text-gray-600 mb-8">
                  <p>
                    Zakaria Kantou is the visionary Founder and CEO of ZHAcademie, bringing a unique blend of analytical
                    skills and financial acumen to his role.
                  </p>
                </div>

                {/* Social Media Links */}
                <div className="flex gap-4 mb-8">
                  <a
                    href="https://www.linkedin.com/in/zakaria-kantou/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCzNFOFnZzAvzvLK5eNd01Tw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/kantou_zakaria/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="mailto:info@zhacademie.com" target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Zakaria
                    </Button>
                  </a>
                  <a href="tel:+13392288533" target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Bio Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">About Zakaria</h2>

                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p>
                    Zakaria Kantou is the visionary Founder and CEO of ZHAcademie. With a Bachelor's degree in Finance
                    and currently pursuing a Bachelor's degree in Data Science, Zakaria brings a unique blend of
                    analytical skills and financial acumen to his role. His academic journey reflects his dedication to
                    continuous learning and personal growth, ensuring that he stays at the forefront of educational and
                    technological advancements.
                  </p>

                  <p>
                    In addition to his academic pursuits, Zakaria has extensive experience as a content manager. This
                    role has honed his skills in digital communication and marketing, enabling him to effectively reach
                    and engage with students and their families. His expertise in content creation and management is
                    instrumental in crafting clear, informative, and engaging materials that guide students through the
                    complexities of studying abroad.
                  </p>

                  <p>
                    Zakaria's personal experiences have deeply influenced his professional mission. Having faced
                    numerous challenges and a lack of information while pursuing his own studies abroad, he understands
                    the struggles and uncertainties that students encounter. This inspired him to create ZHAcademie, a
                    platform dedicated to providing comprehensive support and resources to students aiming to study in
                    the United States.
                  </p>

                  <p>
                    Under Zakaria's leadership, ZHAcademie is committed to helping students avoid the mistakes and
                    hurdles he faced. His goal is to ensure that every student has access to the best possible guidance
                    and support, making their journey to international education as smooth and successful as possible.
                    His passion for education and his dedication to student success are the driving forces behind
                    ZHAcademie's continued growth and impact.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Education & Expertise</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Bachelor's in Finance
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Bachelor's in Data Science (Pursuing)
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Content Management
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Digital Marketing
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Educational Leadership
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 rounded-2xl p-8 mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Connect with Zakaria</h3>
                  <p className="text-gray-600 mb-6">
                    Follow Zakaria's journey and get insights on studying abroad through his social media channels.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://www.linkedin.com/in/zakaria-kantou/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </a>
                    <a
                      href="https://www.youtube.com/channel/UCzNFOFnZzAvzvLK5eNd01Tw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube Channel
                    </a>
                    <a
                      href="https://www.instagram.com/kantou_zakaria/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
