"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProgressStepper } from "@/components/ui/ProgressStepper"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Calendar, MapPin, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useStudentProgress } from "@/hooks/use-student-progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function VisaProgressPage() {
  const { visaStages, isLoading } = useStudentProgress()

  // Add error state
  const [error, setError] = useState<string | null>(null)

  // Format the stages for the ProgressStepper component
  const formattedSteps = visaStages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    status:
      stage.status === "Completed"
        ? "Completed"
        : visaStages.findIndex((s) => s.status !== "Completed") === visaStages.findIndex((s) => s.id === stage.id)
          ? "In Progress"
          : "Pending",
  }))

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not completed"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "ds160":
        return <FileText className="h-6 w-6" />
      case "payFee":
        return <DollarSign className="h-6 w-6" />
      case "scheduleInterview":
        return <Calendar className="h-6 w-6" />
      case "attendInterview":
        return <MapPin className="h-6 w-6" />
      default:
        return <div className="h-6 w-6" />
    }
  }

  const getStatusBadge = (status: string, isCurrentStep: boolean) => {
    if (status === "Completed") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Completed</span>
        </Badge>
      )
    } else if (isCurrentStep) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>In Progress</span>
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Not Started</span>
        </Badge>
      )
    }
  }

  // Mock resources data - this would normally come from Firestore
  const resources = {
    ds160: [
      { name: "DS-160 Official Website", url: "https://ceac.state.gov/genniv/" },
      { name: "DS-160 Guide", url: "#" },
    ],
    payFee: [{ name: "Fee Payment Instructions", url: "#" }],
    scheduleInterview: [
      { name: "Interview Scheduling Portal", url: "#" },
      { name: "Required Documents Checklist", url: "#" },
    ],
    attendInterview: [
      { name: "Interview Preparation Guide", url: "#" },
      { name: "Embassy Location", url: "#" },
    ],
  }

  // Calculate completion percentage
  const completedStages = visaStages.filter((stage) => stage.status === "Completed").length
  const completionPercentage = Math.round((completedStages / visaStages.length) * 100)

  // In the return statement, add error handling
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Visa Application Progress</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-gray-500">Please try refreshing the page or contact support if the issue persists.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Visa Application Progress</h1>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-500">Loading visa progress...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Visa Application Progress</h1>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your visa application progress through these key steps</CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">{completionPercentage}%</span>
              <CardDescription>Completed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressStepper steps={formattedSteps} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {visaStages.map((step, index) => {
          const isCurrentStep = visaStages.findIndex((s) => s.status !== "Completed") === index

          return (
            <Card
              key={step.id}
              className={cn(
                "transition-all duration-300 hover:shadow-md",
                step.status === "Completed"
                  ? "border-green-100"
                  : isCurrentStep
                    ? "border-blue-100"
                    : "border-gray-100 opacity-80",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-3 p-3 rounded-full",
                        step.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : isCurrentStep
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {getStepIcon(step.id)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.name}</CardTitle>
                      <div className="mt-1">{getStatusBadge(step.status, isCurrentStep)}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {step.status === "Completed" && step.updatedAt && (
                    <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                      <span className="font-medium">Completed on:</span> {step.updatedAt.toLocaleDateString()}
                    </div>
                  )}

                  {resources[step.id as keyof typeof resources]?.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Resources</h4>
                      <div className="space-y-2">
                        {resources[step.id as keyof typeof resources].map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {resource.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {isCurrentStep && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                      Continue this Step
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
