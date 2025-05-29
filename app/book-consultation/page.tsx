"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, DollarSign, Calendar, CheckCircle, AlertCircle, Copy, Building2 } from "lucide-react"
import { getCalApi } from "@calcom/embed-react"

export default function BookConsultationPage() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "quick-consultation" })
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#0A1E42" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  const bankDetails = {
    bankName: "International Bank of Morocco",
    accountName: "ZH Academie Educational Services",
    accountNumber: "1234567890123456",
    swiftCode: "IBMOMA2A",
    iban: "MA64 0011 0000 0012 3456 7890 123",
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Your Expert Consultation</h1>
            <p className="text-xl mb-8 opacity-90">
              Get personalized guidance from our education experts and take the first step toward your international
              education journey.
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Service Details */}
              <div>
                <Card className="border-none shadow-lg mb-8">
                  <CardContent className="pt-8">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Quick Consultation Session</h2>
                      <div className="flex items-center justify-center gap-6 text-lg">
                        <div className="flex items-center text-primary">
                          <Clock className="h-5 w-5 mr-2" />
                          <span className="font-semibold">20 Minutes</span>
                        </div>
                        <div className="flex items-center text-green-600">
                          <DollarSign className="h-5 w-5 mr-2" />
                          <span className="font-semibold">$20 USD</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold">What You'll Get:</h3>
                      <div className="space-y-4">
                        {[
                          "Personalized university recommendations based on your profile",
                          "Guidance on application requirements and deadlines",
                          "Scholarship and funding opportunities discussion",
                          "Visa process overview for your target countries",
                          "Next steps roadmap for your study abroad journey",
                          "Q&A session to address your specific concerns",
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Instructions */}
                <Card className="border-none shadow-lg bg-amber-50 mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <AlertCircle className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-amber-900">Important Payment Instructions</h3>
                        <ol className="space-y-2 text-sm text-amber-800">
                          <li>1. Transfer $20 USD to the bank account details below</li>
                          <li>2. Keep your payment confirmation/reference number</li>
                          <li>3. Click "I'm Ready - Book Now" to schedule your consultation</li>
                          <li>
                            4. <strong>Our admin will contact you to verify your payment confirmation number</strong>
                          </li>
                          <li>5. Once verified, you'll receive the meeting link via email</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Details */}
                <Card className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-primary" />
                      Bank Transfer Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-4">
                        {Object.entries(bankDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center group">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold">{value}</span>
                              <button
                                onClick={() => copyToClipboard(value)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Copy to clipboard"
                              >
                                <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Please ensure all details are correct when making the transfer. International transfers may
                          take 1-3 business days.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking Card */}
              <div className="lg:sticky lg:top-8">
                <Card className="border-none shadow-xl">
                  <CardContent className="pt-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                      <p className="text-gray-600 mb-6">
                        Make sure you have completed the payment and have your confirmation number ready before booking.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Consultation Summary */}
                      <div className="bg-primary/5 rounded-lg p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Duration:</span>
                            <span className="font-semibold">20 minutes</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Format:</span>
                            <span className="font-semibold">Video Call</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Price:</span>
                            <span className="text-xl font-bold text-primary">$20 USD</span>
                          </div>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">Before you book, ensure you have:</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span>Completed the $20 USD bank transfer</span>
                          </div>
                          <div className="flex items-center text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span>Your payment confirmation number</span>
                          </div>
                          <div className="flex items-center text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span>A quiet space for the video call</span>
                          </div>
                        </div>
                      </div>

                      {/* Book Now Button */}
                      <button
                        data-cal-namespace="quick-consultation"
                        data-cal-link="zhacademi/quick-consultation"
                        data-cal-config='{"layout":"month_view"}'
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
                      >
                        I'm Ready - Book Now
                      </button>

                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          By booking, you confirm that you have made the payment and agree to our terms
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Indicators */}
                <div className="mt-8 text-center">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">5,000+</div>
                      <div className="text-xs text-gray-600">Students Helped</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">15+</div>
                      <div className="text-xs text-gray-600">Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "Why do I need to pay before booking?",
                  answer:
                    "This ensures serious inquiries only and allows our consultants to prepare thoroughly for your session. Payment verification is done manually by our admin team.",
                },
                {
                  question: "How long does payment verification take?",
                  answer:
                    "Our admin team typically verifies payments within 2-4 hours during business hours. You'll be contacted via email or phone to confirm your payment reference number.",
                },
                {
                  question: "What if I can't find a suitable time slot?",
                  answer:
                    "New slots are added weekly. If you can't find a suitable time, contact us at support@zhacademie.com and we'll arrange a custom slot for you.",
                },
                {
                  question: "Can I get a refund if I need to cancel?",
                  answer:
                    "Yes, we offer a full refund if you cancel at least 24 hours before your scheduled consultation. Contact our admin team with your payment confirmation number.",
                },
              ].map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
