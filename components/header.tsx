"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { smoothScroll } from "@/lib/smoothScroll"

export default function Header() {
  const [isTransparent, setIsTransparent] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsTransparent(currentScrollY < 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    smoothScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? "bg-transparent" : "bg-black/90"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-2xl font-bold">
              Stralyze
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link href="#features" className="text-gray-300 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#case-studies" className="text-gray-300 hover:text-white">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-300 hover:text-white">
                  Testimonials
                </Link>
              </li>
            </ul>
          </nav>
          <div className="relative z-50">
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-gray-200 hover:text-black border-white relative z-50"
            >
              <Link href="#cta">Get a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
