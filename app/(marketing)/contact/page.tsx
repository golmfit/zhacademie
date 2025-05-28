"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Calendar, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Simulate form submission
    try {
      // In a real implementation, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      setError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions about studying abroad? Our team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Our friendly team is here to help</p>
                <a href="mailto:info@zhacademie.com" className="text-primary hover:underline">
                  info@zhacademie.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+15551234567" className="text-primary hover:underline">
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Come say hello at our office</p>
                <address className="not-italic text-primary">
                  123 Education Street
                  <br />
                  New York, NY 10001
                </address>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">{error}</div>}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      placeholder="Your message here..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Map and Office Hours */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Office Information</h2>

              <div className="bg-gray-200 rounded-lg overflow-hidden h-64 mb-6">
                {/* Placeholder for map - would be replaced with actual map component */}
                <div className="h-full w-full flex items-center justify-center bg-gray-300">
                  <MapPin className="h-12 w-12 text-gray-500" />
                  <span className="ml-2 text-gray-600">Map Placeholder</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" /> Office Hours
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" /> Book a Consultation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Schedule a free 15-minute consultation with one of our education advisors.
                  </p>
                  <Link href="/contact#book">
                    <Button className="w-full">Book Appointment</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
