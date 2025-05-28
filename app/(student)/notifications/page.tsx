"use client"

import { useState, useEffect } from "react"
import { useCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, FileText, GraduationCap, AlertCircle, Clock, CheckCircle } from "lucide-react"
import { where, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState("all")

  // Get all notifications for the user
  const {
    data: notificationsData,
    loading,
    error,
    refresh,
  } = useCollection("notifications", user?.uid ? [where("userId", "==", user.uid)] : [])

  // Sort notifications client-side
  const [sortedNotifications, setSortedNotifications] = useState<any[]>([])

  useEffect(() => {
    if (notificationsData && notificationsData.length > 0) {
      // Sort by createdAt in descending order (newest first)
      const sorted = [...notificationsData].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime()
        const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime()
        return dateB - dateA
      })
      setSortedNotifications(sorted)
    } else {
      setSortedNotifications([])
    }
  }, [notificationsData])

  const filteredNotifications = sortedNotifications.filter((notif) => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    return notif.type === filter
  })

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), { read: true })
      refresh() // Refresh the notifications list
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = sortedNotifications.filter((notif) => !notif.read)
      if (unreadNotifications.length === 0) return

      const updatePromises = unreadNotifications.map((notification) =>
        updateDoc(doc(db, "notifications", notification.id), { read: true }),
      )
      await Promise.all(updatePromises)
      refresh() // Refresh the notifications list
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Document":
        return <FileText className="h-5 w-5" />
      case "Visa":
        return <AlertCircle className="h-5 w-5" />
      case "Application":
        return <GraduationCap className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with your application progress</p>
        </div>
        {sortedNotifications.some((notif) => !notif.read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
          Unread
        </Button>
        <Button variant={filter === "Document" ? "default" : "outline"} size="sm" onClick={() => setFilter("Document")}>
          Documents
        </Button>
        <Button variant={filter === "Visa" ? "default" : "outline"} size="sm" onClick={() => setFilter("Visa")}>
          Visa
        </Button>
        <Button
          variant={filter === "Application" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Application")}
        >
          Applications
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Your Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge
                            status={notification.type === "Document" ? "Approved" : "In Progress"}
                            className="ml-4"
                          />
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
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
