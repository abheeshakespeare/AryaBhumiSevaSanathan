"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { JoinForm } from "./join-form"
import PDFViewer from "./pdf-viewer"

const navigation = [
  { name: "Join Us", href: "#join" },
  { name: "About Us", href: "#about" },
  { name: "NGO Profile", href: "#projects" },
  { name: "Contact Us", href: "#contact" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isJoinFormOpen, setIsJoinFormOpen] = useState(false)
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsJoinFormOpen(true)
  }

  const handleNGOProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsPDFViewerOpen(true)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.jpg?height=40&width=40"
                  alt="Arya Bhumi Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-teal-700 font-bold text-xl md:text-2xl">ARYA BHUMI SEVA SANSTHAN</span>
              </Link>
            </div>
            <nav className="hidden md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={
                    item.name === "Join Us"
                      ? handleJoinClick
                      : item.name === "NGO Profile"
                      ? handleNGOProfileClick
                      : undefined
                  }
                  className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white rounded-md">
                <Link href="#donate">Donate Now</Link>
              </Button>
            </nav>
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle className="text-left">Navigation Menu</SheetTitle>
                  <div className="flex flex-col space-y-4 mt-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={
                          item.name === "Join Us"
                            ? handleJoinClick
                            : item.name === "NGO Profile"
                            ? handleNGOProfileClick
                            : undefined
                        }
                        className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                      <Link href="#donate">Donate Now</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <JoinForm isOpen={isJoinFormOpen} onClose={() => setIsJoinFormOpen(false)} />
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onClose={() => setIsPDFViewerOpen(false)}
        pdfUrl="/pdf/ARYA BHUMI SEVA SANSTHAN.pdf"
      />
    </>
  )
}
