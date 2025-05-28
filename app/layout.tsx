import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ZHAcademie - Student Visa Management Platform",
  description: "Streamline your student visa application process with ZHAcademie",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// Make sure the layout doesn't add any navigation or footer elements
// that would conflict with the marketing layout

// The layout should be minimal, just providing the basic HTML structure
// and any global styles or providers
