"use client"

import { useState, useEffect } from "react"
import { useDocument } from "@/hooks/use-firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock general info data
const mockGeneralInfo = {
  content: `# Student Visa Application Guide

## Overview
Welcome to ZHAcademie! This guide will help you navigate through your student visa application process.

## Important Documents Required
1. **Valid Passport** - Must be valid for at least 6 months beyond your intended stay
2. **Academic Transcripts** - Official transcripts from all previous institutions
3. **Bank Statements** - Proof of financial capability for your studies
4. **Letter of Acceptance** - From your chosen university
5. **DS-160 Confirmation** - For US visa applications

## Visa Application Process
### Step 1: Document Preparation
Ensure all your documents are complete and properly certified.

### Step 2: Online Application
Complete the online visa application form (DS-160 for US).

### Step 3: Fee Payment
Pay the non-refundable visa application fee.

### Step 4: Interview Scheduling
Schedule your visa interview at the nearest embassy/consulate.

### Step 5: Interview Preparation
Practice common interview questions and prepare your documents.

## Important Links
- [US Embassy Website](https://www.usembassy.gov)
- [UK Visa Information](https://www.gov.uk/student-visa)
- [Canada Study Permit](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html)

## Contact Information
For any questions or assistance, please contact:
- Email: info@zhacademie.com
- Phone: +1-234-567-8900
- Office Hours: Monday-Friday, 9 AM - 6 PM EST`,
  lastUpdated: new Date().toISOString(),
}

export default function GeneralInfoPage() {
  const { data: generalInfo, loading } = useDocument("generalInfo", "main")
  const [content, setContent] = useState("")

  useEffect(() => {
    if (generalInfo?.content) {
      setContent(generalInfo.content)
    } else if (!loading) {
      setContent(mockGeneralInfo.content)
    }
  }, [generalInfo, loading])

  const renderMarkdown = (markdown: string) => {
    // Simple markdown parser for demonstration
    return markdown.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-4 mt-6">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-3 mt-4">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mb-2 mt-3">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-6 mb-1">
            {line.substring(2)}
          </li>
        )
      } else if (line.match(/^\d+\. /)) {
        const content = line.replace(/^\d+\. /, "")
        const boldMatch = content.match(/\*\*(.*?)\*\*/)
        if (boldMatch) {
          const parts = content.split(/\*\*(.*?)\*\*/)
          return (
            <li key={index} className="ml-6 mb-2">
              <strong>{boldMatch[1]}</strong> - {parts[2]}
            </li>
          )
        }
        return (
          <li key={index} className="ml-6 mb-2">
            {content}
          </li>
        )
      } else if (line.includes("[") && line.includes("](")) {
        const linkMatch = line.match(/\[(.*?)\]$$(.*?)$$/)
        if (linkMatch) {
          return (
            <p key={index} className="mb-2">
              -{" "}
              <a
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {linkMatch[1]} <ExternalLink className="inline h-3 w-3" />
              </a>
            </p>
          )
        }
      } else if (line.trim() === "") {
        return <br key={index} />
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      )
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">General Information</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Student Visa Guide
          </CardTitle>
          {(generalInfo?.lastUpdated || mockGeneralInfo.lastUpdated) && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(generalInfo?.lastUpdated || mockGeneralInfo.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-6 w-1/2 mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">{renderMarkdown(content)}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
