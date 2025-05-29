import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl mb-8">
              Have questions about your international education journey? We're here to help. Reach out to our expert
              team for personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                info: ["123 Education Street", "Academic District", "New York, NY 10001"],
              },
              {
                icon: Phone,
                title: "Call Us",
                info: ["+1 (555) 123-4567", "+1 (555) 987-6543", "Mon-Fri: 9AM-6PM EST"],
              },
              {
                icon: Mail,
                title: "Email Us",
                info: ["info@zhacademie.com", "support@zhacademie.com", "admissions@zhacademie.com"],
              },
              {
                icon: Clock,
                title: "Office Hours",
                info: ["Monday - Friday", "9:00 AM - 6:00 PM EST", "Saturday: 10AM-2PM"],
              },
            ].map((contact, index) => (
              <Card key={index} className="border-none shadow-lg text-center">
                <CardContent className="pt-8">
                  <contact.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-4">{contact.title}</h3>
                  <div className="space-y-1">
                    {contact.info.map((line, i) => (
                      <p key={i} className="text-gray-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input id="firstName" placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input id="lastName" placeholder="Enter your last name" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country of Origin
                    </label>
                    <Input id="country" placeholder="Enter your country" />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input id="subject" placeholder="What can we help you with?" required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your goals and how we can help..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-8">
                  <h3 className="text-xl font-bold mb-4">Find Our Office</h3>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Interactive Map Coming Soon</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Address:</strong> 123 Education Street, Academic District, New York, NY 10001
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Nearest Subway:</strong> Academic Center Station (Lines 4, 5, 6)
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Parking:</strong> Street parking and nearby parking garage available
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-8">
                  <h3 className="text-xl font-bold mb-4">Quick Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email Inquiries:</span>
                      <span className="font-medium">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone Calls:</span>
                      <span className="font-medium">Same day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgent Matters:</span>
                      <span className="font-medium">Within 2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-8">
                  <h3 className="text-xl font-bold mb-4">Schedule a Consultation</h3>
                  <p className="text-gray-600 mb-4">
                    Ready to discuss your international education goals? Book a free 30-minute consultation with our
                    experts.
                  </p>
                  <Button className="w-full">Book Free Consultation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How quickly can you respond to my inquiry?",
                answer:
                  "We typically respond to email inquiries within 24 hours and phone calls the same day. For urgent matters, we aim to respond within 2 hours during business hours.",
              },
              {
                question: "Do you offer free consultations?",
                answer:
                  "Yes! We offer a complimentary 30-minute consultation to discuss your goals and how we can help you achieve them.",
              },
              {
                question: "Can I visit your office in person?",
                answer:
                  "We welcome in-person visits. Please schedule an appointment in advance to ensure our team is available to meet with you.",
              },
              {
                question: "Do you provide services in languages other than English?",
                answer:
                  "Yes, our team speaks multiple languages including Spanish, Mandarin, Arabic, and Hindi. Let us know your preferred language when contacting us.",
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
    </div>
  )
}
