"use client"

import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Trash2, Play, Clock, AlertCircle } from "lucide-react"

export default function AdminCoursesPage() {
  const { data: courses, loading } = useCollection("courses")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Extract YouTube video ID from URL
      const youtubeMatch = formData.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      if (!youtubeMatch) {
        throw new Error("Please enter a valid YouTube URL")
      }

      const videoId = youtubeMatch[1]
      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

      const courseData = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        videoUrl: embedUrl,
        thumbnail: thumbnail,
        createdAt: editingCourse ? editingCourse.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      if (editingCourse) {
        await setDoc(doc(db, "courses", editingCourse.id), courseData)
      } else {
        await setDoc(doc(db, "courses", Date.now().toString()), courseData)
      }

      setFormData({ title: "", description: "", duration: "", videoUrl: "" })
      setIsAddModalOpen(false)
      setEditingCourse(null)
    } catch (err) {
      setError(err.message || "Failed to save course")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      videoUrl: course.videoUrl,
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", courseId))
      } catch (err) {
        console.error("Error deleting course:", err)
      }
    }
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setEditingCourse(null)
    setFormData({ title: "", description: "", duration: "", videoUrl: "" })
    setError(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45 min"
                  required
                />
              </div>
              <div>
                <Label htmlFor="videoUrl">YouTube URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingCourse ? "Update" : "Add"} Course
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
      ) : !courses || courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Play className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No courses added yet</p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={course.thumbnail || "/placeholder.svg?height=200&width=350&query=video course"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=350&query=video course"
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
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(course)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
