"use client"

import { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InterviewPrep() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "interview-preperation" })
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#2A3147" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold">Interview Preparation</h1>
        <Button
          data-cal-namespace="interview-preperation"
          data-cal-link="zhacademi/interview-preperation"
          data-cal-config='{"layout":"month_view"}'
          size="lg"
        >
          Schedule a Session
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>F1 Visa Interview Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full max-w-3xl mx-auto">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/O6pNMthfXto"
                title="F1 Visa Interview Preparation"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="guidelines" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="guidelines" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>F1 Visa Do's and Don'ts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-green-600 text-lg">Do's</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Be confident and concise in your answers</li>
                      <li>Demonstrate strong ties to your home country</li>
                      <li>Bring all required documentation</li>
                      <li>Know your program details thoroughly</li>
                      <li>Dress professionally</li>
                      <li>Arrive early to the interview</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-red-600 text-lg">Don'ts</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Memorize scripted answers</li>
                      <li>Provide false information</li>
                      <li>Be vague about your plans</li>
                      <li>Show intent to immigrate permanently</li>
                      <li>Bring unauthorized individuals</li>
                      <li>Use slang or informal language</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      question: "Why do you want to study in the United States?",
                      answer:
                        "Focus on the academic quality, specific programs, and opportunities that aren't available in your home country.",
                    },
                    {
                      question: "How will you finance your education?",
                      answer: "Be prepared to show documentation of scholarships, family support, or personal funds.",
                    },
                    {
                      question: "What are your plans after graduation?",
                      answer:
                        "Emphasize plans to return to your home country and how your U.S. education will help your career there.",
                    },
                    {
                      question: "Why did you choose this specific university?",
                      answer:
                        "Mention specific programs, professors, research opportunities, or rankings that attracted you.",
                    },
                    {
                      question: "Do you have relatives in the United States?",
                      answer:
                        "Answer honestly, but emphasize your intent to return home after completing your studies.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
