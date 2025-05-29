"use client"

import { useState, useEffect } from "react"
import { useCollection } from "@/hooks/use-firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, GraduationCap, Eye } from "lucide-react"

// Mock applications data
const mockApplications = [
  {
    id: "app1",
    studentId: "stud1",
    studentName: "John Smith",
    university: "Harvard University",
    program: "Master of Computer Science",
    deadline: "2023-12-15T00:00:00Z",
    status: "In Progress",
    submittedDate: null,
  },
  {
    id: "app2",
    studentId: "stud1",
    studentName: "John Smith",
    university: "Stanford University",
    program: "Master of Business Administration",
    deadline: "2023-11-30T00:00:00Z",
    status: "Completed",
    submittedDate: "2023-10-25T14:30:00Z",
  },
  {
    id: "app3",
    studentId: "stud2",
    studentName: "Maria Garcia",
    university: "MIT",
    program: "Master of Engineering",
    deadline: "2024-01-05T00:00:00Z",
    status: "Not Started",
    submittedDate: null,
  },
  {
    id: "app4",
    studentId: "stud3",
    studentName: "Wei Chen",
    university: "University of California, Berkeley",
    program: "PhD in Computer Science",
    deadline: "2023-12-01T00:00:00Z",
    status: "In Progress",
    submittedDate: null,
  },
]

export default function AdminApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredApplications, setFilteredApplications] = useState(mockApplications)

  // In a real app, this would use collectionGroup to query all student applications
  const { data: applications, loading } = useCollection("applications")

  // Use mock data if no applications in Firestore
  const displayApplications = applications?.length > 0 ? applications : mockApplications

  useEffect(() => {
    const filtered = displayApplications.filter(
      (app) =>
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.program.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredApplications(filtered)
  }, [searchQuery, displayApplications])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">University Applications</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Student Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by student, university, or program..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-[300px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((app) => {
                const daysRemaining = getDaysRemaining(app.deadline)
                return (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{app.university}</h3>
                          <p className="text-sm text-gray-600">{app.program}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="text-gray-500">Student:</span> {app.studentName}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Deadline:</span> {formatDate(app.deadline)}
                              {app.status !== "Completed" && (
                                <span
                                  className={`ml-2 text-xs ${daysRemaining < 7 ? "text-red-600 font-medium" : "text-gray-500"}`}
                                >
                                  ({daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed"})
                                </span>
                              )}
                            </p>
                            {app.submittedDate && (
                              <p className="text-sm">
                                <span className="text-gray-500">Submitted:</span> {formatDate(app.submittedDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <StatusBadge status={app.status as any} />
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
