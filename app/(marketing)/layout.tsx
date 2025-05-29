import type React from "react"
import Footer from "@/components/marketing/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <Footer />
    </div>
  )
}
