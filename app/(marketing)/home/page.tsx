import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Globe, FileText, Award, Building, PlaneTakeoff, Star, CheckCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HowItWorksSection } from "@/components/marketing/how-it-works"

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

      {/* Our Services */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary"></div>
            <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-primary"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-primary"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary inline-block relative">
              Our Services
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded"></span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Comprehensive support at every stage of your international education journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* University Application */}
            <div className="group relative bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-64 hover:h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 flex flex-col items-center text-center h-full">
                {/* Icon and Title (Always Visible) */}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-90 group-hover:mb-6">
                  <GraduationCap className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 transition-all duration-500">
                  University Application
                </h3>

                {/* Service Details (Revealed on Hover) */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:translate-y-0">
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[0ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Personalized university selection based on your profile
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[150ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Strategic application planning with timeline management
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[300ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Expert essay editing and personal statement refinement
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visa Processing */}
            <div className="group relative bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-64 hover:h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 flex flex-col items-center text-center h-full">
                {/* Icon and Title (Always Visible) */}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-90 group-hover:mb-6">
                  <Globe className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 transition-all duration-500">Visa Processing</h3>

                {/* Service Details (Revealed on Hover) */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:translate-y-0">
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[0ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Complete visa application preparation with documentation
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[150ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Financial documentation guidance for visa requirements
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[300ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">Intensive mock interview sessions with counselors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Preparation */}
            <div className="group relative bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-64 hover:h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 flex flex-col items-center text-center h-full">
                {/* Icon and Title (Always Visible) */}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-90 group-hover:mb-6">
                  <FileText className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 transition-all duration-500">Test Preparation</h3>

                {/* Service Details (Revealed on Hover) */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:translate-y-0">
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[0ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Comprehensive coaching for IELTS, TOEFL, GRE, and GMAT
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[150ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Personalized study plans based on diagnostic assessments
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[300ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Regular practice tests with detailed performance analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scholarship Guidance */}
            <div className="group relative bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-64 hover:h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 flex flex-col items-center text-center h-full">
                {/* Icon and Title (Always Visible) */}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-90 group-hover:mb-6">
                  <Award className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 transition-all duration-500">
                  Scholarship Guidance
                </h3>

                {/* Service Details (Revealed on Hover) */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:translate-y-0">
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[0ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Identification of suitable scholarship opportunities
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[150ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Strategic scholarship application planning and timeline
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[300ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Essay development focused on scholarship requirements
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation Assistance */}
            <div className="group relative bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-64 hover:h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 flex flex-col items-center text-center h-full">
                {/* Icon and Title (Always Visible) */}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-90 group-hover:mb-6">
                  <Building className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 transition-all duration-500">Accommodation</h3>

                {/* Service Details (Revealed on Hover) */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:translate-y-0">
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[0ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Guidance on on-campus and off-campus housing options
                    </span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[150ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">Assistance with university dormitory applications</span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[300ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">
                      Information on cost of living and budgeting for housing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-Departure Support */}
            <div className="group relative bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-64 hover:h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 flex flex-col items-center text-center h-full">
                {/* Icon and Title (Always Visible) */}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-90 group-hover:mb-6">
                  <PlaneTakeoff className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 transition-all duration-500">Pre-Departure</h3>

                {/* Service Details (Revealed on Hover) */}
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-10 group-hover:translate-y-0">
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[0ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">Comprehensive pre-departure orientation sessions</span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[150ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">Cultural preparation and adjustment guidance</span>
                  </div>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[300ms] -translate-y-6 group-hover:translate-y-0">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-gray-700 text-left">Travel arrangements and documentation assistance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">How It Works</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Your journey to international education in 6 simple steps
            </p>
          </div>

          <HowItWorksSection />
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
