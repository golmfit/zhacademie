import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Facebook, Twitter, Linkedin, Share2 } from "lucide-react"

// Sample blog posts data (same as in blog/page.tsx)
const blogPosts = [
  {
    id: 1,
    slug: "preparing-for-visa-interview",
    title: "10 Tips for Acing Your Student Visa Interview",
    excerpt: "Learn the essential strategies to help you prepare for and succeed in your student visa interview.",
    date: "May 15, 2023",
    author: "David Okafor",
    authorRole: "Head of Visa Services",
    authorBio:
      "David is a former visa officer with over 10 years of experience in immigration consulting. He specializes in visa interview preparation and has helped thousands of students successfully obtain their student visas.",
    readTime: "8 min read",
    image: "/visa-interview.png",
    category: "Visa Tips",
    content: `
      <p>The student visa interview is often the most stressful part of the application process. It's your opportunity to make a positive impression and convince the visa officer that you're a genuine student with legitimate plans to study abroad and return to your home country afterward.</p>
      
      <h2>1. Know Your Program Inside Out</h2>
      <p>Be prepared to discuss your course of study in detail. Understand the curriculum, why you chose this specific program, and how it aligns with your academic and career goals. Visa officers want to see that you've done your research and have a clear purpose for your studies.</p>
      
      <h2>2. Demonstrate Strong Ties to Your Home Country</h2>
      <p>One of the primary concerns for visa officers is whether you'll return to your home country after completing your studies. Be ready to discuss your family connections, property ownership, career prospects upon return, and other factors that demonstrate your intention to return.</p>
      
      <h2>3. Practice Clear and Concise Answers</h2>
      <p>Visa interviews are typically brief, so practice giving clear, direct answers to common questions. Avoid rambling or providing unnecessary information. Focus on answering exactly what was asked.</p>
      
      <h2>4. Prepare Financial Documentation</h2>
      <p>Be ready to explain how you'll finance your education and living expenses abroad. Have documentation of scholarships, loans, or family support readily available. The visa officer needs to be confident that you have sufficient funds for your entire program.</p>
      
      <h2>5. Be Honest</h2>
      <p>Never lie or provide false information during your interview. Visa officers are trained to detect inconsistencies, and dishonesty will result in immediate rejection. If you don't know an answer, it's better to say so than to make something up.</p>
      
      <h2>6. Dress Professionally</h2>
      <p>First impressions matter. Dress in business casual attire to show that you're taking the interview seriously. Your appearance demonstrates respect for the process and the visa officer's time.</p>
      
      <h2>7. Arrive Early</h2>
      <p>Plan to arrive at least 30 minutes before your scheduled interview time. This allows for any unexpected delays and gives you time to compose yourself before the interview.</p>
      
      <h2>8. Bring All Required Documents</h2>
      <p>Organize your documents in a folder for easy access during the interview. Include your acceptance letter, financial documents, academic transcripts, and any other supporting materials. Having everything well-organized shows that you're prepared and responsible.</p>
      
      <h2>9. Stay Calm and Positive</h2>
      <p>Nervousness is natural, but try to remain calm and maintain a positive attitude throughout the interview. Smile, make appropriate eye contact, and speak clearly. Your confidence will help create a favorable impression.</p>
      
      <h2>10. Practice Mock Interviews</h2>
      <p>Conduct practice interviews with friends, family, or education consultants. This will help you become comfortable with the interview format and identify areas where you need improvement.</p>
      
      <h2>Conclusion</h2>
      <p>Remember that the visa officer's primary goal is to determine if you're a genuine student with legitimate intentions. By following these tips and being well-prepared, you'll significantly increase your chances of a successful visa interview. At ZHAcademie, our visa specialists provide comprehensive interview preparation, including multiple mock interviews with detailed feedback to ensure you're fully prepared for this crucial step in your study abroad journey.</p>
    `,
    relatedPosts: [2, 3, 6],
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
    authorBio:
      "Priya has worked in university admissions for over 8 years before joining ZHAcademie. She maintains relationships with hundreds of universities worldwide and helps students find their perfect academic match.",
    readTime: "10 min read",
    image: "/bustling-university-campus.png",
    category: "University Selection",
    content: `<p>Sample content for choosing the right university article...</p>`,
    relatedPosts: [1, 3, 5],
  },
  {
    id: 3,
    slug: "scholarship-opportunities",
    title: "Top Scholarship Opportunities for International Students in 2023",
    excerpt: "Discover the best scholarship programs available for international students and how to apply for them.",
    date: "March 18, 2023",
    author: "Sarah Chen",
    authorRole: "Founder & CEO",
    authorBio:
      "Sarah founded ZHAcademie after her own challenging experience as an international student. She's passionate about making education accessible to students worldwide.",
    readTime: "12 min read",
    image: "/scholarship-money.png",
    category: "Scholarships",
    content: `<p>Sample content for scholarship opportunities article...</p>`,
    relatedPosts: [2, 4, 6],
  },
  {
    id: 4,
    slug: "ielts-preparation-guide",
    title: "Comprehensive IELTS Preparation Guide for Students",
    excerpt: "Everything you need to know to prepare for and excel in your IELTS examination for studying abroad.",
    date: "February 10, 2023",
    author: "Maria Rodriguez",
    authorRole: "Student Success Manager",
    authorBio:
      "Maria specializes in language test preparation and has helped hundreds of students achieve their target IELTS scores.",
    readTime: "15 min read",
    image: "/ielts-preparation.png",
    category: "Language Tests",
    content: `<p>Sample content for IELTS preparation guide article...</p>`,
    relatedPosts: [1, 3, 5],
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
    authorBio:
      "James studied abroad in three different countries before joining ZHAcademie. He brings personal experience to his advice on adapting to new environments.",
    readTime: "9 min read",
    image: "/students-studying-abroad.png",
    category: "Student Life",
    content: `<p>Sample content for student life abroad article...</p>`,
    relatedPosts: [2, 4, 6],
  },
  {
    id: 6,
    slug: "document-preparation-tips",
    title: "Essential Document Preparation Tips for Visa Applications",
    excerpt: "A step-by-step guide to preparing and organizing your documents for a successful visa application.",
    date: "December 12, 2022",
    author: "Ahmed Hassan",
    authorRole: "Document Specialist",
    authorBio:
      "Ahmed has reviewed thousands of visa applications and knows exactly what immigration officers look for in documentation.",
    readTime: "7 min read",
    image: "/document-preparation.png",
    category: "Documentation",
    content: `<p>Sample content for document preparation tips article...</p>`,
    relatedPosts: [1, 3, 5],
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Find the blog post with the matching slug
  const post = blogPosts.find((post) => post.slug === params.slug)

  // If no matching post is found, return 404
  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = post.relatedPosts.map((id) => blogPosts.find((post) => post.id === id)).filter(Boolean)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-block bg-primary/80 px-3 py-1 rounded text-sm font-medium mb-4">{post.category}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all articles
              </Link>

              {/* Author Info */}
              <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                  <span className="font-bold text-lg text-gray-600">
                    {post.author
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{post.author}</h3>
                  <p className="text-gray-600">{post.authorRole}</p>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Social Share */}
              <div className="border-t border-b py-6 my-8">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Share this article:</span>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" aria-label="Share on Facebook">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Share on Twitter">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Share on LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Copy link">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-bold text-lg mb-2">About the Author</h3>
                <p className="text-gray-700">{post.authorBio}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Related Posts */}
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-6">Related Articles</h3>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost?.id} className="overflow-hidden">
                      <div className="relative h-40">
                        <Image
                          src={relatedPost?.image || ""}
                          alt={relatedPost?.title || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          <Link href={`/blog/${relatedPost?.slug}`} className="hover:text-primary transition-colors">
                            {relatedPost?.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{relatedPost?.date}</span>
                          <span className="mx-2">•</span>
                          <span>{relatedPost?.readTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* CTA */}
                <div className="bg-primary text-white p-6 rounded-lg mt-8">
                  <h3 className="font-bold text-xl mb-4">Ready to Start Your Journey?</h3>
                  <p className="mb-4">
                    Get expert guidance on your international education and visa application process.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-white text-primary hover:bg-gray-100">Book a Consultation</Button>
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
