"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

// List of countries for the dropdown
const countries = [
  "Morocco",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "China",
  "India",
  "Nigeria",
  "Brazil",
  "Mexico",
  "Germany",
  "France",
  "Japan",
  "South Korea",
  "Russia",
  "South Africa",
  "Saudi Arabia",
  "United Arab Emirates",
  "Singapore",
  "Malaysia",
  "Vietnam",
  "Other",
]

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    country: "",
    paymentReference: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Basic validation
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      errors.fullName = "Please enter your full name"
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email address"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      errors.password = "Please enter a password"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (!formData.dob) {
      errors.dob = "Please enter your date of birth"
    }

    if (!formData.country) {
      errors.country = "Please select your country"
    }

    if (!formData.paymentReference.trim()) {
      errors.paymentReference = "Please enter your payment reference number"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    setFieldErrors({}) // Clear field errors on successful validation

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Add user to registration queue in Firestore
      try {
        await setDoc(doc(db, "registrationQueue", user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          dob: formData.dob,
          country: formData.country,
          paymentReference: formData.paymentReference,
          status: "pending",
          paymentStatus: "unverified",
          createdAt: serverTimestamp(),
        })

        // Redirect to awaiting approval page
        router.push("/awaiting-approval")
      } catch (firestoreError: any) {
        console.error("Firestore error:", firestoreError)

        // If there's a permission error but the user was created in Auth
        // We'll still redirect them to the awaiting approval page
        // The admin will need to manually create their entry
        if (firestoreError.code === "permission-denied") {
          setError("Your account was created but there was an issue with registration data. Please contact support.")
          setTimeout(() => {
            router.push("/awaiting-approval")
          }, 3000)
        } else {
          setError(`Database error: ${firestoreError.message}. Please try again or contact support.`)
          setIsLoading(false)
        }
      }
    } catch (authError: any) {
      console.error("Authentication error:", authError)
      if (authError.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please use a different email or try logging in.")
      } else {
        setError(authError.message || "An error occurred during registration")
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
            <p className="mt-2 text-gray-600">Begin your educational journey</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-primary">Create Your Account</CardTitle>
              <CardDescription>Join ZHAcademie to start your student visa journey</CardDescription>
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
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className={fieldErrors.fullName ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={fieldErrors.fullName ? "true" : "false"}
                    aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                  />
                  {fieldErrors.fullName && (
                    <p id="fullName-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

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

                <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={fieldErrors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}
                      aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
                      aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                    />
                    {fieldErrors.confirmPassword && (
                      <p id="confirmPassword-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className={fieldErrors.dob ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={fieldErrors.dob ? "true" : "false"}
                    aria-describedby={fieldErrors.dob ? "dob-error" : undefined}
                  />
                  {fieldErrors.dob && (
                    <p id="dob-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.dob}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange("country", value)}
                    required
                  >
                    <SelectTrigger className={fieldErrors.country ? "border-red-500 focus:ring-red-500" : ""}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.country && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.country}
                    </p>
                  )}
                </div>

                

                <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
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
          alt="University campus"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
      </div>
    </div>
  )
}
