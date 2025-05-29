"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Custom field validation
    const errors: Record<string, string> = {}
    if (!formData.email.trim()) {
      errors.email = "Please enter your email address"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      errors.password = "Please enter your password"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      // Basic login - just authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)

      // Check user role in Firestore to determine redirect
      try {
        // First check if user is in admins collection
        const adminDocRef = doc(db, "admins", userCredential.user.uid)
        const adminDoc = await getDoc(adminDocRef)

        if (adminDoc.exists()) {
          // Redirect to admin dashboard with /admin prefix
          window.location.href = "/admin/dashboard"
          return
        }

        // Check if user is in students collection
        const studentDocRef = doc(db, "students", userCredential.user.uid)
        const studentDoc = await getDoc(studentDocRef)

        if (studentDoc.exists()) {
          // Redirect to student dashboard
          window.location.href = "/dashboard"
          return
        }

        // Check if user is in registration queue
        const queueDocRef = doc(db, "registrationQueue", userCredential.user.uid)
        const queueDoc = await getDoc(queueDocRef)

        if (queueDoc.exists()) {
          // Redirect to awaiting approval page
          window.location.href = "/awaiting-approval"
          return
        }

        // Fallback if no role found
        // Simple fallback approach based on email
        if (formData.email.includes("admin")) {
          window.location.href = "/admin/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      } catch (error) {
        console.error("Error checking user role:", error)

        // Fallback to email-based redirect if role check fails
        if (formData.email.includes("admin")) {
          window.location.href = "/admin/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)

      if (err.code === "auth/user-not-found") {
        setError("Invalid email or password")
      } else if (err.code === "auth/wrong-password") {
        setError("Invalid email or password")
      } else if (err.message.includes("email")) {
        setError("Please enter a valid email address")
      } else if (err.message.includes("password")) {
        setError("Password is required")
      } else {
        setError(err.message || "An error occurred during login")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">ZHAcademie</h1>
            <p className="mt-2 text-gray-600">Your path to international education</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={fieldErrors.email ? "true" : "false"}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={fieldErrors.password ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={fieldErrors.password ? "true" : "false"}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  />
                  {fieldErrors.password && (
                    <p id="password-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.password}
                    </p>
                  )}
                  <div className="text-right mt-1">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Register
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250528_2349_Vibrant%20Academic%20Gateway_remix_01jwd2ejnjedp94cpqj0vptr14-YpnkURERQaQiW1An9fe6WqzLTidYF7.png"
          alt="Students studying abroad"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
      </div>
    </div>
  )
}
