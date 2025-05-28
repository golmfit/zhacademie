"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Users, GraduationCap, Video, Plane } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Schedule Your Appointment",
    description: "Start by scheduling a consultation with our advisors to discuss your academic goals and study plans.",
    icon: Calendar,
    image: "/students-studying-abroad.png",
    cta: "Book Now",
  },
  {
    number: 2,
    title: "Submit Your Information",
    description:
      "Provide the necessary documents and details to help us evaluate your profile and prepare your application strategy.",
    icon: FileText,
    image: "/document-preparation.png",
    cta: "Get Started",
  },
  {
    number: 3,
    title: "Work With Your Advisor",
    description:
      "Get matched with a dedicated advisor who will guide you through every step of the university and visa process.",
    icon: Users,
    image: "/diverse-team-collaboration.png",
    cta: "Meet Your Advisor",
  },
  {
    number: 4,
    title: "Apply to Universities",
    description:
      "We help you choose the right programs, prepare documents, and submit strong applications to top universities.",
    icon: GraduationCap,
    image: "/bustling-university-campus.png",
    cta: "Start Application",
  },
  {
    number: 5,
    title: "Prepare for the Visa Interview",
    description:
      "Receive complete support with financial documentation and mock interviews to boost your chances of visa approval.",
    icon: Video,
    image: "/visa-interview.png",
    cta: "Prepare Now",
  },
  {
    number: 6,
    title: "Get Ready to Travel",
    description:
      "After your admission and visa approval, we assist with housing, pre-departure checklists, and orientation tips.",
    icon: Plane,
    image: "/abstract-geometric-shapes.png",
    cta: "Learn More",
  },
]

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1)
  const currentStep = steps.find((step) => step.number === activeStep) || steps[0]

  return (
    <div className="space-y-16 max-w-4xl mx-auto">
      {/* Step Circles Navigation */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2 hidden md:block" />

        {/* Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 hidden md:block transition-all duration-500"
          style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Step Circles */}
        <div className="relative grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-0">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(step.number)}
              className={`
                relative mx-auto w-14 h-14 md:w-16 md:h-16 rounded-full 
                flex items-center justify-center font-bold text-lg
                transition-all duration-300 transform
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4
                ${
                  activeStep === step.number
                    ? "bg-primary text-white scale-110 md:scale-120 shadow-lg"
                    : "bg-white text-primary border-2 border-gray-300 hover:border-primary hover:scale-105"
                }
              `}
              aria-label={`Step ${step.number}: ${step.title}`}
              aria-current={activeStep === step.number ? "step" : undefined}
            >
              {step.number}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={currentStep.image || "/placeholder.svg"}
            alt={currentStep.title}
            className="w-full h-[250px] md:h-[300px] object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <currentStep.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep.number} of {steps.length}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-primary">{currentStep.title}</h3>

          <p className="text-base text-gray-700 leading-relaxed">{currentStep.description}</p>

          <Button size="md" className="mt-4">
            {currentStep.cta}
          </Button>
        </div>
      </div>
    </div>
  )
}
