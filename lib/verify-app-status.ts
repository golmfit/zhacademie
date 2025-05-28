import { collection, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { calculateAppStatus } from "./progress-utils"

/**
 * Verify and fix the app status for a student if it's incorrect
 */
export async function verifyAndFixAppStatus(studentId: string): Promise<boolean> {
  try {
    console.log(`Verifying app status for student ${studentId}`)

    // Get current app status
    const studentRef = doc(db, "students", studentId)
    const studentSnap = await getDoc(studentRef)

    if (!studentSnap.exists()) {
      console.error(`Student ${studentId} not found`)
      return false
    }

    const currentAppStatus = studentSnap.data().appStatus || "Not Started"
    console.log(`Current app status: ${currentAppStatus}`)

    // Get app progress stages
    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const appProgressSnap = await getDocs(appProgressRef)
    const appProgressStages = appProgressSnap.docs.map((doc) => ({
      status: doc.data().status || "Not Started",
    }))

    // Get visa progress stages
    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)
    const visaProgressSnap = await getDocs(visaProgressRef)
    const visaProgressStages = visaProgressSnap.docs.map((doc) => ({
      status: doc.data().status || "Not Started",
    }))

    // Calculate correct app status
    const correctAppStatus = calculateAppStatus(appProgressStages, visaProgressStages)
    console.log(`Calculated correct app status: ${correctAppStatus}`)

    // If current status is incorrect, fix it
    if (currentAppStatus !== correctAppStatus) {
      console.log(`Fixing incorrect app status from ${currentAppStatus} to ${correctAppStatus}`)
      await updateDoc(studentRef, {
        appStatus: correctAppStatus,
        lastActivity: serverTimestamp(),
      })
      return true
    }

    console.log(`App status is correct: ${currentAppStatus}`)
    return false
  } catch (error) {
    console.error("Error verifying app status:", error)
    return false
  }
}
