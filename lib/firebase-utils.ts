import { collection, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, getDoc, writeBatch } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase"

// Document functions
export const createDocument = async (collectionPath: string, data: any, id?: string) => {
  try {
    const docRef = id ? doc(db, collectionPath, id) : doc(collection(db, collectionPath))
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating document:", error)
    throw error
  }
}

export const updateDocument = async (collectionPath: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionPath, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

export const deleteDocument = async (collectionPath: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionPath, id))
    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}

// Student functions
export const approveStudent = async (studentId: string) => {
  try {
    // Get student data from registrationQueue
    const studentRef = doc(db, "registrationQueue", studentId)
    const studentSnap = await getDoc(studentRef)

    if (!studentSnap.exists()) {
      throw new Error("Student not found in registration queue")
    }

    const studentData = studentSnap.data()

    // Check if payment is verified
    if (studentData.paymentStatus !== "received") {
      throw new Error("Payment must be verified before approving student")
    }

    // Create batch write
    const batch = writeBatch(db)

    // Add to students collection
    const newStudentRef = doc(db, "students", studentId)
    batch.set(newStudentRef, {
      ...studentData,
      verified: true,
      appStatus: "Not Started",
      visaStage: "Not Started",
      lastActivity: serverTimestamp(),
    })

    // Delete from registrationQueue
    batch.delete(studentRef)

    // Commit the batch
    await batch.commit()
    return true
  } catch (error) {
    console.error("Error approving student:", error)
    throw error
  }
}

// File upload functions
export const uploadFile = (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"))
      return
    }

    // Create a storage reference
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    // Listen for state changes, errors, and completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)
      },
      (error) => {
        // Handle errors
        reject(error)
      },
      async () => {
        // Upload completed successfully, get download URL
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadUrl)
        } catch (error) {
          reject(error)
        }
      },
    )
  })
}

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

// Document upload and approval
export const uploadStudentDocument = async (
  studentId: string,
  docType: string,
  file: File,
  fileName: string,
): Promise<void> => {
  try {
    // Upload file to Firebase Storage
    const filePath = `students/${studentId}/documents/${docType}_${Date.now()}.pdf`
    const downloadUrl = await uploadFile(file, filePath)

    // Add document record to Firestore
    const docRef = doc(collection(db, `students/${studentId}/documents`), docType)
    await setDoc(
      docRef,
      {
        type: docType,
        url: downloadUrl,
        status: "Pending",
        fileName: fileName,
        filePath: filePath,
        uploadedAt: serverTimestamp(),
      },
      { merge: true },
    )

    // Add to activity log
    const activityRef = doc(collection(db, `students/${studentId}/activity`))
    await setDoc(activityRef, {
      type: "Document",
      action: "Uploaded",
      detail: docType,
      timestamp: serverTimestamp(),
    })

    // Update student's lastActivity
    await updateDoc(doc(db, "students", studentId), {
      lastActivity: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    throw error
  }
}

export const approveDocument = async (studentId: string, docId: string): Promise<void> => {
  try {
    // Update document status
    const docRef = doc(db, `students/${studentId}/documents`, docId)
    await updateDoc(docRef, {
      status: "Approved",
      approvedAt: serverTimestamp(),
    })

    // Get document data for activity log
    const docSnap = await getDoc(docRef)
    const docData = docSnap.data()

    // Add to activity log
    const activityRef = doc(collection(db, `students/${studentId}/activity`))
    await setDoc(activityRef, {
      type: "Document",
      action: "Approved",
      detail: docData?.type || docId,
      timestamp: serverTimestamp(),
    })

    // Update student's lastActivity
    await updateDoc(doc(db, "students", studentId), {
      lastActivity: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error approving document:", error)
    throw error
  }
}

export const rejectDocument = async (studentId: string, docId: string, reason: string): Promise<void> => {
  try {
    // Update document status
    const docRef = doc(db, `students/${studentId}/documents`, docId)
    await updateDoc(docRef, {
      status: "Rejected",
      rejectionReason: reason,
      rejectedAt: serverTimestamp(),
    })

    // Get document data for activity log
    const docSnap = await getDoc(docRef)
    const docData = docSnap.data()

    // Add to activity log
    const activityRef = doc(collection(db, `students/${studentId}/activity`))
    await setDoc(activityRef, {
      type: "Document",
      action: "Rejected",
      detail: docData?.type || docId,
      timestamp: serverTimestamp(),
    })

    // Update student's lastActivity
    await updateDoc(doc(db, "students", studentId), {
      lastActivity: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error rejecting document:", error)
    throw error
  }
}
