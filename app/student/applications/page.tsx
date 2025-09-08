"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

// Mock applications data
const mockApplications = [
  {
    id: "app1",
    university: "Harvard University",
    program: "Master of Computer Science",
    deadline: "2023-12-15T00:00:00Z",
    status: "In Progress",
    submittedDate: null,
  },
  {
    id: "app2",
    university: "Stanford University",
    program: "Master of Business Administration",
    deadline: "2023-11-30T00:00:00Z",
    status: "Completed",
    submittedDate: "2023-10-25T14:30:00Z",
  },
  {
    id: "app3",
    university: "MIT",
    program: "Master of Engineering",
    deadline: "2024-01-05T00:00:00Z",
    status: "Not Started",
    submittedDate: null,
  },
  {
    id: "app4",
    university: "University of California, Berkeley",
    program: "PhD in Computer Science",
    deadline: "2023-12-01T00:00:00Z",
    status: "In Progress",
    submittedDate: null,
  },
]

export default function ApplicationsPage() {
  // Replace the mock data and useEffect with real-time Firestore listener
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  // This fetches data from Firebase in real-time
  useEffect(() => {
    if (!user?.uid) return

    // Set up real-time listener for applications
    const applicationsRef = collection(db, `students/${user.uid}/applications`)
    const unsubscribe = onSnapshot(
      applicationsRef,
      (snapshot) => {
        const appData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setApplications(appData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching applications:", error)
        setLoading(false)
        // Fallback to mock data if there's an error
        setApplications(mockApplications)
      },
    )

    return () => unsubscribe()
  }, [user?.uid])

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
          <CardTitle>Your Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No applications found. Your advisor will add applications for you.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => {
                    const daysRemaining = getDaysRemaining(app.deadline)
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.university}</TableCell>
                        <TableCell>{app.program}</TableCell>
                        <TableCell>
                          <div>{formatDate(app.deadline)}</div>
                          {app.status !== "Completed" && (
                            <div
                              className={`text-xs mt-1 ${daysRemaining < 7 ? "text-red-600 font-medium" : "text-gray-500"}`}
                            >
                              {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed"}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.status as any} />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
