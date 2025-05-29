"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  BookOpen,
  Info,
  Bell,
  Settings,
  X,
  Calendar,
  Video,
} from "lucide-react"

interface SidebarProps {
  isStudent?: boolean
}

// Sidebar links for student
const studentSidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    name: "Visa Progress",
    href: "/visa-progress",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Interview Preparation",
    href: "/interview-preparation",
    icon: <Video className="h-5 w-5" />,
  },
  {
    name: "Courses",
    href: "/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: "General Info",
    href: "/general-info",
    icon: <Info className="h-5 w-5" />,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

// Admin sidebar links
const adminSidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Students",
    href: "/students",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    name: "Courses",
    href: "/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/settings",
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
    link: (typeof studentSidebarLinks)[0]
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

export default function Sidebar({ isStudent = false }: SidebarProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const links = isStudent ? studentSidebarLinks : adminSidebarLinks
  const title = isStudent ? "ZHAcademie" : "ZHAcademie Admin"

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
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
            {title}
          </Link>
          {isSidebarCollapsed && <span className="text-xl font-bold">ZH</span>}
          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
