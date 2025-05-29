import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Globe, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ZHAcademie</h1>
            <p className="text-xl mb-8">
              Empowering students worldwide to achieve their international education dreams through expert guidance,
              personalized support, and proven success strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To democratize access to international education by providing comprehensive, personalized guidance
                  that transforms students' academic aspirations into reality. We believe every student deserves the
                  opportunity to pursue their dreams, regardless of their background or circumstances.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become the world's most trusted partner in international education, creating a global community of
                  successful students who contribute positively to society. We envision a world where geographical
                  boundaries don't limit educational opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact in Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "5,000+", label: "Students Helped", icon: Users },
              { number: "98%", label: "Visa Success Rate", icon: Award },
              { number: "500+", label: "Partner Universities", icon: Globe },
              { number: "15+", label: "Years Experience", icon: Target },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                Founded in 2008, ZHAcademie began as a small consultancy with a big dream: to help students from
                developing countries access world-class education opportunities abroad. Our founder, Dr. Sarah Johnson,
                experienced firsthand the challenges of navigating international education systems as an international
                student herself.
              </p>
              <p className="mb-6">
                What started as helping a few students from her local community has grown into a comprehensive platform
                serving thousands of students worldwide. Our success is built on three pillars: expertise,
                personalization, and genuine care for each student's journey.
              </p>
              <p className="mb-6">
                Today, we're proud to have helped over 5,000 students achieve their dreams of studying at prestigious
                universities across the globe. Our team of experienced counselors, former visa officers, and education
                experts work tirelessly to ensure every student receives the support they need to succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Integrity",
                description:
                  "We provide honest, transparent guidance and never make promises we can't keep. Your trust is our most valuable asset.",
              },
              {
                title: "Excellence",
                description:
                  "We strive for the highest standards in everything we do, from application quality to customer service.",
              },
              {
                title: "Empowerment",
                description:
                  "We don't just help you apply; we educate and empower you to make informed decisions about your future.",
              },
              {
                title: "Diversity",
                description:
                  "We celebrate diversity and believe that different perspectives make our global community stronger.",
              },
              {
                title: "Innovation",
                description:
                  "We continuously evolve our services and embrace technology to provide better experiences for our students.",
              },
              {
                title: "Support",
                description:
                  "We're with you every step of the way, from initial consultation to settling into your new academic environment.",
              },
            ].map((value, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Leadership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Founder & CEO",
                image: "/ceo-headshot-education.png",
                bio: "15+ years in international education. PhD in Educational Leadership from Oxford University.",
              },
              {
                name: "Michael Chen",
                role: "Head of Visa Services",
                image: "/visa-specialist-headshot.png",
                bio: "Former visa officer with 12 years of experience in immigration policies and procedures.",
              },
              {
                name: "Dr. Priya Patel",
                role: "Academic Director",
                image: "/academic-director-headshot.png",
                bio: "Former university admissions officer with expertise in global higher education systems.",
              },
            ].map((member, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the thousands of students who have trusted ZHAcademie to guide them toward their international
            education goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/marketing/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
