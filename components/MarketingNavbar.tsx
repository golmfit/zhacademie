"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

function MarketingNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/home" className="flex items-center">
            <Image
              src="/zhacademie-logo.png"
              alt="ZHAcademie - Your Gateway to Study Abroad"
              width={240}
              height={53}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Hamburger (only visible on mobile) */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/home" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/book-consultation" className="nav-link">Book Consultation</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            
          </div>

          {/* Auth buttons (desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/register"><Button>Get Started</Button></Link> */}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/home" className="block">Home</Link>
          <Link href="/about" className="block">About</Link>
          <Link href="/blog" className="block">Blog</Link>
          <Link href="/contact" className="block">Contact</Link>
          <Link href="/login"><Button variant="ghost" className="w-full mt-2">Login</Button></Link>
          <Link href="/register"><Button className="w-full mt-2">Get Started</Button></Link>
        </div>
      )}
    </nav>
  )
}

export default MarketingNavbar
