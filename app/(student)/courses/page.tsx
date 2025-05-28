"use client"

import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const { data: courses, loading, error } = useCollection("courses")

  const handleWatchCourse = (courseId: string) => {
    setSelectedCourse(courseId)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Educational Courses</h1>
        <p className="text-gray-600 mt-2">
          Watch these courses to prepare for your visa application and university journey
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No courses available yet</p>
          <p className="text-sm text-gray-400">Check back later for new educational content</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={course.thumbnail || "/placeholder.svg?height=200&width=350&query=educational video"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=350&query=educational video"
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{course.description}</p>
              </CardHeader>
              <CardContent>
                {course.duration && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <Button className="w-full" onClick={() => handleWatchCourse(course.id)}>
                  Watch Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCourse && courses && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{courses.find((c) => c.id === selectedCourse)?.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)}>
                Close
              </Button>
            </div>
            <div className="aspect-video">
              <iframe
                src={courses.find((c) => c.id === selectedCourse)?.videoUrl}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
