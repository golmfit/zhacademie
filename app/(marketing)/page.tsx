import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, GraduationCap, Globe, Star } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/students-studying-abroad.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Gateway to Global Education</h1>
            <p className="text-xl mb-8 text-gray-100">
              Expert guidance for international students pursuing their dreams abroad. From university applications to
              visa success.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Apply Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">98%</p>
              <p className="text-gray-600 mt-2">Visa Success Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">500+</p>
              <p className="text-gray-600 mt-2">Partner Universities</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">5,000+</p>
              <p className="text-gray-600 mt-2">Students Helped</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-12 w-12 text-primary" />,
                title: "1. Register & Upload",
                description: "Create your account, make payment, and upload required documents for verification.",
              },
              {
                icon: <GraduationCap className="h-12 w-12 text-primary" />,
                title: "2. Application Support",
                description: "Our experts help you select universities and prepare winning applications.",
              },
              {
                icon: <Globe className="h-12 w-12 text-primary" />,
                title: "3. Visa Interview Prep",
                description: "Get comprehensive visa interview preparation and documentation support.",
              },
            ].map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                country: "China",
                text: "ZHAcademie made my dream of studying at MIT possible. Their visa guidance was exceptional!",
                rating: 5,
              },
              {
                name: "Ahmed Hassan",
                country: "Egypt",
                text: "Professional team that truly cares about students. Got into my top 3 university choices!",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                country: "India",
                text: "The step-by-step visa process guidance saved me so much stress. Highly recommended!",
                rating: 5,
              },
              {
                name: "Carlos Rodriguez",
                country: "Mexico",
                text: "From application to arrival, ZHAcademie supported me every step of the way.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={`/thoughtful-artist.png?height=60&width=60&query=portrait ${testimonial.name}`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.country}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How long does the visa process take?</AccordionTrigger>
              <AccordionContent>
                The visa process typically takes 4-8 weeks from application to approval. We help expedite the process by
                ensuring all documents are properly prepared and submitted on time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What support do you provide during the application?</AccordionTrigger>
              <AccordionContent>
                We provide comprehensive support including university selection, application review, essay editing,
                document preparation, visa application assistance, and interview preparation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a refund policy?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a partial refund if your visa is rejected due to reasons beyond our control. Full refunds
                are available if you cancel within 7 days of payment before we begin processing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can you help with scholarship applications?</AccordionTrigger>
              <AccordionContent>
                Our premium and ultimate packages include scholarship search and application assistance. We help
                identify suitable scholarships and prepare strong applications.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Do you provide post-arrival support?</AccordionTrigger>
              <AccordionContent>
                Yes, our ultimate package includes post-arrival support such as airport pickup, accommodation
                assistance, and help with initial settling-in processes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Which countries do you cover?</AccordionTrigger>
              <AccordionContent>
                We specialize in applications to the USA, UK, Canada, Australia, and European countries. We have
                partnerships with over 500 universities across these regions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who achieved their international education dreams with ZHAcademie.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
