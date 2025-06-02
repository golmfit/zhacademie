"use client"

import { useEffect, useRef } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  updateStudentAppStatus, // Removed checkAllStagesCompleted and direct doc reads as updateStudentAppStatus handles it
} from "@/lib/progress-utils"
import { useAuth } from "@/contexts/auth-context" // Use your existing AuthContext

export function useProgressMonitor(studentId: string | null) {
  const { userData, isLoading: isAuthLoading } = useAuth() // Get user data and auth loading state
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    // Wait for auth to load and ensure we have a studentId and userData
    if (isAuthLoading || !studentId || !userData) {
      if (isAuthLoading) console.log("DEBUG (useProgressMonitor): Auth is loading, skipping setup.")
      if (!studentId) console.log("DEBUG (useProgressMonitor): No studentId, skipping setup.")
      if (!userData && !isAuthLoading)
        console.log("DEBUG (useProgressMonitor): No userData (and auth not loading), skipping setup.")
      return
    }

    // Determine the admin role from userData
    // userData.role could be 'student', 'admin', or 'pending'
    // userData.adminRole would exist if userData.role is 'admin'
    const effectiveAdminRole = userData.role === "admin" ? userData.adminRole : null

    console.log(
      `DEBUG (useProgressMonitor): Setting up for student ${studentId}. Current user role: ${userData.role}, adminRole: ${effectiveAdminRole || "N/A"}`,
    )

    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)

    let updateTimeout: NodeJS.Timeout | null = null

    const debouncedUpdate = async () => {
      const now = Date.now()
      if (now - lastUpdateRef.current < 1000) {
        console.log("DEBUG (useProgressMonitor): Skipping update due to debounce.")
        return
      }

      if (updateTimeout) clearTimeout(updateTimeout)

      updateTimeout = setTimeout(async () => {
        console.log("DEBUG (useProgressMonitor): Running debounced update for student:", studentId)

        // **** KEY MODIFICATION: Check role before attempting to update student app status ****
        if (effectiveAdminRole !== "general") {
          console.warn(
            `INFO (useProgressMonitor): Current user is not a 'general' admin (role: ${userData.role}, adminRole: ${effectiveAdminRole || "N/A"}). ` +
              `Skipping client-side call to updateStudentAppStatus for student ${studentId} to prevent permission error. ` +
              `The main appStatus on /students/${studentId} will not be updated by this client-side action. ` +
              `For automatic updates triggered by any role, consider implementing Firebase Cloud Functions.`,
          )
          lastUpdateRef.current = Date.now() // Still update debounce timer
          return // Exit without calling updateStudentAppStatus
        }
        // **** END KEY MODIFICATION ****

        try {
          console.log(
            `DEBUG (useProgressMonitor): User is 'general' admin. Proceeding with updateStudentAppStatus for ${studentId}.`,
          )
          // The updateStudentAppStatus function already contains its own try-catch for other errors.
          await updateStudentAppStatus(studentId)
          console.log(`DEBUG (useProgressMonitor): updateStudentAppStatus call completed for ${studentId}.`)
          lastUpdateRef.current = Date.now()
        } catch (error) {
          // This catch block in useProgressMonitor will now primarily catch errors if updateStudentAppStatus (called by a general admin)
          // itself throws an unexpected error, NOT the permission error for non-general admins.
          console.error(
            `ERROR (useProgressMonitor) during debounced update for student ${studentId} (caller role: general admin):`,
            error,
          )
        }
      }, 500) // 500ms debounce
    }

    const createSnapshotListener = (collectionRef: any, type: string) => {
      return onSnapshot(
        collectionRef,
        (snapshot) => {
          console.log(
            `DEBUG (useProgressMonitor): ${type} progress changed for student ${studentId}, ${snapshot.docs.length} docs. Triggering debounced update.`,
          )
          // Detailed logging of changed docs can be verbose, enable if needed:
          // snapshot.docChanges().forEach((change) => {
          //   console.log(`DEBUG (useProgressMonitor): ${type} change: ${change.type} docId: ${change.doc.id}`);
          // });
          debouncedUpdate()
        },
        (error) => {
          console.error(`Error monitoring ${type} progress for student ${studentId}:`, error)
        },
      )
    }

    const unsubscribeApp = createSnapshotListener(appProgressRef, "App")
    const unsubscribeVisa = createSnapshotListener(visaProgressRef, "Visa")

    // Initial update attempt, only if user is general admin
    // This ensures that when the component mounts, if the user is a general admin,
    // it tries to sync the status.
    if (effectiveAdminRole === "general") {
      console.log(
        `DEBUG (useProgressMonitor): Initial debounced update triggered for general admin for student ${studentId}.`,
      )
      debouncedUpdate()
    } else {
      console.log(
        `DEBUG (useProgressMonitor): Initial debounced update skipped for non-general admin for student ${studentId}.`,
      )
    }

    return () => {
      console.log(`DEBUG (useProgressMonitor): Cleaning up listeners for student ${studentId}`)
      unsubscribeApp()
      unsubscribeVisa()
      if (updateTimeout) clearTimeout(updateTimeout)
    }
  }, [studentId, userData, isAuthLoading]) // Add userData and isAuthLoading to dependency array
}
