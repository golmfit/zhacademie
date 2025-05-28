"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, collectionGroup, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Users, FileText, GraduationCap } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    totalDocuments: 0,
    totalApplications: 0,
  })
  const [pendingStudents, setPendingStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Array to store all unsubscribe functions
    const unsubscribers = []

    // 1. Total Students counter
    const studentsUnsubscribe = onSnapshot(
      collection(db, "students"),
      (snapshot) => {
        setStats((prev) => ({ ...prev, totalStudents: snapshot.size }))
      },
      (error) => {
        console.error("Error listening to students collection:", error)
      },
    )
    unsubscribers.push(studentsUnsubscribe)

    // 2. Pending Approvals counter and list
    const pendingUnsubscribe = onSnapshot(
      collection(db, "registrationQueue"),
      (snapshot) => {
        setStats((prev) => ({ ...prev, pendingApprovals: snapshot.size }))

        // Get the list of pending students
        const students = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPendingStudents(students)
      },
      (error) => {
        console.error("Error listening to registrationQueue collection:", error)
      },
    )
    unsubscribers.push(pendingUnsubscribe)

    // 3. Total Documents counter (using collectionGroup)
    const documentsUnsubscribe = onSnapshot(
      collectionGroup(db, "documents"),
      (snapshot) => {
        setStats((prev) => ({ ...prev, totalDocuments: snapshot.size }))
      },
      (error) => {
        console.error("Error listening to documents collection group:", error)
      },
    )
    unsubscribers.push(documentsUnsubscribe)

    // 4. Total Applications counter (using collectionGroup)
    const applicationsUnsubscribe = onSnapshot(
      collectionGroup(db, "applications"),
      (snapshot) => {
        setStats((prev) => ({ ...prev, totalApplications: snapshot.size }))
      },
      (error) => {
        console.error("Error listening to applications collection group:", error)
      },
    )
    unsubscribers.push(applicationsUnsubscribe)

    // Set loading to false once we've set up all listeners
    setIsLoading(false)

    // Clean up all listeners when component unmounts
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div> : stats.totalStudents}
              </div>
              <p className="text-xs text-gray-500">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.pendingApprovals
                )}
              </div>
              <p className="text-xs text-gray-500">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div> : stats.totalDocuments}
              </div>
              <p className="text-xs text-gray-500">Total uploaded documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.totalApplications
                )}
              </div>
              <p className="text-xs text-gray-500">University applications</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Students awaiting account approval</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : pendingStudents.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name || "N/A"}</TableCell>
                        <TableCell>{student.email || "N/A"}</TableCell>
                        <TableCell>{student.country || "N/A"}</TableCell>
                        <TableCell>{formatDate(student.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end">
                  <a
                    href="/students"
                    className="text-sm text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      window.location.href = "/students"
                    }}
                  >
                    Review and approve students →
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No pending approvals</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
