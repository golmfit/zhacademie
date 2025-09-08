import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import MarketingNavbar from "@/components/MarketingNavbar";
import MarketingFooter from "@/components/MarketingFooter";
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ZHAcademie - Platform",
  description: "Streamline your student visa application process with ZHAcademie",
    generator: 'v0.dev',
    icons: {
      icon: "/zhicon.png"
}

}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/app/zh.png" />
        
      </head>
      <body className={inter.className}>
        <MarketingNavbar />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <MarketingFooter />
      </body>
    </html>
  )
}