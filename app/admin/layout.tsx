"use client"

import React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
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
import { Skeleton } from "@/components/ui/skeleton"

interface AdminLayoutProps {
  children: React.ReactNode
}

// Extracted sidebar links to avoid re-creating on each render
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { userData, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (!mounted) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
              <Link href="/admin/dashboard" className={cn("text-xl font-bold", isSidebarCollapsed && "sr-only")}>
                ZHAcademie Admin
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
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
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
    </ProtectedRoute>
  )
}

// Skeleton loader for page content
function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}
