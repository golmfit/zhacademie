"use client"

import type React from "react"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setEmailError(null)
    setSuccess(false)
    setIsLoading(true)

    // Enhanced email validation
    if (!email.trim()) {
      setEmailError("Please enter your email address")
      setIsLoading(false)
      return
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: any) {
      console.error("Password reset error:", err)

      if (err.code === "auth/invalid-email") {
        setEmailError("Please enter a valid email address")
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your connection and try again.")
      } else {
        setError("An error occurred. Please try again later.")
      }
    } finally {
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
            <p className="mt-2 text-gray-600">Reset your password</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-primary">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm font-medium">
                    If an account exists with this email, a password reset link has been sent. Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError(null) // Clear error when user types
                    }}
                    onFocus={() => setEmailError(null)} // Also clear on focus
                    placeholder="Enter your email address"
                    className={emailError ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {emailError}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center mt-4">
                  <Link href="/login" className="text-primary hover:underline inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/placeholder.svg?height=1080&width=1920&query=student studying at desk"
          alt="Student studying"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-lg">
              Don't worry, it happens to the best of us. We'll help you get back into your account in no time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
