import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type AppStatus = "Not Started" | "In Progress" | "Completed"

interface ProgressStage {
  status: "Not Started" | "Completed"
}

/**
 * Calculate the overall app status based on progress stages
 */
export function calculateAppStatus(appProgressStages: ProgressStage[], visaProgressStages: ProgressStage[]): AppStatus {
  // If no stages exist in either collection, return "Not Started"
  if (appProgressStages.length === 0 && visaProgressStages.length === 0) {
    console.log("DEBUG: No stages found in either collection, returning 'Not Started'")
    return "Not Started"
  }

  // Combine all stages
  const allStages = [...appProgressStages, ...visaProgressStages]

  // Log for debugging
  console.log(
    `DEBUG: Total stages: ${allStages.length}, App stages: ${appProgressStages.length}, Visa stages: ${visaProgressStages.length}`,
  )
  console.log("DEBUG: Stages statuses:", allStages.map((s) => s.status).join(", "))

  // Check if all stages are completed - FIX: ensure we have stages to check
  if (allStages.length > 0) {
    const allCompleted = allStages.every((stage) => stage.status === "Completed")
    if (allCompleted) {
      console.log("DEBUG: All stages are completed, returning 'Completed'")
      return "Completed"
    }
  }

  // Check if any stage has started (is completed)
  const anyStarted = allStages.some((stage) => stage.status === "Completed")
  if (anyStarted) {
    console.log("DEBUG: Some stages are completed, returning 'In Progress'")
    return "In Progress"
  }

  console.log("DEBUG: No stages are completed, returning 'Not Started'")
  return "Not Started"
}

/**
 * Fetch all progress stages for a student and calculate their app status
 */
export async function updateStudentAppStatus(studentId: string): Promise<void> {
  try {
    console.log(`DEBUG: Updating app status for student ${studentId}`)

    // Fetch app progress stages
    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const appProgressSnap = await getDocs(appProgressRef)
    const appProgressStages: ProgressStage[] = appProgressSnap.docs.map((doc) => {
      const data = doc.data()
      console.log(`DEBUG: App stage ${doc.id} status: ${data.status || "Not Started"}`)
      return {
        status: data.status || "Not Started",
      }
    })

    // Fetch visa progress stages
    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)
    const visaProgressSnap = await getDocs(visaProgressRef)
    const visaProgressStages: ProgressStage[] = visaProgressSnap.docs.map((doc) => {
      const data = doc.data()
      console.log(`DEBUG: Visa stage ${doc.id} status: ${data.status || "Not Started"}`)
      return {
        status: data.status || "Not Started",
      }
    })

    // Calculate the new app status
    const newAppStatus = calculateAppStatus(appProgressStages, visaProgressStages)

    // Update the student document
    const studentRef = doc(db, "students", studentId)
    await updateDoc(studentRef, {
      appStatus: newAppStatus,
      lastActivity: serverTimestamp(),
    })

    console.log(`DEBUG: Updated student ${studentId} app status to: ${newAppStatus}`)
  } catch (error) {
    console.error("Error updating student app status:", error)
    throw error
  }
}

/**
 * Check if all stages in a collection are completed
 * This is a helper function to verify status in real-time
 */
export async function checkAllStagesCompleted(studentId: string): Promise<boolean> {
  try {
    // Get all app progress stages
    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const appProgressSnap = await getDocs(appProgressRef)

    // Get all visa progress stages
    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)
    const visaProgressSnap = await getDocs(visaProgressRef)

    // If both collections are empty, return false
    if (appProgressSnap.empty && visaProgressSnap.empty) {
      console.log("DEBUG: Both collections are empty")
      return false
    }

    // Check if any app progress stage is not completed
    for (const doc of appProgressSnap.docs) {
      const status = doc.data().status
      console.log(`DEBUG: App stage ${doc.id} status: ${status}`)
      if (status !== "Completed") {
        return false
      }
    }

    // Check if any visa progress stage is not completed
    for (const doc of visaProgressSnap.docs) {
      const status = doc.data().status
      console.log(`DEBUG: Visa stage ${doc.id} status: ${status}`)
      if (status !== "Completed") {
        return false
      }
    }

    // If we get here, all stages are completed
    return true
  } catch (error) {
    console.error("Error checking if all stages are completed:", error)
    return false
  }
}
