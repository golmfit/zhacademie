"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { CheckCircle, XCircle, FileText, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock documents data
const mockDocuments = [
  {
    id: "doc1",
    studentId: "stud1",
    studentName: "John Smith",
    type: "Passport",
    url: "#",
    status: "Pending",
    uploadedAt: "2023-06-01T10:15:00Z",
  },
  {
    id: "doc2",
    studentId: "stud1",
    studentName: "John Smith",
    type: "Transcript",
    url: "#",
    status: "Approved",
    uploadedAt: "2023-06-02T14:30:00Z",
  },
  {
    id: "doc3",
    studentId: "stud2",
    studentName: "Maria Garcia",
    type: "Passport",
    url: "#",
    status: "Approved",
    uploadedAt: "2023-06-03T09:45:00Z",
  },
  {
    id: "doc4",
    studentId: "stud2",
    studentName: "Maria Garcia",
    type: "Bank Statement",
    url: "#",
    status: "Rejected",
    uploadedAt: "2023-06-04T11:20:00Z",
  },
  {
    id: "doc5",
    studentId: "stud3",
    studentName: "Wei Chen",
    type: "Passport",
    url: "#",
    status: "Pending",
    uploadedAt: "2023-06-05T16:10:00Z",
  },
]

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [filteredDocuments, setFilteredDocuments] = useState(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // This would normally fetch data from Firebase
  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setDocuments(mockDocuments)
      setFilteredDocuments(mockDocuments)
    }, 500)
  }, [])

  // Apply filters when search or filter values change
  useEffect(() => {
    let filtered = documents

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) => doc.studentName.toLowerCase().includes(query) || doc.type.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter)
    }

    setFilteredDocuments(filtered)
  }, [searchQuery, statusFilter, typeFilter, documents])

  const handleStatusChange = (documentId: string, newStatus: string) => {
    // This would normally update the document status in Firebase
    const updatedDocuments = documents.map((doc) => (doc.id === documentId ? { ...doc, status: newStatus } : doc))
    setDocuments(updatedDocuments)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Get unique document types for filter
  const documentTypes = ["all", ...new Set(documents.map((doc) => doc.type))]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Document Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by student or document type..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes
                      .filter((type) => type !== "all")
                      .map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No documents found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.studentName}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {doc.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(doc.id, "Approved")}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(doc.id, "Rejected")}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
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
        </CardContent>
      </Card>
    </div>
  )
}
