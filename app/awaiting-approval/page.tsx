"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { HourglassIcon, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function AwaitingApprovalPage() {
  const { user, userData, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (userData?.role === "student") {
        router.push("/dashboard")
      } else if (userData?.role === "admin") {
        router.push("/admin/dashboard")
      }
    }
  }, [user, userData, isLoading, router])

  const getStatusInfo = () => {
    if (!userData) return null

    switch (userData.paymentStatus) {
      case "received":
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />,
          title: "Payment Verified",
          description: "Your payment has been verified. Your account is pending admin approval.",
          color: "text-green-600",
        }
      case "rejected":
        return {
          icon: <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />,
          title: "Payment Rejected",
          description:
            "Your payment reference could not be verified. Please contact support for assistance or register again with a valid payment reference.",
          color: "text-red-600",
        }
      case "unverified":
      default:
        return {
          icon: <HourglassIcon className="h-16 w-16 text-amber-500 mx-auto mb-4" />,
          title: "Awaiting Approval",
          description: "Your account is pending payment verification and admin approval.",
          color: "text-amber-600",
        }
    }
  }

  const statusInfo = getStatusInfo()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {statusInfo?.icon}
          <CardTitle className={`text-2xl font-bold ${statusInfo?.color}`}>{statusInfo?.title}</CardTitle>
          <CardDescription className="mt-2">{statusInfo?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData?.paymentStatus === "rejected" ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-red-800">Payment Reference Invalid</h3>
                    <p className="text-sm text-red-700 mt-1">
                      The payment reference you provided could not be verified. Please ensure you've entered the correct
                      reference number from your payment receipt.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/register">Register Again</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  We'll notify you via email once your account has been approved. This usually takes 1-2 business days.
                </p>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
