"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  BookOpen,
  Info,
  Bell,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useCollection } from "@/hooks/use-firestore"
import { where, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import React from "react"

interface StudentLayoutProps {
  children: React.ReactNode
}

// Extracted sidebar links to avoid re-creating on each render
const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Applications",
    href: "/student/applications",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    name: "Visa Progress",
    href: "/student/visa-progress",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Documents",
    href: "/student/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Appointments",
    href: "/student/appointments",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Interview Preparation",
    href: "/student/interview-preparation",
    icon: <Video className="h-5 w-5" />,
  },
  {
    name: "Courses",
    href: "/student/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: "General Info",
    href: "/student/general-info",
    icon: <Info className="h-5 w-5" />,
  },
  {
    name: "Notifications",
    href: "/student/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/student/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

// Extracted to a separate component to prevent re-renders
const SidebarLink = React.memo(
  ({
    link,
    isActive,
    onClick,
    isCollapsed,
  }: {
    link: (typeof sidebarLinks)[0]
    isActive: boolean
    onClick?: () => void
    isCollapsed?: boolean
  }) => (
    <Link
      href={link.href}
      className={cn(
        "flex items-center text-sm rounded-md transition-colors",
        isActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white",
        isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3",
      )}
      onClick={onClick}
    >
      {link.icon}
      {!isCollapsed && <span className="ml-3">{link.name}</span>}
    </Link>
  ),
)
SidebarLink.displayName = "SidebarLink"

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { user, userData, isLoading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Fetch unread notifications count
  const { data: notifications } = useCollection(
    "notifications",
    user?.uid ? [where("userId", "==", user.uid), where("read", "==", false)] : [],
  )

  const unreadCount = notifications?.length || 0

  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mark notifications as read when visiting the notifications page
  useEffect(() => {
    const markNotificationsAsRead = async () => {
      if (pathname === "/notifications" && user?.uid && notifications && notifications.length > 0) {
        try {
          // Update each unread notification
          const updatePromises = notifications.map((notification) =>
            updateDoc(doc(db, "notifications", notification.id), { read: true }),
          )
          await Promise.all(updatePromises)
        } catch (error) {
          console.error("Error marking notifications as read:", error)
        }
      }
    }

    if (mounted && user) {
      markNotificationsAsRead()
    }
  }, [pathname, user, notifications, mounted])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/notifications")
  }

  // Show loading state or error message while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    )
  }

  // If not a student, show error message
  if (!userData || userData.role !== "student") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Access Denied</h2>
          <p className="text-gray-700 mb-4">
            You don't have permission to access the student dashboard.
            {userData?.role === "admin"
              ? " You are logged in as an admin."
              : userData?.role === "pending"
                ? " Your account is pending approval. To proceed with your account approval, please complete the 50% service fee payment."
                : " Please log in with a student account."}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" passHref>
              <Button as="a">Go to Login</Button>
            </Link>
            {userData?.role === "admin" && (
              <Link href="/admin/dashboard" passHref>
                <Button variant="outline" as="a">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {userData?.role === "pending" && (
              <Link href="/awaiting-approval" passHref>
                <Button variant="outline" as="a">
                  Check Status
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <aside
        className={cn(
          "bg-primary text-white fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <Link href="/dashboard" className={cn("text-xl font-bold", isSidebarCollapsed && "sr-only")}>
              ZHAcademie
            </Link>
            {isSidebarCollapsed && <span className="text-xl font-bold">ZH</span>}
            <button className="lg:hidden text-white" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.href}
                link={link}
                isActive={pathname === link.href}
                onClick={() => setIsSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
              />
            ))}
          </nav>
          <div className="mt-auto p-4 border-t border-gray-700">
            <button
              onClick={toggleSidebarCollapse}
              className="w-full flex items-center justify-center text-gray-300 hover:text-white"
            >
              {isSidebarCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden text-gray-600" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative" onClick={handleBellClick}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{userData?.fullName || "Student"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}

// Skeleton loader for page content
function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}
