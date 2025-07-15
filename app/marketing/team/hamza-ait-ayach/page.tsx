import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export default function HamzaAitAyachPage() {
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
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp-Image-2024-08-29-at-8.38.37-AM-N4c3o6FURAFSxOOUOxPuM4GeR5ymMK.jpeg"
                    alt="Hamza Ait Ayach"
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl mx-auto"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Hamza Ait Ayach</h1>
                <p className="text-xl text-primary font-semibold mb-6">Study Abroad Advisor</p>

                <div className="prose prose-lg text-gray-600 mb-8">
                  <p>
                    Hamza Ait Ayach is a cornerstone of our agency, embodying the qualities of excellence, dedication,
                    and expertise that we strive to offer to every student.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Hamza
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
                <h2 className="text-3xl font-bold text-gray-900 mb-8">About Hamza</h2>

                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p>
                    Hamza Ait Ayach is a cornerstone of our agency, embodying the qualities of excellence, dedication,
                    and expertise that we strive to offer to every student. His academic journey is nothing short of
                    remarkable, having excelled in rigorous programs that have equipped him with a deep understanding of
                    his field. This strong foundation, combined with his professional achievements, has earned him
                    prestigious alternance offers in France, showcasing his ability to blend academic knowledge with
                    real-world application.
                  </p>

                  <p>
                    In his role at our agency, Hamza brings a unique perspective, having navigated the challenges of
                    studying and working abroad himself. His experience is a valuable asset for students who are
                    considering international education, as he not only provides them with academic advice but also
                    prepares them for the professional demands they might face in their careers. Hamza's guidance is
                    rooted in practical insights and a genuine commitment to helping students achieve their dreams.
                  </p>

                  <p>
                    Furthermore, Hamza's approach to mentoring is both strategic and personalized. He understands that
                    each student's journey is different, and he takes the time to tailor his advice to suit individual
                    needs, whether it's choosing the right university, preparing for interviews, or navigating the
                    intricacies of alternance programs. His contributions have been instrumental in shaping the success
                    stories of many students who have gone on to excel in their chosen paths, making him an invaluable
                    part of our team.
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
                      International Education Planning
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Alternance Programs in France
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Academic Excellence Strategies
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Career Development
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Interview Preparation
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 rounded-2xl p-8 mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                  <p className="text-gray-600 mb-6">
                    Ready to start your study abroad journey? Schedule a consultation with Hamza today.
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
