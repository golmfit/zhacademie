import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    slug: "preparing-for-visa-interview",
    title: "10 Tips for Acing Your Student Visa Interview",
    excerpt: "Learn the essential strategies to help you prepare for and succeed in your student visa interview.",
    date: "May 15, 2023",
    author: "David Okafor",
    authorRole: "Head of Visa Services",
    readTime: "8 min read",
    image: "/visa-interview.png",
    category: "Visa Tips",
  },
  {
    id: 2,
    slug: "choosing-right-university",
    title: "How to Choose the Right University for Your International Studies",
    excerpt:
      "Factors to consider when selecting the perfect university abroad that aligns with your academic and career goals.",
    date: "April 22, 2023",
    author: "Priya Sharma",
    authorRole: "University Relations Director",
    readTime: "10 min read",
    image: "/bustling-university-campus.png",
    category: "University Selection",
  },
  {
    id: 3,
    slug: "scholarship-opportunities",
    title: "Top Scholarship Opportunities for International Students in 2023",
    excerpt: "Discover the best scholarship programs available for international students and how to apply for them.",
    date: "March 18, 2023",
    author: "Sarah Chen",
    authorRole: "Founder & CEO",
    readTime: "12 min read",
    image: "/scholarship-money.png",
    category: "Scholarships",
  },
  {
    id: 4,
    slug: "ielts-preparation-guide",
    title: "Comprehensive IELTS Preparation Guide for Students",
    excerpt: "Everything you need to know to prepare for and excel in your IELTS examination for studying abroad.",
    date: "February 10, 2023",
    author: "Maria Rodriguez",
    authorRole: "Student Success Manager",
    readTime: "15 min read",
    image: "/ielts-preparation.png",
    category: "Language Tests",
  },
  {
    id: 5,
    slug: "student-life-abroad",
    title: "Adjusting to Student Life Abroad: Challenges and Solutions",
    excerpt:
      "Practical advice for international students on adapting to a new culture, academic environment, and lifestyle.",
    date: "January 25, 2023",
    author: "James Kim",
    authorRole: "Technology Director",
    readTime: "9 min read",
    image: "/students-studying-abroad.png",
    category: "Student Life",
  },
  {
    id: 6,
    slug: "document-preparation-tips",
    title: "Essential Document Preparation Tips for Visa Applications",
    excerpt: "A step-by-step guide to preparing and organizing your documents for a successful visa application.",
    date: "December 12, 2022",
    author: "Ahmed Hassan",
    authorRole: "Document Specialist",
    readTime: "7 min read",
    image: "/document-preparation.png",
    category: "Documentation",
  },
]

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ZHAcademie Blog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Expert insights, tips, and resources for international students and visa applicants
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    {post.category}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="pt-2 border-t">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <span className="font-bold text-xs text-gray-600">
                        {post.author
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
