import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import { useState } from "react";


export default function BlogPage() {
  const featuredPost = {
    title: "Complete Guide to Student Visa Applications in 2024",
    excerpt:
      "Everything you need to know about student visa requirements, documentation, and the application process for major study destinations.",
    image: "/student-visa-application.png",
    author: "Dr. Sarah Johnson",
    date: "March 15, 2024",
    category: "Visa Guide",
    readTime: "8 min read",
  }

  const blogPosts = [
    {
      title: "Top 10 Universities for International Students in 2024",
      excerpt:
        "Discover the best universities worldwide that welcome international students with excellent support systems and diverse programs.",
      image: "/international-students-university.png",
      author: "Michael Chen",
      date: "March 12, 2024",
      category: "University Rankings",
      readTime: "6 min read",
    },
    {
      title: "Scholarship Opportunities for International Students",
      excerpt:
        "A comprehensive list of scholarships available for international students, including application tips and deadlines.",
      image: "/scholarship-opportunities-students.png",
      author: "Dr. Priya Patel",
      date: "March 10, 2024",
      category: "Scholarships",
      readTime: "5 min read",
    },
    {
      title: "Cultural Adaptation: Your First Year Abroad",
      excerpt:
        "Tips and strategies for adapting to a new culture, making friends, and succeeding academically in your first year of international study.",
      image: "/cultural-adaptation-students.png",
      author: "Emma Rodriguez",
      date: "March 8, 2024",
      category: "Student Life",
      readTime: "7 min read",
    },
    {
      title: "IELTS vs TOEFL: Which Test Should You Take?",
      excerpt:
        "Compare the two most popular English proficiency tests and find out which one is right for your university applications.",
      image: "/ielts-toefl-comparison.png",
      author: "James Wilson",
      date: "March 5, 2024",
      category: "Test Prep",
      readTime: "4 min read",
    },
    {
      title: "Budgeting for Your International Education",
      excerpt:
        "A detailed breakdown of costs associated with studying abroad and practical tips for managing your finances as an international student.",
      image: "/international-education-budget.png",
      author: "Dr. Sarah Johnson",
      date: "March 3, 2024",
      category: "Finance",
      readTime: "6 min read",
    },
    {
      title: "Statement of Purpose: Writing Tips That Work",
      excerpt:
        "Learn how to craft a compelling statement of purpose that stands out to admissions committees and showcases your unique story.",
      image: "/statement-of-purpose-tips.png",
      author: "Dr. Priya Patel",
      date: "March 1, 2024",
      category: "Application Tips",
      readTime: "5 min read",
    },
  ]

  const categories = [
    "All Posts",
    "Visa Guide",
    "University Rankings",
    "Scholarships",
    "Student Life",
    "Test Prep",
    "Finance",
    "Application Tips",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">ZHAcademie Blog</h1>
            <p className="text-xl mb-8">
              Expert insights, practical tips, and the latest updates on international education, visa processes, and
              student success stories.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Article</h2>
          <Card className="max-w-4xl mx-auto border-none shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button>
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button key={index} variant={index === 0 ? "default" : "outline"} size="sm" className="rounded-full">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-4 left-4">{post.category}</Badge>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-none shadow-lg">
            <CardContent className="pt-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter and get the latest articles, tips, and updates delivered directly to your
                inbox.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Visa Applications",
                count: "25 Articles",
                icon: "📋",
              },
              {
                title: "University Selection",
                count: "18 Articles",
                icon: "🎓",
              },
              {
                title: "Test Preparation",
                count: "15 Articles",
                icon: "📚",
              },
              {
                title: "Student Life",
                count: "22 Articles",
                icon: "🌍",
              },
            ].map((topic, index) => (
              <Card
                key={index}
                className="border-none shadow-lg text-center hover:shadow-xl transition-shadow cursor-pointer"
              >
                <CardContent className="pt-8">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{topic.title}</h3>
                  <p className="text-gray-600">{topic.count}</p>
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
            Have questions about international education? Our expert team is here to provide personalized guidance.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link href="/book-consultation">
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
