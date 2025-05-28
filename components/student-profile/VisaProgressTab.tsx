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

interface VisaProgressTabProps {
  studentId: string
}

// Visa progress stages
const VISA_STAGES = [
  { id: "ds160", name: "DS-160" },
  { id: "payFee", name: "Pay Visa Fee" },
  { id: "scheduleInterview", name: "Schedule Interview" },
  { id: "attendInterview", name: "Attend Interview" },
]

export function VisaProgressTab({ studentId }: VisaProgressTabProps) {
  const [stages, setStages] = useState<ProgressStage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize stages with default values
  useEffect(() => {
    // Create default stages
    const defaultStages = VISA_STAGES.map((stage) => ({
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
    console.log(`DEBUG: Setting up visa progress listener for student ${studentId}`)

    // First, ensure all stage documents exist
    const initializeStages = async () => {
      try {
        const batch = []
        for (const stage of VISA_STAGES) {
          const stageRef = doc(db, `students/${studentId}/visaProgress/${stage.id}`)
          const stageDoc = await getDocs(collection(db, `students/${studentId}/visaProgress`))

          // Only create if it doesn't exist
          if (!stageDoc.docs.some((doc) => doc.id === stage.id)) {
            console.log(`DEBUG: Creating visa stage ${stage.id}`)
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
          console.log(`DEBUG: Created ${batch.length} missing visa stages`)
        }
      } catch (error) {
        console.error("Error initializing visa stages:", error)
      }
    }

    // Initialize stages first
    initializeStages()

    const visaProgressRef = collection(db, `students/${studentId}/visaProgress`)

    const unsubscribe = onSnapshot(
      visaProgressRef,
      (snapshot) => {
        console.log(`DEBUG: Visa progress snapshot received, docs: ${snapshot.docs.length}`)
        const stagesData: Record<string, ProgressStage> = {}

        // Initialize with default stages
        VISA_STAGES.forEach((stage) => {
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
          console.log(`DEBUG: Visa stage ${stageId} data:`, data)

          if (stagesData[stageId]) {
            stagesData[stageId] = {
              ...stagesData[stageId],
              status: data.status || "Not Started",
              updatedAt: data.updatedAt?.toDate() || null,
            }
          }
        })

        // Convert to array and sort by the order in VISA_STAGES
        const sortedStages = VISA_STAGES.map((stage) => stagesData[stage.id])
        console.log("DEBUG: Sorted visa stages:", sortedStages.map((s) => `${s.id}: ${s.status}`).join(", "))
        setStages(sortedStages)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching visa progress:", err)
        setError("Failed to load visa progress data")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [studentId])

  // Update stage status in Firestore
  const updateStageStatus = async (stageId: string, status: ProgressStatus) => {
    if (!studentId) return

    try {
      console.log(`DEBUG: Updating visa stage ${stageId} to ${status}`)

      // Optimistically update UI
      setStages((prevStages) =>
        prevStages.map((stage) => (stage.id === stageId ? { ...stage, status, updatedAt: new Date() } : stage)),
      )

      // Update in Firestore
      const stageRef = doc(db, `students/${studentId}/visaProgress/${stageId}`)
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
        "DEBUG: Current visa stages after update:",
        stages.map((s) => `${s.id}: ${s.id === stageId ? status : s.status}`).join(", "),
      )

      // Update the overall app status
      await updateStudentAppStatus(studentId)
    } catch (err) {
      console.error("Error updating visa stage:", err)
      setError("Failed to update stage status")

      // Revert optimistic update on error
      setStages((prevStages) => [...prevStages])
    }
  }

  // Check if all stages are completed
  const allStagesCompleted = stages.every((stage) => stage.status === "Completed")
  console.log(`DEBUG: All visa stages completed: ${allStagesCompleted}`)

  // Find the current active stage (first non-completed stage)
  const currentStageIndex = stages.findIndex((stage) => stage.status !== "Completed")

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Loading visa progress...</p>
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
        <h3 className="text-lg font-semibold mb-4">Visa Application Progress</h3>

        {allStagesCompleted && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>All visa stages completed successfully!</AlertDescription>
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
                  <Label htmlFor={`visa-${stage.id}`} className="font-medium">
                    {stage.name}
                  </Label>
                </div>

                <Select
                  value={stage.status}
                  onValueChange={(value: string) => updateStageStatus(stage.id, value as ProgressStatus)}
                >
                  <SelectTrigger id={`visa-${stage.id}`} className="w-[140px]">
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
