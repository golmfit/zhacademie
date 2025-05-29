"use client"

import React from "react"

import { useState, useEffect, useMemo, Suspense } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye, CheckCircle, XCircle, AlertCircle, UserCheck, Bell, UserX } from "lucide-react"
import { useVirtualizer } from "@tanstack/react-virtual"
import dynamic from "next/dynamic"

// Dynamically import the StudentModal component
const DynamicStudentModal = dynamic(
  () => import("@/components/modals/StudentModal").then((mod) => ({ default: mod.StudentModal })),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full max-w-[840px]" />
        </div>
      </div>
    ),
    ssr: false,
  },
)

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [advisorFilter, setAdvisorFilter] = useState<string | null>(null)
  const [bulkAdvisor, setBulkAdvisor] = useState<string | null>(null)
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false)
  const [notifyStudent, setNotifyStudent] = useState<any>(null)
  const [notifyMessage, setNotifyMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch active students
  const {
    data: activeStudents,
    loading: loadingActive,
    error: activeError,
  } = useCollection("students", [where("verified", "==", true)])

  // Fetch pending students
  const { data: pendingStudents, loading: loadingPending, error: pendingError } = useCollection("registrationQueue", [])

  useEffect(() => {
    if (activeError) {
      setError("Error loading active students: " + activeError.message)
    } else if (pendingError) {
      setError("Error loading pending students: " + pendingError.message)
    } else {
      setError(null)
    }
  }, [activeError, pendingError])

  // Memoize filtered students to prevent unnecessary re-renders
  const filteredStudents = useMemo(() => {
    if (!activeStudents) return []

    let filtered = [...activeStudents]

    // Apply advisor filter
    if (advisorFilter) {
      filtered = filtered.filter((student) => student.advisor === advisorFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (student) =>
          student.fullName?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.country?.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [activeStudents, advisorFilter, searchQuery])

  // Create virtualizer for active students table
  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: filteredStudents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Approximate height of a table row
    overscan: 10,
  })

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

  const handleSendNotification = async () => {
    if (!notifyStudent || !notifyMessage.trim()) return

    try {
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

      // Open email client
      window.open(
        `mailto:${notifyStudent.email}?subject=Important Message from ZHAcademie&body=${encodeURIComponent(notifyMessage)}`,
        "_blank",
      )

      setNotifyDialogOpen(false)
      setNotifyMessage("")
      setNotifyStudent(null)
    } catch (err: any) {
      console.error("Error sending notification:", err)
      setError(`Failed to send notification: ${err.message}`)
    }
  }

  const handleDeactivateStudent = async (studentId: string) => {
    try {
      setIsProcessing((prev) => ({ ...prev, [studentId]: true }))
      const studentRef = doc(db, "students", studentId)
      const studentDoc = activeStudents.find((s) => s.id === studentId)

      await updateDoc(studentRef, {
        active: studentDoc?.active === false ? true : false,
        lastUpdated: serverTimestamp(),
      })
    } catch (err: any) {
      console.error("Error deactivating student:", err)
      setError(`Failed to deactivate student: ${err.message}`)
    } finally {
      setIsProcessing((prev) => ({ ...prev, [studentId]: false }))
    }
  }

  const handleAssignAdvisor = async (studentId: string, advisor: string) => {
    try {
      setIsProcessing((prev) => ({ ...prev, [studentId]: true }))
      const studentRef = doc(db, "students", studentId)
      await updateDoc(studentRef, {
        advisor,
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
          advisor: bulkAdvisor,
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
              <div className="flex justify-between items-center">
                <CardTitle>Active Students</CardTitle>
                {selectedStudents.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select value={bulkAdvisor || ""} onValueChange={setBulkAdvisor}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select Advisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adv-1">Advisor 1</SelectItem>
                        <SelectItem value="Adv-2">Advisor 2</SelectItem>
                        <SelectItem value="Adv-3">Advisor 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAssignAdvisor} disabled={!bulkAdvisor} size="sm">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign Advisor
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="flex gap-2">
                  <Button
                    variant={advisorFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter(null)}
                  >
                    All
                  </Button>
                  <Button
                    variant={advisorFilter === "Adv-1" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter("Adv-1")}
                  >
                    Adv-1
                  </Button>
                  <Button
                    variant={advisorFilter === "Adv-2" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter("Adv-2")}
                  >
                    Adv-2
                  </Button>
                  <Button
                    variant={advisorFilter === "Adv-3" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdvisorFilter("Adv-3")}
                  >
                    Adv-3
                  </Button>
                </div>
                <div className="flex-1 sm:ml-auto">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full px-3 py-1 border rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                <div className="relative overflow-auto" style={{ height: "600px" }} ref={parentRef}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] sticky top-0 bg-white z-10">
                          <Checkbox
                            checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStudents(filteredStudents.map((s) => s.id))
                              } else {
                                setSelectedStudents([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead className="sticky top-0 bg-white z-10">Name</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10">Email</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10">Country</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10">Advisor</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10">Payment Status</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10">App Status</TableHead>
                        <TableHead className="sticky top-0 bg-white z-10 text-right">Actions</TableHead>
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
                        <div
                          style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                          }}
                        >
                          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const student = filteredStudents[virtualRow.index]
                            return (
                              <TableRow
                                key={student.id}
                                className={`absolute top-0 left-0 w-full ${student.active === false ? "bg-gray-50" : ""}`}
                                style={{
                                  height: virtualRow.size,
                                  transform: `translateY(${virtualRow.start}px)`,
                                }}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedStudents.includes(student.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedStudents((prev) => [...prev, student.id])
                                      } else {
                                        setSelectedStudents((prev) => prev.filter((id) => id !== student.id))
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{student.fullName}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.country}</TableCell>
                                <TableCell>
                                  <Select
                                    value={student.advisor || ""}
                                    onValueChange={(value) => handleAssignAdvisor(student.id, value)}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Assign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Adv-1">Advisor 1</SelectItem>
                                      <SelectItem value="Adv-2">Advisor 2</SelectItem>
                                      <SelectItem value="Adv-3">Advisor 3</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status="Approved" />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <StatusBadge status={student.appStatus || "Not Started"} />
                                    {student.active === false && (
                                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                        Inactive
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setNotifyStudent(student)
                                        setNotifyDialogOpen(true)
                                      }}
                                      title="Send Notification"
                                    >
                                      <Bell className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeactivateStudent(student.id)}
                                      title={student.active === false ? "Activate" : "Deactivate"}
                                      className={student.active === false ? "text-green-600" : "text-red-600"}
                                    >
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleViewStudent(student.id)}
                                      title="View Student"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </div>
                      )}
                    </TableBody>
                  </Table>
                </div>
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

      {/* Notification Dialog */}
      <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Send Notification to {notifyStudent?.fullName}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter your message here..."
            value={notifyMessage}
            onChange={(e) => setNotifyMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Use Suspense and dynamic import for the modal */}
      {selectedStudent && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-64 w-full max-w-[840px]" />
              </div>
            </div>
          }
        >
          <DynamicStudentModal isOpen={isModalOpen} onClose={handleCloseModal} studentId={selectedStudent} />
        </Suspense>
      )}
    </div>
  )
}
