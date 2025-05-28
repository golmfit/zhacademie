"use client"

import { useEffect, useRef } from "react"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { updateStudentAppStatus, checkAllStagesCompleted } from "@/lib/progress-utils"

/**
 * Hook to monitor progress changes and update app status automatically
 */
export function useProgressMonitor(studentId: string | null) {
  // Use a ref to track the last update time to prevent excessive updates
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    if (!studentId) return

    console.log(`DEBUG: Setting up progress monitor for student ${studentId}`)

    // Set up listeners for both progress collections
    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)

    let updateTimeout: NodeJS.Timeout | null = null

    // Function to update status with debounce
    const debouncedUpdate = async () => {
      // Prevent updates that are too close together (within 1 second)
      const now = Date.now()
      if (now - lastUpdateRef.current < 1000) {
        console.log("DEBUG: Skipping update due to debounce")
        return
      }

      if (updateTimeout) clearTimeout(updateTimeout)

      updateTimeout = setTimeout(async () => {
        console.log("DEBUG: Running debounced update")

        try {
          // First, check if all stages are completed
          const allCompleted = await checkAllStagesCompleted(studentId)
          console.log(`DEBUG: All stages completed check: ${allCompleted}`)

          // Get current status
          const studentRef = doc(db, "students", studentId)
          const studentSnap = await getDoc(studentRef)
          const currentStatus = studentSnap.data()?.appStatus
          console.log(`DEBUG: Current status: ${currentStatus}`)

          // Update the app status
          await updateStudentAppStatus(studentId)

          // Update the last update time
          lastUpdateRef.current = Date.now()
        } catch (error) {
          console.error("Error in debounced update:", error)
        }
      }, 500) // Wait 500ms after last change before updating
    }

    // Subscribe to app progress changes
    const unsubscribeApp = onSnapshot(
      appProgressRef,
      (snapshot) => {
        console.log(`DEBUG: App progress changed, docs: ${snapshot.docs.length}`)
        // Log each document's status
        snapshot.docs.forEach((doc) => {
          console.log(`DEBUG: App stage ${doc.id} status: ${doc.data().status || "Not Started"}`)
        })
        debouncedUpdate()
      },
      (error) => console.error("Error monitoring app progress:", error),
    )

    // Subscribe to visa progress changes
    const unsubscribeVisa = onSnapshot(
      visaProgressRef,
      (snapshot) => {
        console.log(`DEBUG: Visa progress changed, docs: ${snapshot.docs.length}`)
        // Log each document's status
        snapshot.docs.forEach((doc) => {
          console.log(`DEBUG: Visa stage ${doc.id} status: ${doc.data().status || "Not Started"}`)
        })
        debouncedUpdate()
      },
      (error) => console.error("Error monitoring visa progress:", error),
    )

    // Initial update
    debouncedUpdate()

    // Cleanup
    return () => {
      unsubscribeApp()
      unsubscribeVisa()
      if (updateTimeout) clearTimeout(updateTimeout)
    }
  }, [studentId])
}
