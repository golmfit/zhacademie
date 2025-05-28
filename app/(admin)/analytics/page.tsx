"use client"

import { useState, useEffect } from "react"
import { useCollection } from "@/hooks/use-firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function AdminAnalyticsPage() {
  const { data: students, loading: loadingStudents } = useCollection("students")
  const [visaProgress, setVisaProgress] = useState(0)
  const [docsProgress, setDocsProgress] = useState(0)
  const [countryData, setCountryData] = useState<any[]>([])

  useEffect(() => {
    if (!loadingStudents && students?.length > 0) {
      // Calculate visa progress percentage
      const visaCompleted = students.filter((student) => student.visaStage === "Completed").length
      const visaPercentage = Math.round((visaCompleted / students.length) * 100)
      setVisaProgress(visaPercentage)

      // Calculate documents progress percentage
      // This is a simplified calculation - in a real app, you'd check each student's documents
      const docsCompleted = students.filter((student) => student.docsComplete === true).length
      const docsPercentage = Math.round((docsCompleted / students.length) * 100)
      setDocsProgress(docsPercentage)

      // Calculate country distribution
      const countries: Record<string, number> = {}
      students.forEach((student) => {
        const country = student.country || "Unknown"
        countries[country] = (countries[country] || 0) + 1
      })

      const countryPieData = Object.entries(countries).map(([name, value]) => ({
        name,
        value,
      }))

      setCountryData(countryPieData)
    }
  }, [students, loadingStudents])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Visa Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Visa Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${(visaProgress * 2.51327).toFixed(2)} 251.327`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{visaProgress}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Students with completed visa process</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documents Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <circle
                      className="text-green-500 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${(docsProgress * 2.51327).toFixed(2)} 251.327`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{docsProgress}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Students with completed documents</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Country Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Student Countries</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <Skeleton className="h-64 w-full" />
            ) : countryData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} students`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
