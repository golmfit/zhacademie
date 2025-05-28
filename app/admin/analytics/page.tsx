"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { collection, collectionGroup, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalApplications: 0,
    totalDocuments: 0,
    pendingStudents: 0,
    completedApplications: 0,
    documentApprovalRate: 0,
  })
  const [countryData, setCountryData] = useState([])
  const [documentStatusData, setDocumentStatusData] = useState([])
  const [applicationStatusData, setApplicationStatusData] = useState([])
  const [visaProgressData, setVisaProgressData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const unsubscribers = []

    // 1. Total Students and Country Distribution
    const studentsUnsubscribe = onSnapshot(
      collection(db, "students"),
      (snapshot) => {
        setMetrics((prev) => ({ ...prev, totalStudents: snapshot.size }))

        // Process country data for pie chart
        const countries = {}
        snapshot.docs.forEach((doc) => {
          const country = doc.data().country || "Unknown"
          countries[country] = (countries[country] || 0) + 1
        })

        const countryPieData = Object.entries(countries).map(([name, value]) => ({
          name,
          value,
        }))

        setCountryData(countryPieData)
      },
      (error) => {
        console.error("Error listening to students collection:", error)
      },
    )
    unsubscribers.push(studentsUnsubscribe)

    // 2. Total Applications and Application Status Distribution
    const applicationsUnsubscribe = onSnapshot(
      collectionGroup(db, "applications"),
      (snapshot) => {
        const totalApplications = snapshot.size
        const completedApplications = snapshot.docs.filter((doc) => doc.data().status === "Completed").length

        // Process application status data for bar chart
        const statusCounts = {
          Pending: 0,
          "In Progress": 0,
          Completed: 0,
          Rejected: 0,
        }

        snapshot.docs.forEach((doc) => {
          const status = doc.data().status || "Pending"
          statusCounts[status] = (statusCounts[status] || 0) + 1
        })

        const applicationStatusChartData = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value,
        }))

        setApplicationStatusData(applicationStatusChartData)
        setMetrics((prev) => ({
          ...prev,
          totalApplications,
          completedApplications,
        }))
      },
      (error) => {
        console.error("Error listening to applications collection group:", error)
      },
    )
    unsubscribers.push(applicationsUnsubscribe)

    // 3. Total Documents and Document Status Distribution
    const documentsUnsubscribe = onSnapshot(
      collectionGroup(db, "documents"),
      (snapshot) => {
        const totalDocuments = snapshot.size
        const approvedDocuments = snapshot.docs.filter((doc) => doc.data().status === "Approved").length

        const approvalRate = totalDocuments > 0 ? Math.round((approvedDocuments / totalDocuments) * 100) : 0

        // Process document status data for pie chart
        const statusCounts = {
          Pending: 0,
          Approved: 0,
          Rejected: 0,
        }

        snapshot.docs.forEach((doc) => {
          const status = doc.data().status || "Pending"
          statusCounts[status] = (statusCounts[status] || 0) + 1
        })

        const documentStatusChartData = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value,
        }))

        setDocumentStatusData(documentStatusChartData)
        setMetrics((prev) => ({
          ...prev,
          totalDocuments,
          documentApprovalRate: approvalRate,
        }))
      },
      (error) => {
        console.error("Error listening to documents collection group:", error)
      },
    )
    unsubscribers.push(documentsUnsubscribe)

    // 4. Pending Students
    const pendingUnsubscribe = onSnapshot(
      collection(db, "registrationQueue"),
      (snapshot) => {
        setMetrics((prev) => ({ ...prev, pendingStudents: snapshot.size }))
      },
      (error) => {
        console.error("Error listening to registrationQueue collection:", error)
      },
    )
    unsubscribers.push(pendingUnsubscribe)

    // 5. Visa Progress Distribution
    const visaProgressUnsubscribe = onSnapshot(
      collection(db, "students"),
      (snapshot) => {
        // Process visa progress data for area chart
        const stageCounts = {
          "Not Started": 0,
          "Documents Submitted": 0,
          "Interview Scheduled": 0,
          "Interview Completed": 0,
          "Visa Approved": 0,
          Completed: 0,
        }

        snapshot.docs.forEach((doc) => {
          const stage = doc.data().visaStage || "Not Started"
          stageCounts[stage] = (stageCounts[stage] || 0) + 1
        })

        const visaProgressChartData = Object.entries(stageCounts).map(([name, value]) => ({
          name,
          value,
        }))

        setVisaProgressData(visaProgressChartData)
      },
      (error) => {
        console.error("Error listening to students collection for visa data:", error)
      },
    )
    unsubscribers.push(visaProgressUnsubscribe)

    setIsLoading(false)

    // Clean up all listeners when component unmounts
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  const MetricCard = ({ title, value, description, color = "text-gray-500" }: any) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{isLoading ? <Skeleton className="h-8 w-20" /> : value}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Students"
          value={metrics.totalStudents}
          description="Enrolled students"
          color="text-blue-600"
        />

        <MetricCard
          title="Total Applications"
          value={metrics.totalApplications}
          description="University applications"
          color="text-purple-600"
        />

        <MetricCard
          title="Total Documents"
          value={metrics.totalDocuments}
          description="Uploaded documents"
          color="text-green-600"
        />

        <MetricCard
          title="Pending Students"
          value={metrics.pendingStudents}
          description="Awaiting approval"
          color="text-orange-600"
        />

        <MetricCard
          title="Completed Applications"
          value={metrics.completedApplications}
          description="Successfully completed"
          color="text-emerald-600"
        />

        <MetricCard
          title="Document Approval Rate"
          value={`${metrics.documentApprovalRate}%`}
          description="Percentage approved"
          color="text-indigo-600"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="visa">Visa Progress</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Country Distribution</CardTitle>
              <CardDescription>Breakdown of students by country of origin</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : countryData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-gray-500">No data available</div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={countryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
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
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
              <CardDescription>Breakdown of applications by current status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : applicationStatusData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-gray-500">No data available</div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={applicationStatusData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} applications`, "Count"]} />
                      <Legend />
                      <Bar dataKey="value" name="Applications" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Status Distribution</CardTitle>
              <CardDescription>Breakdown of documents by approval status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : documentStatusData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-gray-500">No data available</div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {documentStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Approved" ? "#10b981" : entry.name === "Rejected" ? "#ef4444" : "#f59e0b"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} documents`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visa Progress Tab */}
        <TabsContent value="visa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visa Progress Distribution</CardTitle>
              <CardDescription>Breakdown of students by visa application stage</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : visaProgressData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-gray-500">No data available</div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={visaProgressData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} students`, "Count"]} />
                      <Area type="monotone" dataKey="value" name="Students" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
