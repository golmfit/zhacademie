// hooks/use-storage.ts
import { useState } from "react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const storageRef = ref(storage, path)
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Track upload progress
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setUploadProgress(progress)
          },
          (error) => {
            // Handle errors
            setError(error)
            setIsUploading(false)
            reject(error)
          },
          async () => {
            // Upload completed successfully
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
            setIsUploading(false)
            setUploadProgress(100)
            resolve(downloadUrl)
          }
        )
      })
    } catch (err: any) {
      setError(err)
      setIsUploading(false)
      throw err
    }
  }

  return { uploadFile, isUploading, uploadProgress, error }
}
