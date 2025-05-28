"use client"

import type React from "react"

import { CheckCircle, Circle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type StepStatus = "Completed" | "In Progress" | "Pending"

export interface Step {
  id: string
  name: string
  status: StepStatus
  icon?: React.ReactNode
}

interface ProgressStepperProps {
  steps: Step[]
  className?: string
}

export function ProgressStepper({ steps, className }: ProgressStepperProps) {
  // Calculate completion percentage
  const completedSteps = steps.filter((step) => step.status === "Completed").length
  const completionPercentage = Math.round((completedSteps / steps.length) * 100)

  return (
    <div className={cn("w-full", className)}>
      {/* Progress percentage indicator */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Progress</span>
        <span className="text-sm font-medium text-gray-900">{completionPercentage}% Complete</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-100 mb-8">
        <div
          className="h-2 rounded-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Steps display */}
      <div className="relative">
        {/* Mobile view (vertical layout) */}
        <div className="sm:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2",
                      step.status === "Completed"
                        ? "border-green-500 bg-green-50"
                        : step.status === "In Progress"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50",
                    )}
                  >
                    {step.status === "Completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : step.status === "In Progress" ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  {index < steps.length - 1 && <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200" />}
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step.status === "Completed"
                        ? "text-green-600"
                        : step.status === "In Progress"
                          ? "text-blue-600"
                          : "text-gray-500",
                    )}
                  >
                    {step.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 text-xs",
                      step.status === "Completed"
                        ? "text-green-500"
                        : step.status === "In Progress"
                          ? "text-blue-500"
                          : "text-gray-400",
                    )}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view (horizontal layout) */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 z-10 transition-all duration-300",
                    step.status === "Completed"
                      ? "border-green-500 bg-green-50"
                      : step.status === "In Progress"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50",
                  )}
                >
                  {step.status === "Completed" ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : step.status === "In Progress" ? (
                    <Clock className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </div>

                {/* Step name and status */}
                <div className="mt-3 flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step.status === "Completed"
                        ? "text-green-600"
                        : step.status === "In Progress"
                          ? "text-blue-600"
                          : "text-gray-500",
                    )}
                  >
                    {step.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 text-xs",
                      step.status === "Completed"
                        ? "text-green-500"
                        : step.status === "In Progress"
                          ? "text-blue-500"
                          : "text-gray-400",
                    )}
                  >
                    {step.status}
                  </span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-6 -ml-2 -translate-y-1/2 transform">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "h-0.5 w-12 transition-colors duration-300",
                          step.status === "Completed" ? "bg-green-500" : "bg-gray-200",
                        )}
                      />
                      <ArrowRight
                        className={cn("h-4 w-4", step.status === "Completed" ? "text-green-500" : "text-gray-200")}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
