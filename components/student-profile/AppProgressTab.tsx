"use client"

import { useState, useEffect } from "react"
import { doc, setDoc, collection, serverTimestamp, onSnapshot, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateStudentAppStatus } from "@/lib/progress-utils"

type ProgressStatus = "Not Started" | "Completed"

interface ProgressStage {
  id: string
  name: string
  status: ProgressStatus
  updatedAt?: Date | null
}

interface AppProgressTabProps {
  studentId: string
}

// Application progress stages
const APP_STAGES = [
  { id: "initialConsultation", name: "Initial Consultation" },
  { id: "documentCollection", name: "Document Collection" },
  { id: "universityApplications", name: "University Applications" },
  { id: "i20", name: "I-20" },
]

export function AppProgressTab({ studentId }: AppProgressTabProps) {
  const [stages, setStages] = useState<ProgressStage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize stages with default values
  useEffect(() => {
    // Create default stages
    const defaultStages = APP_STAGES.map((stage) => ({
      id: stage.id,
      name: stage.name,
      status: "Not Started" as ProgressStatus,
      updatedAt: null,
    }))

    setStages(defaultStages)
  }, [])

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    if (!studentId) return

    setLoading(true)
    console.log(`DEBUG: Setting up app progress listener for student ${studentId}`)

    // First, ensure all stage documents exist
    const initializeStages = async () => {
      try {
        const batch = []
        for (const stage of APP_STAGES) {
          const stageRef = doc(db, `students/${studentId}/appProgress/${stage.id}`)
          const stageDoc = await getDocs(collection(db, `students/${studentId}/appProgress`))

          // Only create if it doesn't exist
          if (!stageDoc.docs.some((doc) => doc.id === stage.id)) {
            console.log(`DEBUG: Creating app stage ${stage.id}`)
            batch.push(
              setDoc(
                stageRef,
                {
                  status: "Not Started",
                  updatedAt: serverTimestamp(),
                },
                { merge: true },
              ),
            )
          }
        }

        // Execute all promises
        if (batch.length > 0) {
          await Promise.all(batch)
          console.log(`DEBUG: Created ${batch.length} missing app stages`)
        }
      } catch (error) {
        console.error("Error initializing app stages:", error)
      }
    }

    // Initialize stages first
    initializeStages()

    const appProgressRef = collection(db, `students/${studentId}/appProgress`)

    const unsubscribe = onSnapshot(
      appProgressRef,
      (snapshot) => {
        console.log(`DEBUG: App progress snapshot received, docs: ${snapshot.docs.length}`)
        const stagesData: Record<string, ProgressStage> = {}

        // Initialize with default stages
        APP_STAGES.forEach((stage) => {
          stagesData[stage.id] = {
            id: stage.id,
            name: stage.name,
            status: "Not Started",
            updatedAt: null,
          }
        })

        // Update with data from Firestore
        snapshot.docs.forEach((doc) => {
          const data = doc.data()
          const stageId = doc.id
          console.log(`DEBUG: App stage ${stageId} data:`, data)

          if (stagesData[stageId]) {
            stagesData[stageId] = {
              ...stagesData[stageId],
              status: data.status || "Not Started",
              updatedAt: data.updatedAt?.toDate() || null,
            }
          }
        })

        // Convert to array and sort by the order in APP_STAGES
        const sortedStages = APP_STAGES.map((stage) => stagesData[stage.id])
        console.log("DEBUG: Sorted app stages:", sortedStages.map((s) => `${s.id}: ${s.status}`).join(", "))
        setStages(sortedStages)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching application progress:", err)
        setError("Failed to load application progress data")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [studentId])

  // Update stage status in Firestore
  const updateStageStatus = async (stageId: string, status: ProgressStatus) => {
    if (!studentId) return

    try {
      console.log(`DEBUG: Updating app stage ${stageId} to ${status}`)

      // Optimistically update UI
      setStages((prevStages) =>
        prevStages.map((stage) => (stage.id === stageId ? { ...stage, status, updatedAt: new Date() } : stage)),
      )

      // Update in Firestore
      const stageRef = doc(db, `students/${studentId}/appProgress/${stageId}`)
      await setDoc(
        stageRef,
        {
          status,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      // Log current stages after update
      console.log(
        "DEBUG: Current app stages after update:",
        stages.map((s) => `${s.id}: ${s.id === stageId ? status : s.status}`).join(", "),
      )

      // Update the overall app status
      await updateStudentAppStatus(studentId)
    } catch (err) {
      console.error("Error updating application stage:", err)
      setError("Failed to update stage status")

      // Revert optimistic update on error
      setStages((prevStages) => [...prevStages])
    }
  }

  // Check if all stages are completed
  const allStagesCompleted = stages.every((stage) => stage.status === "Completed")
  console.log(`DEBUG: All app stages completed: ${allStagesCompleted}`)

  // Find the current active stage (first non-completed stage)
  const currentStageIndex = stages.findIndex((stage) => stage.status !== "Completed")

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Loading application progress...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Application Progress</h3>

        {allStagesCompleted && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>All application stages completed successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`p-3 rounded-md border transition-colors ${
                stage.status === "Completed"
                  ? "border-green-200 bg-green-50"
                  : index === currentStageIndex
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {stage.status === "Completed" && <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />}
                  <Label htmlFor={`app-${stage.id}`} className="font-medium">
                    {stage.name}
                  </Label>
                </div>

                <Select
                  value={stage.status}
                  onValueChange={(value: string) => updateStageStatus(stage.id, value as ProgressStatus)}
                >
                  <SelectTrigger id={`app-${stage.id}`} className="w-[140px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {stage.updatedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {stage.updatedAt.toLocaleDateString()} at {stage.updatedAt.toLocaleTimeString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
