"use client"

import { useState, useCallback, useMemo } from "react"
import { useDocument, useCollection } from "@/hooks/use-firestore"
import { doc, setDoc, collection, serverTimestamp, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, MapPin, Calendar, GraduationCap, Clock, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useVirtualizer } from "@tanstack/react-virtual"
import dynamic from "next/dynamic"
import { VisaProgressTab } from "@/components/student-profile/VisaProgressTab"
import { AppProgressTab } from "@/components/student-profile/AppProgressTab"
import { useProgressMonitor } from "@/hooks/use-progress-monitor"
import { verifyAndFixAppStatus } from "@/lib/verify-app-status"

// Dynamically import heavy components
const ActivityLog = dynamic(() => import("@/components/student/ActivityLog"), {
  loading: () => <ActivityLogSkeleton />,
  ssr: false,
})

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
}

export function StudentModal({ isOpen, onClose, studentId }: StudentModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [showAppForm, setShowAppForm] = useState(false)
  const [editingAppId, setEditingAppId] = useState<string | null>(null)
  const [appFormData, setAppFormData] = useState({
    university: "",
    program: "",
    deadline: "",
    status: "In Progress",
  })
  const [docRequestOpen, setDocRequestOpen] = useState(false)
  const [docType, setDocType] = useState("Passport")
  const [customDocLabel, setCustomDocLabel] = useState("")
  const [isRequestingDoc, setIsRequestingDoc] = useState(false)

  // Fetch student data
  const { data: student, loading: loadingStudent } = useDocument(
    studentId.startsWith("pending") ? "registrationQueue" : "students",
    studentId.startsWith("pending") ? studentId.replace("pending-", "") : studentId,
  )

  // Fetch student's applications
  const { data: applications, loading: loadingApplications } = useCollection(
    `students/${studentId}/applications`,
    studentId.startsWith("pending") ? [] : [],
  )

  // Fetch student's documents
  const { data: documents, loading: loadingDocuments } = useCollection(
    `students/${studentId}/documents`,
    studentId.startsWith("pending") ? [] : [],
  )

  // Fetch student's notes
  const { data: notes, loading: loadingNotes } = useCollection(
    `students/${studentId}/notes`,
    studentId.startsWith("pending") ? [] : [],
  )

  // Fetch student's activity
  const { data: activity, loading: loadingActivity } = useCollection(
    `students/${studentId}/activity`,
    studentId.startsWith("pending") ? [] : [],
  )

  // Monitor progress changes and update app status
  useProgressMonitor(studentId.startsWith("pending") ? null : studentId)

  // Memoize the notes list to prevent unnecessary re-renders
  const sortedNotes = useMemo(() => {
    if (!notes) return []
    return [...notes].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
  }, [notes])

  // Create a virtualizer for notes
  const parentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null && sortedNotes.length > 0) {
        notesVirtualizer.setScrollElement(node)
      }
    },
    [sortedNotes.length],
  )

  const notesVirtualizer = useVirtualizer({
    count: sortedNotes.length,
    getScrollElement: () => null,
    estimateSize: () => 100,
    overscan: 5,
  })

  const handleAddNote = async () => {
    if (!newNote.trim() || !studentId) return

    setIsSubmittingNote(true)

    try {
      const noteRef = doc(collection(db, `students/${studentId}/notes`))
      await setDoc(noteRef, {
        content: newNote,
        createdBy: "Admin User", // In a real app, this would be the current admin's name
        createdAt: serverTimestamp(),
      })

      // Also add to activity log
      const activityRef = doc(collection(db, `students/${studentId}/activity`))
      await setDoc(activityRef, {
        type: "Note",
        action: "Added",
        detail: newNote.substring(0, 50) + (newNote.length > 50 ? "..." : ""),
        timestamp: serverTimestamp(),
      })

      setNewNote("")
    } catch (error) {
      console.error("Error adding note:", error)
    } finally {
      setIsSubmittingNote(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const handleRequestDocument = async () => {
    if (!studentId) return
    setIsRequestingDoc(true)

    try {
      const label = docType === "Custom" ? customDocLabel : docType

      // Create document request
      const requestRef = doc(collection(db, `students/${studentId}/documentsRequested`))
      await setDoc(requestRef, {
        type: docType,
        label,
        requestedAt: serverTimestamp(),
        status: "Pending",
      })

      // Create notification
      const notificationRef = doc(collection(db, "notifications"))
      await setDoc(notificationRef, {
        userId: studentId,
        title: `Document Request: ${label}`,
        message: `Your advisor has requested: ${label}. Please upload this document as soon as possible.`,
        type: "Document",
        priority: "High",
        createdAt: serverTimestamp(),
        read: false,
      })

      // Add to activity log
      const activityRef = doc(collection(db, `students/${studentId}/activity`))
      await setDoc(activityRef, {
        type: "Document",
        action: "Requested",
        detail: label,
        timestamp: serverTimestamp(),
      })

      // Update student's lastActivity
      await updateDoc(doc(db, "students", studentId), {
        lastActivity: serverTimestamp(),
      })

      setDocRequestOpen(false)
      setDocType("Passport")
      setCustomDocLabel("")
    } catch (error) {
      console.error("Error requesting document:", error)
    } finally {
      setIsRequestingDoc(false)
    }
  }

  const handleSaveApplication = async () => {
    if (!studentId) return

    try {
      const { university, program, deadline, status } = appFormData

      if (!university || !program || !deadline) {
        return // Validate required fields
      }

      const appData = {
        university,
        program,
        deadline: new Date(deadline).toISOString(),
        status,
        updatedAt: serverTimestamp(),
      }

      if (editingAppId) {
        // Update existing application
        await setDoc(doc(db, `students/${studentId}/applications`, editingAppId), appData, { merge: true })

        // Add to activity log
        const activityRef = doc(collection(db, `students/${studentId}/activity`))
        await setDoc(activityRef, {
          type: "Application",
          action: "Updated",
          detail: `${university} - ${program}`,
          timestamp: serverTimestamp(),
        })
      } else {
        // Create new application
        const newAppRef = doc(collection(db, `students/${studentId}/applications`))
        await setDoc(newAppRef, {
          ...appData,
          createdAt: serverTimestamp(),
        })

        // Add to activity log
        const activityRef = doc(collection(db, `students/${studentId}/activity`))
        await setDoc(activityRef, {
          type: "Application",
          action: "Added",
          detail: `${university} - ${program}`,
          timestamp: serverTimestamp(),
        })

        // Update student's lastActivity
        await updateDoc(doc(db, "students", studentId), {
          lastActivity: serverTimestamp(),
        })
      }

      // Reset form
      setAppFormData({
        university: "",
        program: "",
        deadline: "",
        status: "In Progress",
      })
      setShowAppForm(false)
      setEditingAppId(null)
    } catch (error) {
      console.error("Error saving application:", error)
    }
  }

  const handleDeleteApplication = async (appId: string) => {
    if (!studentId) return

    try {
      await deleteDoc(doc(db, `students/${studentId}/applications`, appId))
    } catch (error) {
      console.error("Error deleting application:", error)
    }
  }

  const handleEditApplication = (app: any) => {
    setAppFormData({
      university: app.university,
      program: app.program,
      deadline: new Date(app.deadline).toISOString().split("T")[0],
      status: app.status,
    })
    setEditingAppId(app.id)
    setShowAppForm(true)
  }

  const handleVerifyAppStatus = async () => {
    if (!studentId || studentId.startsWith("pending")) return

    try {
      const wasFixed = await verifyAndFixAppStatus(studentId)
      if (wasFixed) {
        // Optionally show a success message
        console.log("App status was fixed")
      } else {
        console.log("App status was already correct")
      }
    } catch (error) {
      console.error("Error verifying app status:", error)
    }
  }

  // Only load the content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab()
      case "applications":
        return renderApplicationsTab()
      case "documents":
        return renderDocumentsTab()
      case "appProgress":
        return renderAppProgressTab()
      case "visaProgress":
        return renderVisaProgressTab()
      case "notes":
        return renderNotesTab()
      case "activity":
        return renderActivityTab()
      default:
        return null
    }
  }

  const renderOverviewTab = () => (
    <TabsContent value="overview" className="mt-0">
      {loadingStudent ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-[200px] mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-[200px] mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-gray-600">{student?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{student?.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-gray-600">{student?.dob}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Country</p>
                    <p className="text-sm text-gray-600">{student?.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Application Status</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Assigned Advisor</p>
                    <p className="text-sm text-gray-600">{student?.advisorName || "Not assigned"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Payment Reference</p>
                    <p className="text-sm text-gray-600">{student?.paymentReference}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Application Status</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={student?.appStatus || "Not Started"} className="mt-1" />
                      <Button variant="outline" size="sm" onClick={handleVerifyAppStatus} className="mt-1 text-xs">
                        Verify Status
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Last Activity</p>
                    <p className="text-sm text-gray-600">{formatDateTime(student?.lastActivity)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </TabsContent>
  )

  const renderApplicationsTab = () => (
    <TabsContent value="applications" className="mt-0">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">University Applications</h3>
            <Button
              size="sm"
              onClick={() => {
                setShowAppForm(true)
                setEditingAppId(null)
                setAppFormData({
                  university: "",
                  program: "",
                  deadline: "",
                  status: "In Progress",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              University
            </Button>
          </div>

          {showAppForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-3">{editingAppId ? "Edit Application" : "Add New Application"}</h4>
              <div className="grid gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={appFormData.university}
                      onChange={(e) => setAppFormData({ ...appFormData, university: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="program">Program/Major</Label>
                    <Input
                      id="program"
                      value={appFormData.program}
                      onChange={(e) => setAppFormData({ ...appFormData, program: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={appFormData.deadline}
                      onChange={(e) => setAppFormData({ ...appFormData, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={appFormData.status}
                      onValueChange={(value) => setAppFormData({ ...appFormData, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAppForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveApplication}>{editingAppId ? "Update" : "Add"}</Button>
              </div>
            </div>
          )}

          {loadingApplications ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[300px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ))}
            </div>
          ) : applications?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No applications found</p>
          ) : (
            <div className="space-y-6">
              {applications?.map((app) => (
                <div key={app.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{app.university}</h4>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={app.status} />
                      <Button variant="ghost" size="icon" onClick={() => handleEditApplication(app)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteApplication(app.id)}
                        title="Delete"
                        className="text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{app.program}</p>
                  <p className="text-sm">
                    <span className="text-gray-500">Deadline:</span> {formatDate(app.deadline)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderDocumentsTab = () => (
    <TabsContent value="documents" className="mt-0">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Uploaded Documents</h3>
            <Popover open={docRequestOpen} onOpenChange={setDocRequestOpen}>
              <PopoverTrigger asChild>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Request Doc
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Request Document</h4>
                  <div className="space-y-2">
                    <Select defaultValue={docType} onValueChange={setDocType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Transcript">Academic Transcript</SelectItem>
                        <SelectItem value="Bank">Bank Statement</SelectItem>
                        <SelectItem value="Custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>

                    {docType === "Custom" && (
                      <Input
                        placeholder="Enter document name"
                        value={customDocLabel}
                        onChange={(e) => setCustomDocLabel(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setDocRequestOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRequestDocument} disabled={isRequestingDoc}>
                      {isRequestingDoc ? "Requesting..." : "Request"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {loadingDocuments ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[250px] mb-2" />
                  <Skeleton className="h-8 w-[120px]" />
                </div>
              ))}
            </div>
          ) : documents?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-6">
              {documents?.map((doc) => (
                <div key={doc.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{doc.type}</h4>
                    <StatusBadge status={doc.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Uploaded on {formatDateTime(doc.uploadedAt)}</p>
                  <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                    <FileText className="h-4 w-4 mr-1" />
                    View Document
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderAppProgressTab = () => (
    <TabsContent value="appProgress" className="mt-0">
      <AppProgressTab studentId={studentId} />
    </TabsContent>
  )

  const renderVisaProgressTab = () => (
    <TabsContent value="visaProgress" className="mt-0">
      <VisaProgressTab studentId={studentId} />
    </TabsContent>
  )

  const renderNotesTab = () => (
    <TabsContent value="notes" className="mt-0">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Advisor Notes</h3>

          <div className="mb-4">
            <Textarea
              placeholder="Add a new note about this student..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              className="mt-2 w-full sm:w-auto"
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSubmittingNote}
            >
              <Send className="h-4 w-4 mr-1" />
              {isSubmittingNote ? "Adding..." : "Add Note"}
            </Button>
          </div>

          {loadingNotes ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-[100px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notes added yet</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-auto" ref={parentRef}>
              <div
                style={{
                  height: `${notesVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {notesVirtualizer.getVirtualItems().map((virtualItem) => {
                  const note = sortedNotes[virtualItem.index]
                  return (
                    <div
                      key={note.id}
                      className="bg-gray-50 p-4 rounded-lg absolute top-0 left-0 w-full"
                      style={{
                        height: virtualItem.size,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <p className="text-sm mb-2">{note.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{note.createdBy}</span>
                        <span>{formatDateTime(note.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderActivityTab = () => (
    <TabsContent value="activity" className="mt-0">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
          {loadingActivity ? (
            <ActivityLogSkeleton />
          ) : (
            <ActivityLog activity={activity} formatDateTime={formatDateTime} />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[840px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Student Profile: {loadingStudent ? <Skeleton className="h-4 w-[200px] inline-block" /> : student?.fullName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="appProgress">App Progress</TabsTrigger>
            <TabsTrigger value="visaProgress">Visa Progress</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-2">{renderTabContent()}</div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function ActivityLogSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start">
          <Skeleton className="h-2 w-2 rounded-full mt-2 mr-3" />
          <div className="flex-1">
            <Skeleton className="h-4 w-[300px] mb-1" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
