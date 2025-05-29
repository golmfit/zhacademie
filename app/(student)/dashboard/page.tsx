"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProgressStepper } from "@/components/ui/ProgressStepper"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { ArrowRight } from "lucide-react"
import { useCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/contexts/auth-context"
import { useStudentProgress } from "@/hooks/use-student-progress"
import { where } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { appProgressPercentage, visaProgressPercentage, appStages, visaStages, overallStatus, isLoading } =
    useStudentProgress()

  // Fetch student data
  const { data: studentData } = useCollection("students", user?.uid ? [where("__name__", "==", user.uid)] : [])
  const student = studentData?.[0]

  // Fetch notifications with better error handling
  const {
    data: notificationsData,
    loading: loadingNotifications,
    error: notificationsError,
  } = useCollection("notifications", user?.uid ? [where("userId", "==", user.uid)] : [])

  // Sort notifications client-side
  const [sortedNotifications, setSortedNotifications] = useState<any[]>([])

  useEffect(() => {
    if (notificationsData && notificationsData.length > 0) {
      // Sort by createdAt in descending order (newest first)
      const sorted = [...notificationsData].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime()
        const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime()
        return dateB - dateA
      })
      setSortedNotifications(sorted)
    } else {
      setSortedNotifications([])
    }
  }, [notificationsData])

  // Format the stages for the ProgressStepper component
  const formattedVisaSteps = visaStages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    status:
      stage.status === "Completed"
        ? "Completed"
        : visaStages.findIndex((s) => s.status !== "Completed") === visaStages.findIndex((s) => s.id === stage.id)
          ? "In Progress"
          : "Pending",
  }))

  const formattedAppSteps = appStages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    status:
      stage.status === "Completed"
        ? "Completed"
        : appStages.findIndex((s) => s.status !== "Completed") === appStages.findIndex((s) => s.id === stage.id)
          ? "In Progress"
          : "Pending",
  }))

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-amber-600"
      case "Low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Application Progress Card */}
        <Card>
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Application Progress</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-500">Overall Completion</span>
              <span className="text-xs sm:text-sm font-medium">{appProgressPercentage}%</span>
            </div>
            <Progress value={appProgressPercentage} className="h-2 mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-gray-600">
              {appProgressPercentage < 50
                ? "You're just getting started. Keep going!"
                : appProgressPercentage < 80
                  ? "You're making good progress!"
                  : "Almost there! Just a few more steps."}
            </p>
          </CardContent>
        </Card>

        {/* Visa Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Visa Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Overall Completion</span>
              <span className="text-sm font-medium">{visaProgressPercentage}%</span>
            </div>
            <Progress value={visaProgressPercentage} className="h-2 mb-4" />
            <p className="text-sm text-gray-600">
              {visaProgressPercentage < 30
                ? "Starting your visa journey. We'll guide you through each step."
                : visaProgressPercentage < 70
                  ? "Making progress on your visa application."
                  : "Almost there! Prepare for your interview."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visa Steps */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Visa Application Progress</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p className="text-gray-500 text-sm">Loading progress...</p>
            </div>
          ) : (
            <ProgressStepper steps={formattedVisaSteps} />
          )}
        </CardContent>
      </Card>

      {/* Application Progress Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p className="text-gray-500">Loading progress...</p>
            </div>
          ) : (
            <ProgressStepper steps={formattedAppSteps} />
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Recent Notifications</CardTitle>
          <Link href="/notifications">
            <Button variant="ghost" size="sm" className="text-primary text-xs sm:text-sm">
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Notification items with improved mobile layout */}
            {sortedNotifications?.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start pb-3 sm:pb-4 border-b border-gray-100 last:border-0 last:pb-0 ${
                  !notification.read ? "bg-blue-50/30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                    notification.priority === "High"
                      ? "bg-red-500"
                      : notification.priority === "Medium"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                    <p className="font-medium text-sm leading-tight pr-2">
                      {notification.title || notification.message}
                    </p>
                    <StatusBadge
                      status={
                        notification.type === "Document"
                          ? "Approved"
                          : notification.type === "Visa"
                            ? "In Progress"
                            : "Completed"
                      }
                      className="self-start flex-shrink-0"
                    />
                  </div>
                  {notification.title && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-1">
                    <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority} Priority
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
