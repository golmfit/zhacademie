"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userData, isLoading } = useAuth()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Skip check if still loading
    if (isLoading) return

    // Check if user is logged in and has an allowed role
    const checkAuthorization = () => {
      console.log("Protected Route - Checking authorization")
      console.log("User:", user?.email)
      console.log("UserData:", userData)
      console.log("Allowed Roles:", allowedRoles)
      console.log("Current Role:", userData?.role)

      if (!user) {
        console.log("No user, redirecting to login")
        router.push("/login")
        return false
      }

      if (!userData) {
        console.log("No user data, redirecting to login")
        router.push("/login")
        return false
      }

      if (!userData.role) {
        console.log("No role defined, redirecting to login")
        router.push("/login")
        return false
      }

      if (userData.role === "pending") {
        console.log("User is pending approval, redirecting")
        router.push("/awaiting-approval")
        return false
      }

      if (!allowedRoles.includes(userData.role)) {
        console.log(`Role ${userData.role} not allowed, redirecting`)

        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/dashboard")
        } else if (userData.role === "student") {
          router.push("/dashboard")
        } else {
          router.push("/login")
        }

        return false
      }

      console.log("User is authorized")
      return true
    }

    const isAuthorized = checkAuthorization()
    setAuthorized(isAuthorized)
  }, [user, userData, isLoading, router, allowedRoles])

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your access</p>
        </div>
      </div>
    )
  }

  // If not authorized, don't render children
  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Checking permissions...</h2>
          <p className="text-gray-500">Please wait while we redirect you</p>
        </div>
      </div>
    )
  }

  // If authorized, render children
  return <>{children}</>
}
