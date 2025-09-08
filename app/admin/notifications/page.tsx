"use client"

import type React from "react"

import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Send, AlertCircle, Clock, Users } from "lucide-react"
import { orderBy } from "firebase/firestore"

export default function AdminNotificationsPage() {
  const { data: notifications, loading } = useCollection("notifications", [orderBy("createdAt", "desc")])
  const { data: students } = useCollection("students")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "System",
    priority: "Medium",
    recipient: "all",
    specificStudent: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
        read: false, // Explicitly set read status to false for new notifications
        createdAt: serverTimestamp(),
        createdBy: "Admin",
      }

      if (formData.recipient === "all") {
        // Create notification for all students
        const batch = students?.map(async (student) => {
          const notifRef = doc(collection(db, "notifications"))
          await setDoc(notifRef, {
            ...notificationData,
            userId: student.id,
            studentName: student.fullName,
          })
        })

        if (batch) {
          await Promise.all(batch)
        }
      } else if (formData.specificStudent) {
        // Create notification for specific student
        const student = students?.find((s) => s.id === formData.specificStudent)
        const notifRef = doc(collection(db, "notifications"))
        await setDoc(notifRef, {
          ...notificationData,
          userId: formData.specificStudent,
          studentName: student?.fullName || "Unknown",
        })
      }

      setFormData({
        title: "",
        message: "",
        type: "System",
        priority: "Medium",
        recipient: "all",
        specificStudent: "",
      })
      setIsCreateModalOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to send notification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (timestamp: any) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100"
      case "Medium":
        return "text-amber-600 bg-amber-100"
      case "Low":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send New Notification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="System">System</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Application">Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Select
                  value={formData.recipient}
                  onValueChange={(value) => setFormData({ ...formData, recipient: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="specific">Specific Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.recipient === "specific" && (
                <div>
                  <Label htmlFor="specificStudent">Select Student</Label>
                  <Select
                    value={formData.specificStudent}
                    onValueChange={(value) => setFormData({ ...formData, specificStudent: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications?.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {notification.studentName || "All Students"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority} Priority
                        </span>
                        {notification.read !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${notification.read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"}`}
                          >
                            {notification.read ? "Read" : "Unread"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
