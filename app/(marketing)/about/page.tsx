import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ZHAcademie</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering students to achieve their international education dreams through expert guidance and support.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At ZHAcademie, our mission is to make international education accessible to students worldwide by
              simplifying the complex visa and application processes. We believe education transcends borders, and we're
              committed to helping students navigate the path to studying abroad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service, ensuring students receive the highest quality
                  guidance.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We operate with complete transparency and honesty, providing realistic expectations and ethical
                  advice.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform and services to meet the evolving needs of international
                  students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50" id="our-story">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                ZHAcademie was founded in 2015 by a team of former international students and education professionals
                who experienced firsthand the challenges of navigating visa applications and university admissions.
              </p>
              <p className="text-gray-700 mb-4">
                What began as a small consultancy has grown into a comprehensive platform serving thousands of students
                across the globe. Our founders' personal experiences with the complexities of international education
                drive our commitment to simplifying these processes for others.
              </p>
              <p className="text-gray-700">
                Today, we're proud to have helped over 10,000 students achieve their dreams of studying abroad, with a
                98% visa approval success rate and partnerships with more than 500 universities worldwide.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/diverse-team-collaboration.png"
                alt="ZHAcademie team working together"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 bg-white" id="team">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diverse team of education experts is dedicated to helping you achieve your international education
              goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Image src="/professional-woman-portrait.png" alt="Sarah Chen" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Sarah Chen</h3>
                <p className="text-primary mb-3">Founder & CEO</p>
                <p className="text-gray-600">
                  Former international student with 15+ years in education consulting. Master's from Harvard University.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Image src="/professional-man-portrait.png" alt="David Okafor" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">David Okafor</h3>
                <p className="text-primary mb-3">Head of Visa Services</p>
                <p className="text-gray-600">
                  Former visa officer with 10+ years of experience in immigration consulting. Expert in visa interview
                  preparation.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Image src="/professional-indian-woman.png" alt="Priya Sharma" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Priya Sharma</h3>
                <p className="text-primary mb-3">University Relations Director</p>
                <p className="text-gray-600">
                  Former university admissions officer with extensive network across global institutions.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Image src="/professional-asian-man.png" alt="James Kim" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">James Kim</h3>
                <p className="text-primary mb-3">Technology Director</p>
                <p className="text-gray-600">
                  Tech innovator focused on creating seamless digital experiences for international students.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Image src="/latina-professional-portrait.png" alt="Maria Rodriguez" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Maria Rodriguez</h3>
                <p className="text-primary mb-3">Student Success Manager</p>
                <p className="text-gray-600">
                  Dedicated to ensuring students receive personalized support throughout their journey.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64">
                <Image src="/middle-eastern-professional.png" alt="Ahmed Hassan" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Ahmed Hassan</h3>
                <p className="text-primary mb-3">Document Specialist</p>
                <p className="text-gray-600">
                  Expert in ensuring all documentation meets the strict requirements of visa applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Partnerships */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our University Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We work with leading universities around the world to help our students access quality education
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg flex items-center justify-center h-24">
                <Image
                  src="/generic-university-logo.png"
                  alt={`University Partner ${i}`}
                  width={100}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ready to start your journey to studying abroad? Our team is here to help you every step of the way.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Contact Us <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
