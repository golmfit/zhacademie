import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export default function ImaneElKhoudriPage() {
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
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp-Image-2024-08-29-at-8.37.39-AM-1-rZhvEGD9lnnZrS9Un5Zr4XYaXkPsEU.jpeg"
                    alt="Imane ElKhoudri"
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl mx-auto"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Imane ElKhoudri</h1>
                <p className="text-xl text-primary font-semibold mb-6">Academic and Career Advisor</p>

                <div className="prose prose-lg text-gray-600 mb-8">
                  <p>
                    Imane ElKhoudri is a highly accomplished Academic and Career Advisor at ZHAcademie, bringing a
                    robust academic background and extensive professional experience to her role.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Imane
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-8">About Imane</h2>

                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p>
                    Imane ElKhoudri is a highly accomplished Academic and Career Advisor at ZHAcademie, bringing a
                    robust academic background and extensive professional experience to her role. She holds a master's
                    degree in management, which has equipped her with a deep understanding of organizational dynamics,
                    strategic planning, and leadership. Her educational qualifications are complemented by years of
                    professional experience in various sectors, making her a versatile advisor for students.
                  </p>

                  <p>
                    Throughout her career, Imane has developed a keen insight into the academic and professional
                    challenges that students face. Her diverse experience allows her to offer comprehensive guidance on
                    academic pathways, helping students make informed decisions about their studies and future careers.
                    She is adept at identifying individual strengths and aligning them with suitable academic programs
                    and career opportunities, ensuring that each student can maximize their potential.
                  </p>

                  <p>
                    Imane's expertise extends beyond academic advice; she is also a skilled career counselor. She
                    assists students in developing career plans, preparing for job research, and navigating the
                    professional world. Her ability to provide practical, actionable advice helps students build
                    confidence and achieve their professional goals. Her commitment to student success is evident in her
                    personalized approach, taking the time to understand each student's unique aspirations and
                    challenges.
                  </p>

                  <p>
                    At ZHAcademie, Imane plays a pivotal role in shaping the futures of aspiring students. Her
                    dedication to helping students achieve their academic and career goals is unwavering, and her
                    extensive knowledge and experience make her an invaluable resource. Whether advising on academic
                    choices or career strategies, Imane's guidance is rooted in a deep understanding of the educational
                    landscape and a genuine desire to see students succeed.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Expertise Areas</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Academic Pathway Planning
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Career Development
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Strategic Planning
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Management Consulting
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Job Search Preparation
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 rounded-2xl p-8 mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Background</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Master's Degree in Management
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Years of Professional Experience
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Multi-Sector Expertise
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get Career Guidance</h3>
                  <p className="text-gray-600 mb-6">
                    Ready to plan your academic and career path? Schedule a consultation with Imane today.
                  </p>
                  <a href="/book-consultation" target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Button className="w-full bg-primary hover:bg-primary/90">Book Consultation</Button>
                  </a>                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
