import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function MarketingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock Your Global Education Dreams</h1>
              <p className="text-lg mb-8">
                Get expert guidance and support for your university applications, visa processing, and more.
              </p>
              <div className="flex gap-4">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/marketing/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1505682634904-9c9d606f1913?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Students Studying"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-section-heading font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">University Applications</h3>
                <p className="text-gray-600">
                  We help you choose the right universities, prepare your application materials, and navigate the
                  admission process.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Visa Processing</h3>
                <p className="text-gray-600">
                  Our experts guide you through the visa application process, ensuring you have all the necessary
                  documents and information.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Accommodation & Support</h3>
                <p className="text-gray-600">
                  We assist with finding suitable accommodation and provide ongoing support to help you settle into your
                  new environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-section-heading font-bold text-center mb-12">Our Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Basic</h3>
                <p className="text-gray-600 mb-4">University selection and application review.</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Up to 3 University Applications</li>
                  <li>Application Review</li>
                </ul>
                <Button className="mt-4 w-full">Select</Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Standard</h3>
                <p className="text-gray-600 mb-4">Everything in Basic, plus visa guidance.</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Up to 5 University Applications</li>
                  <li>Application Review</li>
                  <li>Visa Application Guidance</li>
                </ul>
                <Button className="mt-4 w-full">Select</Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Ultimate</h3>
                <p className="text-gray-600 mb-4">
                  Everything in Standard, plus accommodation assistance and post-arrival support.
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Unlimited University Applications</li>
                  <li>Application Review</li>
                  <li>Visa Application Guidance</li>
                  <li>Accommodation Assistance</li>
                  <li>Post-Arrival Support</li>
                </ul>
                <Button className="mt-4 w-full">Select</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-section-heading font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "John Doe",
                title: "CEO",
                image:
                  "https://images.unsplash.com/photo-1570295999680-0b97926c2e19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
              },
              {
                name: "Jane Smith",
                title: "Admissions Counselor",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
              },
              {
                name: "David Lee",
                title: "Visa Specialist",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd8a72fbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHx8fHww&auto=format&fit=crop&w=500&q=60",
              },
              {
                name: "Emily White",
                title: "Support Coordinator",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b8d21c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHx8fHww&auto=format&fit=crop&w=500&q=60",
              },
            ].map((member, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="rounded-full w-24 h-24 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                  <p className="text-gray-600 text-center">{member.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Users Say Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-section-heading font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Maria Rodriguez",
                country: "Spain",
                university: "Harvard University",
                quote:
                  "ZHAcademie made my dream of studying at Harvard a reality. Their guidance through the visa process was invaluable.",
                rating: 5,
              },
              {
                name: "Ahmed Hassan",
                country: "Egypt",
                university: "MIT",
                quote:
                  "The team's expertise in university applications helped me get into MIT. I couldn't have done it without them.",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                country: "India",
                university: "Stanford University",
                quote: "Professional, reliable, and results-driven. ZHAcademie exceeded all my expectations.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.country} → {testimonial.university}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-section-heading font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How long does the visa application process take?",
                answer:
                  "The visa application process typically takes 4-8 weeks, depending on the country and type of visa. We provide timeline estimates for each specific case.",
              },
              {
                question: "Do you guarantee university admission?",
                answer:
                  "While we cannot guarantee admission, our expert guidance significantly improves your chances. We have a 95% success rate for university applications.",
              },
              {
                question: "What documents do I need to provide?",
                answer:
                  "Required documents vary by destination and program, but typically include academic transcripts, passport, financial statements, and language proficiency scores.",
              },
              {
                question: "Can I change my university selection after starting the process?",
                answer:
                  "Yes, you can modify your university choices during the initial consultation phase. Additional fees may apply for significant changes.",
              },
              {
                question: "Do you provide support after I arrive in the destination country?",
                answer:
                  "Yes, our Ultimate package includes post-arrival support including accommodation assistance and airport pickup services.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their international education dreams with
            ZHAcademie.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Apply Now
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

      {/* Footer */}
      <footer className="py-8 bg-gray-200 text-center">
        <p className="text-gray-600">© 2023 ZHAcademie. All rights reserved.</p>
      </footer>
    </main>
  )
}
