"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
  collectionGroup,
  query,
  getDoc,
} from "firebase/firestore"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { CheckCircle, XCircle, Download, Search, FileText, File, FileQuestion, Eye, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

const AdminDocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [studentFilter, setStudentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [studentMap, setStudentMap] = useState({}) // Map to store student names by ID
  const [documentTypes, setDocumentTypes] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [documentToReject, setDocumentToReject] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  // Fetch all students to get their names
  useEffect(() => {
    const studentsRef = collection(db, "students")

    const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
      const studentData = {}
      snapshot.docs.forEach((doc) => {
        studentData[doc.id] = doc.data().fullName || "Unknown Student"
      })
      setStudentMap(studentData)
    })

    return () => unsubscribe()
  }, [])

  // Use collectionGroup to listen to all documents across all students
  // Removed the orderBy to avoid the index requirement
  useEffect(() => {
    const documentsQuery = query(collectionGroup(db, "documents"))

    const unsubscribe = onSnapshot(
      documentsQuery,
      (snapshot) => {
        const allDocs = snapshot.docs.map((doc) => {
          // Extract the studentId from the document path
          const pathSegments = doc.ref.path.split("/")
          const studentId = pathSegments[pathSegments.indexOf("students") + 1]

          return {
            id: doc.id,
            studentId,
            studentName: studentMap[studentId] || "Unknown Student",
            ...doc.data(),
          }
        })

        // Sort documents by uploadedAt in memory instead of in the query
        const sortedDocs = [...allDocs].sort((a, b) => {
          const timeA = a.uploadedAt
            ? a.uploadedAt.seconds
              ? a.uploadedAt.seconds
              : new Date(a.uploadedAt).getTime() / 1000
            : 0
          const timeB = b.uploadedAt
            ? b.uploadedAt.seconds
              ? b.uploadedAt.seconds
              : new Date(b.uploadedAt).getTime() / 1000
            : 0
          return timeB - timeA // Descending order (newest first)
        })

        // Extract unique document types
        const types = Array.from(new Set(sortedDocs.map((doc) => doc.type))).filter(Boolean)
        setDocumentTypes(types)

        // Update stats
        setStats({
          total: sortedDocs.length,
          pending: sortedDocs.filter((doc) => doc.status === "Pending").length,
          approved: sortedDocs.filter((doc) => doc.status === "Approved").length,
          rejected: sortedDocs.filter((doc) => doc.status === "Rejected").length,
        })

        setDocuments(sortedDocs)

        // Apply filters based on the active tab and other filter criteria
        applyFilters(sortedDocs, activeTab)

        setLoading(false)
      },
      (error) => {
        console.error("Error fetching documents:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [studentMap, activeTab]) // Re-run when studentMap or activeTab changes

  // Apply all filters to the documents
  const applyFilters = (docs, tabStatus) => {
    let results = [...docs]

    // First apply the tab-based status filter
    if (tabStatus !== "all") {
      results = results.filter((doc) => doc.status === tabStatus)
    }

    // Then apply other filters
    if (searchQuery) {
      results = results.filter(
        (doc) =>
          (doc.studentName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (doc.type?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (doc.fileName?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all" && tabStatus === "all") {
      // Only apply statusFilter if we're on the "all" tab
      results = results.filter((doc) => doc.status === statusFilter)
    }

    if (typeFilter !== "all") {
      results = results.filter((doc) => doc.type === typeFilter)
    }

    if (studentFilter !== "all") {
      results = results.filter((doc) => doc.studentId === studentFilter)
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filterDate.setHours(0, 0, 0, 0)
      const nextDay = new Date(filterDate)
      nextDay.setDate(nextDay.getDate() + 1)

      results = results.filter((doc) => {
        if (!doc.uploadedAt) return false
        const uploadDate = doc.uploadedAt.toDate ? doc.uploadedAt.toDate() : new Date(doc.uploadedAt)
        return uploadDate >= filterDate && uploadDate < nextDay
      })
    }

    setFilteredDocuments(results)
  }

  // Re-apply filters when any filter criteria changes
  useEffect(() => {
    if (documents.length > 0) {
      applyFilters(documents, activeTab)
    }
  }, [searchQuery, statusFilter, typeFilter, studentFilter, dateFilter, documents, activeTab])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)

    // Reset other filters when changing tabs
    if (value !== "all") {
      setStatusFilter("all") // Reset status filter as it's now controlled by the tab
    }
  }

  const handleStatusChange = async (documentId, studentId, newStatus) => {
    try {
      // Get document data to include in notification
      const docRef = doc(db, `students/${studentId}/documents`, documentId)
      const docSnap = await getDoc(docRef)
      const docData = docSnap.exists() ? docSnap.data() : { type: documentId }
      const documentType = docData.type || documentId

      // Update the document status in Firestore
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === "Rejected" && rejectionReason ? { rejectionReason } : {}),
      })

      // Add to activity log
      const activityRef = doc(collection(db, `students/${studentId}/activity`))
      await setDoc(activityRef, {
        type: "Document",
        action: newStatus === "Approved" ? "Approved" : "Rejected",
        detail: documentType,
        timestamp: serverTimestamp(),
      })

      // Create notification for the student
      const notificationRef = doc(collection(db, "notifications"))
      await setDoc(notificationRef, {
        userId: studentId,
        type: "Document",
        title: `Document ${newStatus}`,
        message: `Your ${documentType} has been ${newStatus.toLowerCase()}.${
          newStatus === "Rejected" && rejectionReason ? ` Reason: ${rejectionReason}` : ""
        }`,
        priority: "Medium",
        read: false,
        createdAt: serverTimestamp(),
      })

      // Reset rejection reason if applicable
      if (newStatus === "Rejected") {
        setRejectionReason("")
        setIsRejectDialogOpen(false)
        setDocumentToReject(null)
      }

      // No need to update local state as the listener will handle it
    } catch (error) {
      console.error("Error updating document status:", error)
    }
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)

    // If we're setting a status filter, switch to the "all" tab
    // to avoid confusion with tab-based filtering
    if (status !== "all" && activeTab !== "all") {
      setActiveTab("all")
    }
  }

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type)
  }

  const handleStudentFilterChange = (studentId) => {
    setStudentFilter(studentId)
  }

  const handleDateFilterChange = (date) => {
    setDateFilter(date)
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleRejectDocument = (document) => {
    setDocumentToReject(document)
    setIsRejectDialogOpen(true)
  }

  const clearAllFilters = () => {
    setTypeFilter("all")
    setStudentFilter("all")
    setDateFilter(null)
    setSearchQuery("")

    // Don't reset statusFilter if we're on a specific tab
    if (activeTab === "all") {
      setStatusFilter("all")
    }
  }

  // Helper function to format Firestore timestamps
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"

    // Check if it's a Firestore timestamp with seconds and nanoseconds
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString()
    }

    // Handle string dates or Date objects
    try {
      return new Date(timestamp).toLocaleString()
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FileQuestion className="h-5 w-5 text-gray-500" />

    if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else if (fileType.includes("image") || fileType.includes("jpg") || fileType.includes("png")) {
      return <FileText className="h-5 w-5 text-green-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  // Render document details view
  const renderDocumentDetails = (document) => {
    if (!document) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center">
          {getFileIcon(document.fileType)}
          <div className="ml-3">
            <h3 className="text-lg font-medium">{document.type}</h3>
            <p className="text-sm text-gray-500">{document.fileName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <StatusBadge status={document.status || "Pending"} className="mt-1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Uploaded</p>
            <p className="text-sm">{formatDate(document.uploadedAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Student</p>
            <p className="text-sm">{document.studentName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">File Size</p>
            <p className="text-sm">{formatFileSize(document.fileSize)}</p>
          </div>
        </div>

        {document.description && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-sm mt-1">{document.description}</p>
          </div>
        )}

        {document.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
            <p className="text-sm font-medium text-red-800">Rejection Reason</p>
            <p className="text-sm text-red-700 mt-1">{document.rejectionReason}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => window.open(document.url, "_blank")}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          {document.status === "Pending" && (
            <>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  setIsViewDialogOpen(false)
                  handleRejectDocument(document)
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                className="text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
                onClick={() => handleStatusChange(document.id, document.studentId, "Approved")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Render document table
  const renderDocumentTable = () => {
    return (
      <Table>
        <TableCaption>A list of student documents.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                No documents found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            filteredDocuments.map((document) => (
              <TableRow key={`${document.studentId}-${document.id}`}>
                <TableCell>
                  <div className="flex items-center">
                    {getFileIcon(document.fileType)}
                    <div className="ml-3">
                      <div className="font-medium">{document.type}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{document.fileName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{document.studentName}</TableCell>
                <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={document.status || "Pending"} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDocument(document)} title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(document.url, "_blank")}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {document.status === "Pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectDocument(document)}
                          title="Reject"
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(document.id, document.studentId, "Approved")}
                          title="Approve"
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-5">Documents</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading documents...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Document Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="Pending">Pending Review ({stats.pending})</TabsTrigger>
          <TabsTrigger value="Approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected ({stats.rejected})</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {/* Filter controls - only show on "all" tab */}
          {activeTab === "all" && (
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-5">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={studentFilter} onValueChange={handleStudentFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {Object.entries(studentMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={handleDateFilterChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {(typeFilter !== "all" ||
                studentFilter !== "all" ||
                dateFilter ||
                searchQuery ||
                statusFilter !== "all") && (
                <Button variant="ghost" onClick={clearAllFilters} className="px-2">
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Search box for non-all tabs */}
          {activeTab !== "all" && (
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-5">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()} documents...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>

              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={studentFilter} onValueChange={handleStudentFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {Object.entries(studentMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(typeFilter !== "all" || studentFilter !== "all" || searchQuery) && (
                <Button variant="ghost" onClick={clearAllFilters} className="px-2">
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Status message */}
          <div className="text-sm text-gray-500 mb-4">
            {activeTab === "all" && `Showing ${filteredDocuments.length} of ${documents.length} documents`}
            {activeTab === "Pending" &&
              `Showing ${filteredDocuments.length} of ${stats.pending} pending documents that require review`}
            {activeTab === "Approved" && `Showing ${filteredDocuments.length} of ${stats.approved} approved documents`}
            {activeTab === "Rejected" && `Showing ${filteredDocuments.length} of ${stats.rejected} rejected documents`}
          </div>

          {/* Document table */}
          <ScrollArea className="h-[calc(100vh-400px)]">{renderDocumentTable()}</ScrollArea>
        </div>
      </Tabs>

      {/* Document View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {renderDocumentDetails(selectedDocument)}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document. This will be visible to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g., Document is not clearly visible, missing information, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                documentToReject && handleStatusChange(documentToReject.id, documentToReject.studentId, "Rejected")
              }
              disabled={!rejectionReason.trim()}
            >
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDocumentsPage
