// app/components/MarketingNavbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MarketingNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
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

          <div className="hidden md:flex space-x-6">
            <Link href="/home" className="relative px-3 py-2 text-gray-700 font-medium group">
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-y-6 bg-primary/10 group-hover:translate-y-0 group-hover:opacity-100 opacity-0 rounded-md"></span>
              <span className="relative group-hover:text-primary transition-colors duration-300 flex items-center">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

            <Link href="/about" className="relative px-3 py-2 text-gray-700 font-medium group">
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-y-6 bg-primary/10 group-hover:translate-y-0 group-hover:opacity-100 opacity-0 rounded-md"></span>
              <span className="relative group-hover:text-primary transition-colors duration-300 flex items-center">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

            <Link href="/blog" className="relative px-3 py-2 text-gray-700 font-medium group">
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-y-6 bg-primary/10 group-hover:translate-y-0 group-hover:opacity-100 opacity-0 rounded-md"></span>
              <span className="relative group-hover:text-primary transition-colors duration-300 flex items-center">
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

            <Link href="/contact" className="relative px-3 py-2 text-gray-700 font-medium group">
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-y-6 bg-primary/10 group-hover:translate-y-0 group-hover:opacity-100 opacity-0 rounded-md"></span>
              <span className="relative group-hover:text-primary transition-colors duration-300 flex items-center">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
