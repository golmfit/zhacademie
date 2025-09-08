"use client"

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"

export default function Appointments() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "15min" })
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#2A3147" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-200px)]">
        <Cal
          namespace="15min"
          calLink="zhacademi/15min"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: "month_view" }}
        />
      </div>
    </div>
  )
}
