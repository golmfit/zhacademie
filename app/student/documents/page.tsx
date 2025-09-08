"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useStorage } from "@/hooks/use-storage"
import { useCollection } from "@/hooks/use-firestore"
import { doc, setDoc, serverTimestamp, collection, where, query, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  Upload,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  type File,
  FilePlus,
  FileQuestion,
  FileX,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Document types that students need to upload
const documentTypes = [
  {
    id: "passport",
    name: "Passport",
    description: "Upload a clear scan of your passport's bio page",
    required: true,
  },
  {
    id: "transcript",
    name: "Academic Transcript",
    description: "Official transcript from your most recent educational institution",
    required: true,
  },
  {
    id: "bank",
    name: "Bank Statement",
    description: "Recent bank statement showing sufficient funds for your studies",
    required: true,
  },
  {
    id: "i20",
    name: "I-20 Form",
    description: "Form I-20 issued by your educational institution (if available)",
    required: false,
  },
  {
    id: "sevis",
    name: "SEVIS Fee Receipt",
    description: "Receipt of payment for the SEVIS fee",
    required: false,
  },
]

// Supported file types
const supportedFileTypes = [
  { extension: "pdf", type: "application/pdf", icon: <FileText className="h-5 w-5 text-red-500" /> },
  { extension: "doc", type: "application/msword", icon: <FileText className="h-5 w-5 text-blue-500" /> },
  {
    extension: "docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
  },
  { extension: "jpg", type: "image/jpeg", icon: <FileText className="h-5 w-5 text-green-500" /> },
  { extension: "jpeg", type: "image/jpeg", icon: <FileText className="h-5 w-5 text-green-500" /> },
  { extension: "png", type: "image/png", icon: <FileText className="h-5 w-5 text-green-500" /> },
]

export default function DocumentsPage() {
  const { user, userData } = useAuth()
  const { uploadFile, isUploading, uploadProgress } = useStorage()
  const [error, setError] = useState<string | null>(null)
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)
  const fileInputRefs = useRef({})
  const [activeTab, setActiveTab] = useState("required")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [customDocumentData, setCustomDocumentData] = useState({
    name: "",
    description: "",
    fileType: "pdf",
  })
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [allDocuments, setAllDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])

  // Fetch student's documents from Firestore with real-time updates
  const { data: documents, loading } = useCollection(
    `students/${user?.uid}/documents`,
    user?.uid ? [] : [where("__nonExistentField__", "==", true)],
  )

  // Fetch requested documents with real-time updates
  const { data: requestedDocuments, loading: loadingRequested } = useCollection(
    `students/${user?.uid}/documentsRequested`,
    user?.uid ? [] : [where("__nonExistentField__", "==", true)],
  )

  // Set up real-time listener for all documents
  useEffect(() => {
    if (!user?.uid) return

    const q = query(collection(db, `students/${user.uid}/documents`))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setAllDocuments(docs)
      setFilteredDocuments(docs)
    })

    return () => unsubscribe()
  }, [user?.uid])

  // Filter documents based on search query and status filter
  useEffect(() => {
    if (!allDocuments.length) return

    let filtered = [...allDocuments]

    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          (doc.type?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (doc.fileName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (doc.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter)
    }

    setFilteredDocuments(filtered)
  }, [searchQuery, statusFilter, allDocuments])

  const handleFileSelect = async (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user?.uid) return

    setError(null)
    setUploadingDocId(docType)

    try {
      // Upload file to Firebase Storage
      const filePath = `students/${user.uid}/documents/${docType}_${Date.now()}.${file.name.split(".").pop()}`
      const downloadUrl = await uploadFile(file, filePath)

      // Add document record to Firestore
      const docRef = doc(collection(db, `students/${user.uid}/documents`), docType)
      await setDoc(
        docRef,
        {
          type: documentTypes.find((d) => d.id === docType)?.name || docType,
          url: downloadUrl,
          status: "Pending",
          fileName: file.name,
          filePath: filePath,
          fileType: file.type,
          fileSize: file.size,
          uploadedAt: serverTimestamp(),
        },
        { merge: true },
      )

      // Reset file input
      if (fileInputRefs.current[docType]) {
        fileInputRefs.current[docType].value = ""
      }
    } catch (err: any) {
      console.error("Error uploading document:", err)
      setError(`Failed to upload document: ${err.message}`)
    } finally {
      setUploadingDocId(null)
    }
  }

  const handleCustomDocumentUpload = async () => {
    if (!customFile || !user?.uid || !customDocumentData.name) {
      setError("Please provide a document name and select a file")
      return
    }

    setError(null)
    setUploadingDocId("custom")

    try {
      // Generate a unique ID for the custom document
      const customDocId = `custom-${Date.now()}`

      // Upload file to Firebase Storage
      const fileExtension = customFile.name.split(".").pop()
      const filePath = `students/${user.uid}/documents/${customDocId}.${fileExtension}`
      const downloadUrl = await uploadFile(customFile, filePath)

      // Add document record to Firestore
      const docRef = doc(collection(db, `students/${user.uid}/documents`), customDocId)
      await setDoc(docRef, {
        type: customDocumentData.name,
        description: customDocumentData.description,
        url: downloadUrl,
        status: "Pending",
        fileName: customFile.name,
        filePath: filePath,
        fileType: customFile.type,
        fileSize: customFile.size,
        isCustom: true,
        uploadedAt: serverTimestamp(),
      })

      // Reset form
      setCustomDocumentData({
        name: "",
        description: "",
        fileType: "pdf",
      })
      setCustomFile(null)
      setIsUploadDialogOpen(false)
    } catch (err: any) {
      console.error("Error uploading custom document:", err)
      setError(`Failed to upload document: ${err.message}`)
    } finally {
      setUploadingDocId(null)
    }
  }

  // Get document data for a specific document type
  const getDocumentData = (docType: string) => {
    const doc = documents?.find((d) => d.id === docType)
    if (!doc) return null

    return {
      name: doc.fileName || `${doc.type}.pdf`,
      url: doc.url,
      status: doc.status,
    }
  }

  // Check if a document has been requested but not uploaded
  const isDocumentRequested = (docType: string) => {
    if (!requestedDocuments) return false

    // Check if document is requested
    const isRequested = requestedDocuments.some(
      (doc) => doc.type === docType && !documents?.some((d) => d.id === docType),
    )

    return isRequested
  }

  // Trigger file input click
  const triggerFileInput = (docType: string) => {
    if (fileInputRefs.current[docType]) {
      fileInputRefs.current[docType].click()
    }
  }

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    const fileTypeInfo = supportedFileTypes.find((type) => type.type === fileType)
    return fileTypeInfo?.icon || <FileQuestion className="h-5 w-5 text-gray-500" />
  }

  // Render document item with upload button
  const renderDocumentItem = (docType: { id: string; name: string; description: string; required: boolean }) => {
    const docData = getDocumentData(docType.id)
    const isUploading = uploadingDocId === docType.id
    const isRequested = isDocumentRequested(docType.id)

    return (
      <Card key={docType.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                {docType.name}
                {docType.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{docType.description}</p>
            </div>
            {docData && <StatusBadge status={docData.status as any} />}
            {isRequested && !docData && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Needed</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {docData ? (
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate max-w-[200px]">{docData.name}</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No file uploaded</div>
              )}

              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2 w-full" />
                  <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {docData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(docData.url, "_blank")}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}

              <input
                type="file"
                id={`file-${docType.id}`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileSelect(docType.id, e)}
                ref={(el) => (fileInputRefs.current[docType.id] = el)}
              />
              <Button
                variant={docData ? "outline" : "default"}
                size="sm"
                onClick={() => triggerFileInput(docType.id)}
                disabled={isUploading}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-1" />
                {docData ? "Replace" : "Upload"}
              </Button>
            </div>
          </div>

          {docData?.status === "Approved" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">
                This document has been approved by your advisor. No further action is needed.
              </p>
            </div>
          )}

          {docData?.status === "Rejected" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-sm text-red-600">
                <strong>Reason for rejection:</strong> The document is not clearly visible or does not meet our
                requirements. Please upload a higher quality scan.
              </p>
            </div>
          )}

          {isRequested && !docData && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Document requested:</strong> Your advisor has requested this document. Please upload it as soon
                as possible.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Render all documents in a table format
  const renderAllDocumentsTable = () => {
    return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                  <DialogDescription>
                    Upload additional documents for your application. Supported formats: PDF, DOC, DOCX, JPG, PNG.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="docName">Document Name*</Label>
                    <Input
                      id="docName"
                      placeholder="e.g., Recommendation Letter"
                      value={customDocumentData.name}
                      onChange={(e) => setCustomDocumentData({ ...customDocumentData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="docDescription">Description (Optional)</Label>
                    <Input
                      id="docDescription"
                      placeholder="Brief description of this document"
                      value={customDocumentData.description}
                      onChange={(e) => setCustomDocumentData({ ...customDocumentData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="docFile">Select File*</Label>
                    <Input
                      id="docFile"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setCustomFile(e.target.files?.[0] || null)}
                    />
                    {customFile && (
                      <p className="text-xs text-gray-500">
                        Selected: {customFile.name} ({formatFileSize(customFile.size)})
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCustomDocumentUpload} disabled={!customFile || !customDocumentData.name}>
                    {uploadingDocId === "custom" ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Uploading...
                      </>
                    ) : (
                      <>Upload Document</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-10 border rounded-lg">
            <FileX className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery || statusFilter !== "all"
                ? "Try changing your search or filter criteria"
                : "Upload your first document to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                <FilePlus className="h-4 w-4 mr-2" />
                Upload New Document
              </Button>
            )}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(doc.fileType)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{doc.type}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{doc.fileName}</div>
                            {doc.fileSize && (
                              <div className="text-xs text-gray-400">{formatFileSize(doc.fileSize)}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(doc.uploadedAt)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={doc.status || "Pending"} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <input
                            type="file"
                            id={`file-replace-${doc.id}`}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileSelect(doc.id, e)}
                            ref={(el) => (fileInputRefs.current[`replace-${doc.id}`] = el)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => triggerFileInput(`replace-${doc.id}`)}
                            disabled={uploadingDocId === doc.id}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {filteredDocuments.filter((d) => d.status === "Approved").length} Approved
          </Badge>
          <Badge variant="outline" className="text-xs">
            {filteredDocuments.filter((d) => d.status === "Pending").length} Pending
          </Badge>
          <Badge variant="outline" className="text-xs">
            {filteredDocuments.filter((d) => d.status === "Rejected").length} Rejected
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="required" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="required">Required Documents</TabsTrigger>
          <TabsTrigger value="all">All Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="required" className="mt-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-9 w-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">F-1 Visa Documents</h2>
                {documentTypes.map((docType) => renderDocumentItem(docType))}
              </div>

              {/* Other Requested Documents Section */}
              {requestedDocuments &&
                requestedDocuments.filter(
                  (doc) => !documentTypes.some((type) => type.id === doc.type) && doc.type !== "Custom",
                ).length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Other Requested Documents</h2>
                    {requestedDocuments
                      .filter((doc) => !documentTypes.some((type) => type.id === doc.type) && doc.type !== "Custom")
                      .map((requestedDoc) => {
                        const docId = requestedDoc.type.toLowerCase().replace(/\s+/g, "-")
                        return renderDocumentItem({
                          id: docId,
                          name: requestedDoc.label || requestedDoc.type,
                          description: "Document requested by your advisor",
                          required: true,
                        })
                      })}
                  </div>
                )}

              {/* Custom Requested Documents Section */}
              {requestedDocuments && requestedDocuments.filter((doc) => doc.type === "Custom").length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Custom Requested Documents</h2>
                  {requestedDocuments
                    .filter((doc) => doc.type === "Custom")
                    .map((requestedDoc, index) => {
                      const docId = `custom-${index}-${requestedDoc.label.toLowerCase().replace(/\s+/g, "-")}`
                      return renderDocumentItem({
                        id: docId,
                        name: requestedDoc.label,
                        description: "Custom document requested by your advisor",
                        required: true,
                      })
                    })}
                </div>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            renderAllDocumentsTable()
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
