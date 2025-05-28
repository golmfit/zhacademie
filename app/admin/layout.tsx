"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  BookOpen,
  Bell,
  BarChart2,
  Settings,
  Menu,
  X,
  User,
  LogOut,
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

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, userData, isLoading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Updated sidebar links with /admin prefix
  const sidebarLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Students",
      href: "/admin/students",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Documents",
      href: "/admin/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Handle navigation manually to ensure it works in all environments
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsSidebarOpen(false) // Close sidebar on mobile after clicking
    console.log(`Navigating to: ${href}`)

    // Use both methods for maximum compatibility
    router.push(href)

    // Fallback direct navigation after a short delay if router doesn't work
    setTimeout(() => {
      window.location.href = href
    }, 100)
  }

  // Show loading state or error message while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we set up your dashboard</p>
        </div>
      </div>
    )
  }

  // Debug information
  console.log("Admin Layout - User:", user?.email)
  console.log("Admin Layout - UserData:", userData)
  console.log("Admin Layout - Role:", userData?.role)

  // If not an admin, show error message
  if (!userData || userData.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Access Denied</h2>
          <p className="text-gray-700 mb-4">
            You don't have permission to access the admin dashboard.
            {userData?.role === "student"
              ? " You are logged in as a student."
              : userData?.role === "pending"
                ? " Your account is pending approval."
                : " Please log in with an admin account."}
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
            {userData?.role === "student" && (
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Student Dashboard
              </Button>
            )}
            {userData?.role === "pending" && (
              <Button variant="outline" onClick={() => router.push("/awaiting-approval")}>
                Check Status
              </Button>
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
          isSidebarCollapsed ? "w-16" : "w-72",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <a
              href="/admin/dashboard"
              className={cn("text-xl font-bold", isSidebarCollapsed && "sr-only")}
              onClick={(e) => {
                e.preventDefault()
                handleNavigation("/admin/dashboard", e)
              }}
            >
              ZHAcademie Admin
            </a>
            {isSidebarCollapsed && <span className="text-xl font-bold">ZH</span>}
            <button className="lg:hidden text-white" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  pathname === link.href ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white",
                  isSidebarCollapsed && "justify-center px-2",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation(link.href, e)
                }}
              >
                {link.icon}
                {!isSidebarCollapsed && <span className="ml-3">{link.name}</span>}
              </a>
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
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{userData?.fullName || "Admin"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/admin/settings", {} as React.MouseEvent)}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
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
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
