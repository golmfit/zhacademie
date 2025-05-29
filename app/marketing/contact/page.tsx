"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Calendar, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl mx-auto text-center"
            style={{
              animation: isLoaded ? "fadeIn 0.8s ease-out forwards" : "none",
            }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-md">Get in Touch</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Have questions about your international education journey? We're here to help. Reach out to our expert
              team for personalized guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/book-consultation">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 group">
                  <Calendar className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Schedule Meeting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-16"
            style={{
              animation: isLoaded ? "fadeIn 0.8s ease-out 0.3s forwards" : "none",
              opacity: 0,
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Offices Worldwide</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              With offices in Morocco and the United States, we're strategically positioned to serve students globally.
            </p>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: MapPin,
                title: "Agadir Office",
                info: ["HAY salam bloc b nr 61", "draga agadir", "Morocco"],
                delay: 0.4,
                animation: "slideInLeft",
              },
              {
                icon: MapPin,
                title: "Malden Office",
                info: ["128 lebanon st", "malden mass 02148", "United States"],
                delay: 0.5,
                animation: "fadeIn",
                highlight: true,
              },
              {
                icon: Phone,
                title: "Call Us",
                info: ["+1 (339) 228-8533", "Mon-Fri: 9AM-6PM", "Saturday: 10AM-2PM"],
                delay: 0.6,
                animation: "slideInRight",
              },
              {
                icon: Mail,
                title: "Email Us",
                info: ["info@zhacademie.com", "support@zhacademie.com", "admissions@zhacademie.com"],
                delay: 0.7,
                animation: "slideInLeft",
              },
              {
                icon: Clock,
                title: "Office Hours",
                info: ["Monday - Friday", "9:00 AM - 6:00 PM", "Saturday: 10AM-2PM"],
                delay: 0.8,
                animation: "slideInRight",
              },
            ].map((contact, index) => (
              <Card
                key={index}
                className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 group ${
                  contact.highlight ? "ring-2 ring-primary/20" : ""
                }`}
                style={{
                  animation: isLoaded ? `${contact.animation} 0.8s ease-out ${contact.delay}s forwards` : "none",
                  opacity: 0,
                }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        contact.highlight ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      <contact.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {contact.title}
                    </h3>
                    <div className="space-y-2 text-center">
                      {contact.info.map((line, i) => (
                        <p key={i} className="text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Morocco Office Map */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mt-20">
            <div
              className="order-2 lg:order-1 relative"
              style={{
                animation: isLoaded ? "scaleIn 0.8s ease-out 1.1s forwards" : "none",
                opacity: 0,
              }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-xl blur-lg opacity-70"></div>
              <div className="relative bg-white p-2 rounded-lg shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54803.41311109922!2d-9.6279344!3d30.4078806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e9daad1cc9%3A0x4c5831ccec4bf1b!2sDrarga%2C%20Morocco!5e0!3m2!1sen!2sus!4v1635959542842!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

            <div
              className="order-1 lg:order-2"
              style={{
                animation: isLoaded ? "scaleIn 0.8s ease-out 1.2s forwards" : "none",
                opacity: 0,
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Find Our Morocco Office</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our Agadir office serves as our North African headquarters, providing specialized support for students
                from Morocco and neighboring countries seeking international education opportunities.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Address:</h4>
                    <p className="text-gray-600">HAY salam bloc b nr 61, draga agadir, Morocco</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Phone:</h4>
                    <p className="text-gray-600">+1 (339) 228-8533</p>
                  </div>
                </div>
              </div>

              <Button className="group">
                Get Directions
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl mx-auto text-center"
            style={{
              animation: isLoaded ? "fadeIn 0.8s ease-out 1.3s forwards" : "none",
              opacity: 0,
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Academic Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Schedule a consultation with our expert advisors and take the first step toward your international
              education goals.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/book-consultation">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-medium group"
                >
                  Book Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
