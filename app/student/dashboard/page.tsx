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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Application Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Application Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Overall Completion</span>
              <span className="text-sm font-medium">{appProgressPercentage}%</span>
            </div>
            <Progress value={appProgressPercentage} className="h-2 mb-4" />
            <p className="text-sm text-gray-600">
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Visa Application Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p className="text-gray-500">Loading progress...</p>
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Notifications</CardTitle>
          <Link href="/notifications">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingNotifications ? (
              // Loading skeleton
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
            ) : sortedNotifications?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No notifications yet</div>
            ) : (
              sortedNotifications?.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0 ${
                    !notification.read ? "bg-blue-50/30 -mx-6 px-6" : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      notification.priority === "High"
                        ? "bg-red-500"
                        : notification.priority === "Medium"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{notification.title || notification.message}</p>
                      <StatusBadge
                        status={
                          notification.type === "Document"
                            ? "Approved"
                            : notification.type === "Visa"
                              ? "In Progress"
                              : "Completed"
                        }
                        className="ml-2"
                      />
                    </div>
                    {notification.title && <p className="text-sm text-gray-600 mt-1">{notification.message}</p>}
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                        {notification.priority} Priority
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
