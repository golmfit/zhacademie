"use client"

import { useState, useEffect, useMemo } from "react"
import { useCollection } from "@/hooks/use-firestore"
import {
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  where,
  query,
  getDocs,
  writeBatch,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { StudentModal } from "@/components/modals/StudentModal"

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [bulkAdvisor, setBulkAdvisor] = useState<string | null>(null)
  const [notifyStudent, setNotifyStudent] = useState<{ id: string; email: string } | null>(null)
  const [notifyMessage, setNotifyMessage] = useState("")
  const [advisorFilter, setAdvisorFilter] = useState<string | null>(null)

  // Fetch active students
  const {
    data: activeStudents,
    loading: loadingActive,
    error: activeError,
  } = useCollection("students", [where("verified", "==", true)])

  // Fetch pending students
  const { data: pendingStudents, loading: loadingPending, error: pendingError } = useCollection("registrationQueue", [])

  const filteredStudents = useMemo(() => {
    let filtered = activeStudents || []

    // Filter out inactive students
    filtered = filtered.filter((student) => student.active !== false)

    // Apply advisor filter
    if (advisorFilter) {
      filtered = filtered.filter((student) => student.advisorId === advisorFilter)
    }

    return filtered
  }, [activeStudents, advisorFilter])

  useEffect(() => {
    if (activeError) {
      setError("Error loading active students: " + activeError.message)
    } else if (pendingError) {
      setError("Error loading pending students: " + pendingError.message)
    } else {
      setError(null)
    }
  }, [activeError, pendingError])

  const handleViewStudent = (studentId: string) => {
    setSelectedStudent(studentId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStudent(null)
  }

  const handlePaymentStatusChange = async (studentId: string, status: string) => {
    try {
      setIsProcessing((prev) => ({ ...prev, [studentId]: true }))
      const docRef = doc(db, "registrationQueue", studentId)
      await setDoc(docRef, { paymentStatus: status }, { merge: true })
    } catch (err: any) {
      console.error("Error updating payment status:", err)
      setError(`Failed to update payment status: ${err.message}`)
    } finally {
      setIsProcessing((prev) => ({ ...prev, [studentId]: false }))
    }
  }

  const handleApproveStudent = async (studentId: string) => {
    try {
      setIsProcessing((prev) => ({ ...prev, [studentId]: true }))

      // Get student data from registrationQueue
      const studentRef = doc(db, "registrationQueue", studentId)
      const studentSnap = await getDocs(query(collection(db, "registrationQueue"), where("__name__", "==", studentId)))

      if (studentSnap.empty) {
        throw new Error("Student not found in registration queue")
      }

      const studentData = studentSnap.docs[0].data()

      // Check if payment is verified
      if (studentData.paymentStatus !== "received") {
        throw new Error("Payment must be verified before approving student")
      }

      // Create batch write
      const batch = writeBatch(db)

      // Add to students collection
      const newStudentRef = doc(db, "students", studentId)
      batch.set(newStudentRef, {
        ...studentData,
        verified: true,
        appStatus: "Not Started",
        visaStage: "Not Started",
        lastActivity: serverTimestamp(),
      })

      // Delete from registrationQueue
      batch.delete(studentRef)

      // Commit the batch
      await batch.commit()
    } catch (err: any) {
      console.error("Error approving student:", err)
      setError(`Failed to approve student: ${err.message}`)
    } finally {
      setIsProcessing((prev) => ({ ...prev, [studentId]: false }))
    }
  }

  const handleRejectStudent = async (studentId: string) => {
    try {
      setIsProcessing((prev) => ({ ...prev, [studentId]: true }))
      await deleteDoc(doc(db, "registrationQueue", studentId))
    } catch (err: any) {
      console.error("Error rejecting student:", err)
      setError(`Failed to reject student: ${err.message}`)
    } finally {
      setIsProcessing((prev) => ({ ...prev, [studentId]: false }))
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const handleAssignAdvisor = async (studentId: string, advisorId: string) => {
    try {
      setIsProcessing((prev) => ({ ...prev, [studentId]: true }))
      const studentRef = doc(db, "students", studentId)
      await updateDoc(studentRef, {
        advisorId,
        lastUpdated: serverTimestamp(),
      })
    } catch (err: any) {
      console.error("Error assigning advisor:", err)
      setError(`Failed to assign advisor: ${err.message}`)
    } finally {
      setIsProcessing((prev) => ({ ...prev, [studentId]: false }))
    }
  }

  const handleBulkAssignAdvisor = async () => {
    if (!bulkAdvisor || selectedStudents.length === 0) return

    try {
      const batch = writeBatch(db)

      selectedStudents.forEach((studentId) => {
        const studentRef = doc(db, "students", studentId)
        batch.update(studentRef, {
          advisorId: bulkAdvisor,
          lastUpdated: serverTimestamp(),
        })
      })

      await batch.commit()
      setSelectedStudents([])
      setBulkAdvisor(null)
    } catch (err: any) {
      console.error("Error bulk assigning advisor:", err)
      setError(`Failed to bulk assign advisor: ${err.message}`)
    }
  }

  const handleDeactivateStudents = async () => {
    if (selectedStudents.length === 0) return

    try {
      const batch = writeBatch(db)

      selectedStudents.forEach((studentId) => {
        const studentRef = doc(db, "students", studentId)
        batch.update(studentRef, {
          active: false,
          lastUpdated: serverTimestamp(),
        })
      })

      await batch.commit()
      setSelectedStudents([])
    } catch (err: any) {
      console.error("Error deactivating students:", err)
      setError(`Failed to deactivate students: ${err.message}`)
    }
  }

  const handleNotifyStudent = (student: { id: string; email: string }) => {
    setNotifyStudent(student)
  }

  const handleSendNotification = async () => {
    if (!notifyStudent || !notifyMessage) return

    try {
      // Open mailto link
      window.open(
        `mailto:${notifyStudent.email}?subject=ZHAcademie Notification&body=${encodeURIComponent(notifyMessage)}`,
        "_blank",
      )

      // Create notification in Firestore
      const notificationRef = doc(collection(db, "notifications"))
      await setDoc(notificationRef, {
        userId: notifyStudent.id,
        message: notifyMessage,
        type: "Admin",
        priority: "High",
        createdAt: serverTimestamp(),
        read: false,
      })

      // Reset state
      setNotifyStudent(null)
      setNotifyMessage("")
    } catch (err: any) {
      console.error("Error creating notification:", err)
      setError(`Failed to create notification: ${err.message}`)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Students</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allStudentIds = filteredStudents.map((student) => student.id)
                      setSelectedStudents(allStudentIds)
                    }}
                  >
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
                    Deselect All
                  </Button>
                  {selectedStudents.length > 0 && (
                    <>
                      <div className="h-6 w-px bg-gray-300" />
                      <Button variant="destructive" size="sm" onClick={handleDeactivateStudents}>
                        Deactivate ({selectedStudents.length})
                      </Button>
                      <div className="h-6 w-px bg-gray-300" />
                    </>
                  )}
                  <Select value={bulkAdvisor || ""} onValueChange={setBulkAdvisor}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Bulk Assign Advisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zakariya">Zakariya</SelectItem>
                      <SelectItem value="second-admin">Second Admin</SelectItem>
                      <SelectItem value="third-admin">Third Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="default" size="sm" onClick={handleBulkAssignAdvisor}>
                    Apply
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={advisorFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter(null)}
                  >
                    All
                  </Button>
                  <Button
                    variant={advisorFilter === "zakariya" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter("zakariya")}
                  >
                    Zakariya
                  </Button>
                  <Button
                    variant={advisorFilter === "second-admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter("second-admin")}
                  >
                    Second Admin
                  </Button>
                  <Button
                    variant={advisorFilter === "third-admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter("third-admin")}
                  >
                    Third Admin
                  </Button>
                </div>
              </div>

              {loadingActive ? (
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
                      <TableHead>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          onChange={(e) => {
                            if (e.target.checked) {
                              const allStudentIds = filteredStudents.map((student) => student.id)
                              setSelectedStudents(allStudentIds)
                            } else {
                              setSelectedStudents([])
                            }
                          }}
                          checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                          disabled={filteredStudents.length === 0}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>App Status</TableHead>
                      <TableHead className="sticky top-0 bg-white z-10">Assigned Admin</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No active students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              value={student.id}
                              checked={selectedStudents.includes(student.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudents([...selectedStudents, student.id])
                                } else {
                                  setSelectedStudents(selectedStudents.filter((id) => id !== student.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{student.fullName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.country}</TableCell>
                          <TableCell>
                            <StatusBadge status="Approved" />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={student.appStatus || "Not Started"} />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={student.advisorId || ""}
                              onValueChange={(value) => handleAssignAdvisor(student.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="zakariya">Zakariya</SelectItem>
                                <SelectItem value="second-admin">Second Admin</SelectItem>
                                <SelectItem value="third-admin">Third Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleNotifyStudent({ id: student.id, email: student.email })}
                              >
                                Notify
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Students</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPending ? (
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Payment Reference</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No pending students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.fullName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.country}</TableCell>
                          <TableCell>{student.paymentReference}</TableCell>
                          <TableCell>
                            <Select
                              defaultValue={student.paymentStatus}
                              onValueChange={(value) => handlePaymentStatusChange(student.id, value)}
                              disabled={isProcessing[student.id]}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unverified">Unverified</SelectItem>
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{formatDate(student.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveStudent(student.id)}
                                disabled={student.paymentStatus !== "received" || isProcessing[student.id]}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectStudent(student.id)}
                                disabled={isProcessing[student.id]}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedStudent && <StudentModal isOpen={isModalOpen} onClose={handleCloseModal} studentId={selectedStudent} />}

      {notifyStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Notify Student</h2>
            <p className="mb-2 text-gray-700">
              Send notification to: <span className="font-medium">{notifyStudent.email}</span>
            </p>
            <div className="mt-4">
              <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Message:
              </label>
              <textarea
                id="notificationMessage"
                className="w-full min-h-[120px] px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Enter your message here..."
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setNotifyStudent(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendNotification}
                className="bg-navy text-white hover:bg-navy/90"
                style={{ backgroundColor: "#0a192f" }}
                disabled={!notifyMessage.trim()}
              >
                Send Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
