"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: User | null
  userData: any | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Flag to prevent redirect loops
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? `User ${user.uid}` : "No user")
      setUser(user)

      if (user) {
        try {
          // First check if user is in students collection
          const studentDocRef = doc(db, "students", user.uid)
          const studentDoc = await getDoc(studentDocRef)
          console.log("Student document exists:", studentDoc.exists())

          if (studentDoc.exists()) {
            console.log("Setting user data as student")
            setUserData({ ...studentDoc.data(), role: "student" })
          } else {
            // Check if user is in admins collection
            const adminDocRef = doc(db, "admins", user.uid)
            const adminDoc = await getDoc(adminDocRef)
            console.log("Admin document exists:", adminDoc.exists())

            if (adminDoc.exists()) {
              console.log("Setting user data as admin")
              setUserData({ ...adminDoc.data(), role: "admin" })
            } else {
              // Check if user is in registration queue
              const queueDocRef = doc(db, "registrationQueue", user.uid)
              const queueDoc = await getDoc(queueDocRef)
              console.log("Queue document exists:", queueDoc.exists())

              if (queueDoc.exists()) {
                console.log("Setting user data as pending")
                setUserData({ ...queueDoc.data(), role: "pending" })
              } else {
                // User exists in Auth but not in Firestore
                console.log("User not found in any collection")
                setUserData(null)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUserData(null)
        }
      } else {
        setUserData(null)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Disable automatic redirects in the auth context
  // Let the login page handle redirects instead

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, userData, isLoading, signOut }}>{children}</AuthContext.Provider>
}
