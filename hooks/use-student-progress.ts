"use client"

import { useState, useEffect } from "react"
import { collection, onSnapshot, query, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export type ProgressStage = {
  id: string
  name: string
  status: "Not Started" | "Completed"
  updatedAt?: Date | null
}

export type ProgressStats = {
  appProgressPercentage: number
  visaProgressPercentage: number
  appStages: ProgressStage[]
  visaStages: ProgressStage[]
  overallStatus: "Not Started" | "In Progress" | "Completed"
  isLoading: boolean
}

// Define the expected stages for app and visa progress
const APP_STAGES = [
  { id: "initialConsultation", name: "Initial Consultation" },
  { id: "documentCollection", name: "Document Collection" },
  { id: "universityApplications", name: "University Applications" },
  { id: "i20", name: "I-20" },
]

const VISA_STAGES = [
  { id: "ds160", name: "DS-160" },
  { id: "payFee", name: "Pay Visa Fee" },
  { id: "scheduleInterview", name: "Schedule Interview" },
  { id: "attendInterview", name: "Attend Interview" },
]

/**
 * Custom hook to monitor student progress in real-time
 */
export function useStudentProgress(): ProgressStats {
  const { user, userData } = useAuth()
  const [appStages, setAppStages] = useState<ProgressStage[]>([])
  const [visaStages, setVisaStages] = useState<ProgressStage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [overallStatus, setOverallStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started")

  // Initialize with default stages
  useEffect(() => {
    const defaultAppStages = APP_STAGES.map(stage => ({
      id: stage.id,
      name: stage.name,
      status: "Not Started" as const,
      updatedAt: null
    }))
    
    const defaultVisaStages = VISA_STAGES.map(stage => ({
      id: stage.id,
      name: stage.name,
      status: "Not Started" as const,
      updatedAt: null
    }))
    
    setAppStages(defaultAppStages)
    setVisaStages(defaultVisaStages)
  }, [])

  // Set up real-time listeners for progress collections
  useEffect(() => {
    // Make sure user is authenticated and verified as a student
    if (!user?.uid || !userData || userData.role !== "student") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Setting up progress listeners for student:", user.uid);

    // Instead of using onSnapshot which might fail due to permissions,
    // let's use a one-time fetch with getDocs and then set up a polling mechanism
    const fetchProgressData = async () => {
      try {
        // Get the current app status
        const studentRef = doc(db, "students", user.uid);
        const studentDoc = await getDoc(studentRef);
        if (studentDoc.exists()) {
          setOverallStatus(studentDoc.data().appStatus || "Not Started");
        }

        // Fetch app progress stages
        try {
          const appProgressRef = collection(db, `students/${user.uid}/appProgress`);
          const appProgressSnap = await getDocs(query(appProgressRef));
          
          // Create a map of stages with default values
          const stagesMap: Record<string, ProgressStage> = {};
          APP_STAGES.forEach(stage => {
            stagesMap[stage.id] = {
              id: stage.id,
              name: stage.name,
              status: "Not Started",
              updatedAt: null
            };
          });
          
          // Update with data from Firestore
          appProgressSnap.docs.forEach(doc => {
            const data = doc.data();
            const stageId = doc.id;
            
            if (stagesMap[stageId]) {
              stagesMap[stageId] = {
                ...stagesMap[stageId],
                status: data.status || "Not Started",
                updatedAt: data.updatedAt?.toDate() || null
              };
            }
          });
          
          // Convert to array and sort by the order in APP_STAGES
          const sortedStages = APP_STAGES.map(stage => stagesMap[stage.id]);
          setAppStages(sortedStages);
        } catch (error) {
          console.error("Error fetching app progress:", error);
        }

        // Fetch visa progress stages
        try {
          const visaProgressRef = collection(db, `students/${user.uid}/visaProgress`);
          const visaProgressSnap = await getDocs(query(visaProgressRef));
          
          // Create a map of stages with default values
          const stagesMap: Record<string, ProgressStage> = {};
          VISA_STAGES.forEach(stage => {
            stagesMap[stage.id] = {
              id: stage.id,
              name: stage.name,
              status: "Not Started",
              updatedAt: null
            };
          });
          
          // Update with data from Firestore
          visaProgressSnap.docs.forEach(doc => {
            const data = doc.data();
            const stageId = doc.id;
            
            if (stagesMap[stageId]) {
              stagesMap[stageId] = {
                ...stagesMap[stageId],
                status: data.status || "Not Started",
                updatedAt: data.updatedAt?.toDate() || null
              };
            }
          });
          
          // Convert to array and sort by the order in VISA_STAGES
          const sortedStages = VISA_STAGES.map(stage => stagesMap[stage.id]);
          setVisaStages(sortedStages);
        } catch (error) {
          console.error("Error fetching visa progress:", error);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchProgressData();

    // Set up polling every 30 seconds to check for updates
    // This is a fallback in case real-time listeners don't work due to permissions
    const intervalId = setInterval(fetchProgressData, 30000);

    // Try to set up real-time listeners, but handle permission errors gracefully
    let unsubscribeApp: (() => void) | undefined;
    let unsubscribeVisa: (() => void) | undefined;
    let unsubscribeStudent: (() => void) | undefined;

    try {
      // Listen for app progress changes
      const appProgressRef = collection(db, `students/${user.uid}/appProgress`);
      unsubscribeApp = onSnapshot(
        query(appProgressRef),
        (snapshot) => {
          console.log("App progress update received, docs:", snapshot.docs.length);
          
          // Create a map of stages with default values
          const stagesMap: Record<string, ProgressStage> = {};
          APP_STAGES.forEach(stage => {
            stagesMap[stage.id] = {
              id: stage.id,
              name: stage.name,
              status: "Not Started",
              updatedAt: null
            };
          });
          
          // Update with data from Firestore
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const stageId = doc.id;
            
            if (stagesMap[stageId]) {
              stagesMap[stageId] = {
                ...stagesMap[stageId],
                status: data.status || "Not Started",
                updatedAt: data.updatedAt?.toDate() || null
              };
            }
          });
          
          // Convert to array and sort by the order in APP_STAGES
          const sortedStages = APP_STAGES.map(stage => stagesMap[stage.id]);
          setAppStages(sortedStages);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error listening to app progress:", error);
          // Don't set isLoading to false here, as we'll still try to fetch data
        }
      );
    } catch (error) {
      console.error("Error setting up app progress listener:", error);
    }

    try {
      // Listen for visa progress changes
      const visaProgressRef = collection(db, `students/${user.uid}/visaProgress`);
      unsubscribeVisa = onSnapshot(
        query(visaProgressRef),
        (snapshot) => {
          console.log("Visa progress update received, docs:", snapshot.docs.length);
          
          // Create a map of stages with default values
          const stagesMap: Record<string, ProgressStage> = {};
          VISA_STAGES.forEach(stage => {
            stagesMap[stage.id] = {
              id: stage.id,
              name: stage.name,
              status: "Not Started",
              updatedAt: null
            };
          });
          
          // Update with data from Firestore
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const stageId = doc.id;
            
            if (stagesMap[stageId]) {
              stagesMap[stageId] = {
                ...stagesMap[stageId],
                status: data.status || "Not Started",
                updatedAt: data.updatedAt?.toDate() || null
              };
            }
          });
          
          // Convert to array and sort by the order in VISA_STAGES
          const sortedStages = VISA_STAGES.map(stage => stagesMap[stage.id]);
          setVisaStages(sortedStages);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error listening to visa progress:", error);
          // Don't set isLoading to false here, as we'll still try to fetch data
        }
      );
    } catch (error) {
      console.error("Error setting up visa progress listener:", error);
    }

    try {
      // Listen for overall app status changes
      const studentRef = doc(db, "students", user.uid);
      unsubscribeStudent = onSnapshot(
        studentRef,
        (doc) => {
          if (doc.exists()) {
            setOverallStatus(doc.data().appStatus || "Not Started");
          }
        },
        (error) => {
          console.error("Error listening to student document:", error);
        }
      );
    } catch (error) {
      console.error("Error setting up student document listener:", error);
    }

    return () => {
      clearInterval(intervalId);
      if (unsubscribeApp) unsubscribeApp();
      if (unsubscribeVisa) unsubscribeVisa();
      if (unsubscribeStudent) unsubscribeStudent();
    };
  }, [user?.uid, userData])

  // Calculate progress percentages
  const appProgressPercentage = calculateProgressPercentage(appStages)
  const visaProgressPercentage = calculateProgressPercentage(visaStages)

  return {
    appProgressPercentage,
    visaProgressPercentage,
    appStages,
    visaStages,
    overallStatus,
    isLoading
  }
}

// Helper function to calculate progress percentage
function calculateProgressPercentage(stages: ProgressStage[]): number {
  if (stages.length === 0) return 0
  
  const completedStages = stages.filter(stage => stage.status === "Completed").length
  return Math.round((completedStages / stages.length) * 100)
}
