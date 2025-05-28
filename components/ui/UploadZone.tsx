"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadZoneProps {
  onFileUpload?: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in MB
  currentFile?: {
    name: string
    url: string
    status: "Pending" | "Approved" | "Rejected"
  }
  disabled?: boolean
  className?: string
}

export function UploadZone({
  onFileUpload,
  accept = "application/pdf",
  maxSize = 10,
  currentFile,
  disabled = false,
  className,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (accept && !file.type.includes(accept.split("/")[1])) {
      return `Please upload a ${accept.split("/")[1].toUpperCase()} file`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      await onFileUpload?.(file)
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        await handleFileUpload(files[0])
      }
    },
    [disabled, onFileUpload],
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        await handleFileUpload(files[0])
      }
    },
    [onFileUpload],
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <File className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {currentFile ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(currentFile.status)}
              <div>
                <p className="text-sm font-medium text-gray-900">{currentFile.name}</p>
                <p className="text-xs text-gray-500">Status: {currentFile.status}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => window.open(currentFile.url, "_blank")}>
                View
              </Button>
              {(currentFile.status === "Rejected" || currentFile.status === "Pending") && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled || isUploading}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {isUploading ? "Uploading..." : "Replace"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragOver && !disabled ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? "Uploading..." : "Drop your PDF here, or"}
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600"
              disabled={disabled || isUploading}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              browse files
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">PDF files up to {maxSize}MB</p>
        </div>
      )}

      <input
        id="file-upload"
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}
