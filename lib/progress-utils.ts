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
    console.log("DEBUG (calculateAppStatus): No stages found in either collection, returning 'Not Started'")
    return "Not Started"
  }

  const allStages = [...appProgressStages, ...visaProgressStages]

  console.log(
    `DEBUG (calculateAppStatus): Total stages: ${allStages.length}, App stages: ${appProgressStages.length}, Visa stages: ${visaProgressStages.length}`,
  )
  console.log("DEBUG (calculateAppStatus): Stages statuses:", allStages.map((s) => s.status).join(", "))

  if (allStages.length > 0) {
    const allCompleted = allStages.every((stage) => stage.status === "Completed")
    if (allCompleted) {
      console.log("DEBUG (calculateAppStatus): All stages are completed, returning 'Completed'")
      return "Completed"
    }
  }

  const anyStarted = allStages.some((stage) => stage.status === "Completed")
  if (anyStarted) {
    console.log("DEBUG (calculateAppStatus): Some stages are completed, returning 'In Progress'")
    return "In Progress"
  }

  console.log("DEBUG (calculateAppStatus): No stages are completed, returning 'Not Started'")
  return "Not Started"
}

/**
 * Fetch all progress stages for a student and calculate their app status.
 * Then attempts to update the student's main document.
 */
export async function updateStudentAppStatus(studentId: string): Promise<void> {
  try {
    console.log(`DEBUG (updateStudentAppStatus): Attempting to update app status for student ${studentId}`)

    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const appProgressSnap = await getDocs(appProgressRef)
    const appProgressStages: ProgressStage[] = appProgressSnap.docs.map((doc) => {
      const data = doc.data()
      return { status: data.status || "Not Started" }
    })

    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)
    const visaProgressSnap = await getDocs(visaProgressRef)
    const visaProgressStages: ProgressStage[] = visaProgressSnap.docs.map((doc) => {
      const data = doc.data()
      return { status: data.status || "Not Started" }
    })

    const newAppStatus = calculateAppStatus(appProgressStages, visaProgressStages)

    const studentRef = doc(db, "students", studentId)
    await updateDoc(studentRef, {
      appStatus: newAppStatus,
      lastActivity: serverTimestamp(),
    })

    console.log(
      `DEBUG (updateStudentAppStatus): Successfully updated student ${studentId} app status to: ${newAppStatus}`,
    )
  } catch (error: any) {
    console.error(`ERROR (updateStudentAppStatus) for student ${studentId}: ${error.message}`, error)
    if (
      error.code === "permission-denied" ||
      (error.message && error.message.toLowerCase().includes("missing or insufficient permissions"))
    ) {
      console.warn(
        `PERMISSION_DENIED: Failed to update appStatus for student ${studentId}. ` +
          `This typically means the current authenticated user does not satisfy the 'isGeneralAdmin()' ` +
          `condition in Firestore security rules for updating the '/students/${studentId}' document. ` +
          `Consider using a Cloud Function for automatic status updates triggered by changes in progress subcollections, ` +
          `or ensure this function is only called by a 'general' admin.`,
      )
    }
    // Re-throw the error so the calling code can handle it if needed (e.g., show a UI message)
    throw error
  }
}

/**
 * Check if all stages in a collection are completed
 * This is a helper function to verify status in real-time
 */
export async function checkAllStagesCompleted(studentId: string): Promise<boolean> {
  try {
    const appProgressRef = collection(db, `students/${studentId}/appProgress`)
    const appProgressSnap = await getDocs(appProgressRef)

    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)
    const visaProgressSnap = await getDocs(visaProgressRef)

    if (appProgressSnap.empty && visaProgressSnap.empty) {
      return false
    }

    for (const doc of appProgressSnap.docs) {
      if (doc.data().status !== "Completed") return false
    }
    for (const doc of visaProgressSnap.docs) {
      if (doc.data().status !== "Completed") return false
    }
    return true
  } catch (error) {
    console.error(`Error checking if all stages are completed for student ${studentId}:`, error)
    return false
  }
}
