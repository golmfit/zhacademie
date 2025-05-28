import { collection, getDocs, writeBatch } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { calculateAppStatus } from "@/lib/progress-utils"

/**
 * Migration script to update all students' app status based on their progress
 */
export async function migrateAppStatus() {
  try {
    console.log("Starting app status migration...")

    // Get all students
    const studentsRef = collection(db, "students")
    const studentsSnap = await getDocs(studentsRef)

    const batch = writeBatch(db)
    let updateCount = 0

    // Process each student
    for (const studentDoc of studentsSnap.docs) {
      const studentId = studentDoc.id

      try {
        // Fetch app progress stages
        const appProgressRef = collection(db, `students/${studentId}/appProgress`)
        const appProgressSnap = await getDocs(appProgressRef)
        const appProgressStages = appProgressSnap.docs.map((doc) => ({
          status: doc.data().status || ("Not Started" as const),
        }))

        // Fetch visa progress stages
        const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)
        const visaProgressSnap = await getDocs(visaProgressRef)
        const visaProgressStages = visaProgressSnap.docs.map((doc) => ({
          status: doc.data().status || ("Not Started" as const),
        }))

        // Calculate the new app status
        const newAppStatus = calculateAppStatus(appProgressStages, visaProgressStages)

        // Add to batch update
        batch.update(studentDoc.ref, {
          appStatus: newAppStatus,
        })

        updateCount++
        console.log(`Queued update for student ${studentId}: ${newAppStatus}`)
      } catch (error) {
        console.error(`Error processing student ${studentId}:`, error)
      }
    }

    // Commit the batch
    if (updateCount > 0) {
      await batch.commit()
      console.log(`Successfully updated ${updateCount} students`)
    } else {
      console.log("No students to update")
    }
  } catch (error) {
    console.error("Migration failed:", error)
    throw error
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateAppStatus()
    .then(() => {
      console.log("Migration completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Migration failed:", error)
      process.exit(1)
    })
}
