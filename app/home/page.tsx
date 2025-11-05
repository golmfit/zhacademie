"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Globe, FileText, Users, Award, MapPin, Star, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function MarketingPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const steps = [
    {
      id: 1,
      image:
        "/get_expert.jpeg",
      title: "Expert Consultation",
      description: "Receive personalized guidance from our experienced counselors to help you make informed decisions in your university selection journey. We provide insights, resources, and expert advice to ensure you choose the best academic path aligned with your goals",
    },
    {
      id: 2,
      image:
        "/collegeapp.jpeg",
      title: "College application",
      description: "We simplify the college application journey by matching you with universities that best fit your goals and profile. Our smart approach ensures you apply with confidence to the right institutions.",
    },
    {
      id: 3,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250529_0022_Visa%20Application_simple_compose_01jwd4bcztfaes6gdy91x4zcg3-rYraqNLr56E3dw2dw48upTce4Fqacv.png",
      title: "Visa Process",
      description: "Navigating the visa process can be complex, but we make it simple. Our experts provide step-by-step guidance, from document preparation to interview readiness, ensuring you meet all requirements with confidence.",
    },
    {
      id: 4,
      image:
        "/interviewmockup.jpeg",
      title: "Interview Mockups",
      description: "We provide step-by-step guidance to help you prepare for your visa interview. From document review to mock interview sessions, our support ensures you meet all requirements and approach the process with confidence.",
    },
    {
      id: 5,
      image:
        "/arrival.jpeg",
      title: "Arrival & Settlement",
      description: "From the moment you land, we provide continuous support to help you adapt smoothly. Our services include airport pickup guidance, accommodation assistance, and orientation programs to ensure a comfortable transition into your new environment.",
    },
  ]

  const testimonials = [
    {
      name: "Taoufik",
      quote: "I am incredibly grateful to Zs Academie for helping me achieve my dream of studying in the USA. Their guidance and support throughout the student visa process were invaluable. From handling the paperwork to offering advice on my academic journey, they made the entire experience smooth and stress-free. I highly recommend Zs academie to anyone looking to study abroad",
      initials: "TZ",
      university: "University",
      country: "Morocco → USA",
    },
    {
      name: "Ibrahim",
      quote: "Wakhoya allahuma barik Ikhdma 100% professional tbaraka allah elik 17 aja li kansawal eliha kaniga ljwab dyalha o support tahuwa yeani kulshi mwafar tahaja man9sa allah ikamal",
      initials: "IB",
      university: "MIT",
      country: "Morocco → USA",
    },
    {
      name: "Zakaria",
      quote: "Brother Zak i really appreciate the quality of the service everything was perfect, never thought l'd get the visa but with ur trust and support it was easy, best experience ever thanks a lot.",
      initials: "ZA",
      university: "University of Toronto",
      country: "Morocco → Canada",
    }
  ]

  const faqs = [
    {
      question: "When should I start the college application process?",
      answer:
        "It’s recommended to begin at least 12–18 months before the intended start date. This ensures enough time for test preparation, document gathering, and meeting deadlines.",
    },
    {
      question: "Do you only help with U.S. college applications?",
      answer:
        "No. We assist with applications worldwide, including the U.S., Canada, Europe, and other study destinations, depending on the student’s goals.",
    },
    {
      question: "What if I haven’t decided on a program or country yet?",
      answer:
        "That’s perfectly fine. Our consultation session is designed to help you explore options, understand requirements, and make the right decision for your academic pathway.",
    },
    {
      question: "Can you help me with essay and personal statement writing?",
      answer:
        "Yes. We provide brainstorming guidance, structural feedback, and editing support to ensure your essays and statements reflect your authentic voice while meeting admission standards.",
    },
    {
      question: "What happens if I miss an application deadline?",
      answer:
        "We work with you to identify alternative universities or intake periods. With proper planning and our structured timeline, we help minimize the risk of missed deadlines.",
    },
    {
      question: "Do you guarantee admission to universities?",
      answer:
        "Yes we guarantee admission.",
    },
    {
      question: "Who is this service for?",
      answer:
        "This service is designed for students applying to undergraduate, community college, or graduate programs",
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
      {/* Hero Section */}
      <section
        className="relative py-32 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250528_2315_Iconic%20University%20Campus_simple_compose_01jwd0hbj5eqmtt5j2jez0ed5t-WC5l684BOvXJtqslLtuG1bTXdSoXp4.png')`,
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Gateway to Global Education Excellence</h1>
            <p className="text-xl md:text-2xl mb-8">
              Transform your academic dreams into reality with expert guidance, personalized support, and proven success
              in international education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-consultation">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
                  Apply Now
                </Button>
              </Link>
              <Link href="/book-consultation">
                <Button
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 px-8 py-4 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <GraduationCap className="h-12 w-12 text-primary" />,
                title: "Consultation Services",
                description: "Our consultation services are designed to provide personalized guidance tailored to each student’s unique academic and career goals",
              },
              {
                icon: <FileText className="h-12 w-12 text-primary" />,
                title: "College Application Service",
                description: "Navigating the college application process can be daunting, but ZS Academie is here to simplify it for you.",
              },
              {
                icon: <Users className="h-12 w-12 text-primary" />,
                title: "Visa Application Forms",
                description: "we streamline the visa application process for international students aiming to study in the USA. We assist in securing an",
              },
              {
                icon: <Globe className="h-12 w-12 text-primary" />,
                title: "Interview Mockup",
                description: "Preparing for your student visa interview is a critical step in your journey to studying in the United States.",
              },
              {
                icon: <Award className="h-12 w-12 text-primary" />,
                title: "Scholarship Assistance",
                description: "Help securing scholarships and financial aid",
              },
              {
                icon: <MapPin className="h-12 w-12 text-primary" />,
                title: "Post-Arrival Support",
                description: "At ZSAcademie, our commitment to your success doesn’t end with obtaining your visa. We understand that transitioning",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:scale-105 hover:shadow-xl transition-all duration-300 border-none bg-gray-50"
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      




      {/* What Students Say Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          {/* Layout: Steps on the left, Content on the right */}
          <div className="flex justify-center items-start gap-12 max-w-6xl mx-auto">

            {/* Step Circles with Vertical Dashed Line */}
            <div className="relative flex flex-col items-center">
              {/* Vertical Dashed Line */}
              <div className="absolute top-0 bottom-0 w-1.5 border-l-4 border-dashed border-gray-400 z-0"></div>


              {/* Step Circles */}
              <div className="z-10 flex flex-col items-center space-y-8">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 font-bold text-lg md:text-xl transition-all duration-300 ${
                      activeStep === step.id
                        ? "bg-primary text-white border-primary scale-110"
                        : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:scale-105"
                    }`}
                  >
                    {step.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center flex-1">
              <div>
                <img
                  src={steps.find((s) => s.id === activeStep)?.image || "/placeholder.svg"}
                  alt={steps.find((s) => s.id === activeStep)?.title}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6">{steps.find((s) => s.id === activeStep)?.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {steps.find((s) => s.id === activeStep)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to the most common questions about studying abroad with ZHAcademie
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-4 border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Still have questions? We're here to help!</p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">Contact Our Experts</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Academic Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of successful students who have transformed their futures with ZHAcademie. Your dream
            university is just one click away.
          </p>
          <Link href="/book-consultation">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Book Your Appointment Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
