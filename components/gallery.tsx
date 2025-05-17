"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const galleryImages = [
  {
    id: 1,
    src: "/Gallary 1.jpg?height=600&width=800",
    alt: "Education Program",
    title: "Education Program",
    description: "Free After School Tutoring Program",
  },
  {
    id: 2,
    src: "/Gallary 2.jpg?height=600&width=800",
    alt: "Education Program",
    title: "Education Program",
    description: "Distributing educational materials to children",
  },
  {
    id: 3,
    src: "/Gallary 3.jpg?height=600&width=800",
    alt: "Team Meeting to Launch New Program",
    title: "Team Meeting to Launch New Program",
    description: "Environmental conservation initiative Meeting",
  },
  {
    id: 4,
    src: "/Gallary 4.jpg?height=600&width=800",
    alt: "Tree Plantation Drive",
    title: "Tree Plantation Drive",
    description: "Awareness Campaign to plant trees",
  },
  {
    id: 5,
    src: "/Gallary 5.jpg?height=600&width=800",
    alt: "GauMitra Initiative",
    title: "GauMitra Initiative",
    description: "Cow Protection and Gau Seva Program",
  },
  {
    id: 6,
    src: "/Gallary 6.jpg?height=600&width=800",
    alt: "Self-Defence Training",
    title: "Self-Defence Training",
    description: "After School self-defence training program",
  },
  {
    id: 7,
    src: "/Gallary 7.jpg?height=600&width=800",
    alt: "Education Program",
    title: "Education Program",
    description: "Free After School Tutoring Program",
  },
  {
    id: 8,
    src: "/Gallary 8.jpg?height=600&width=800",
    alt: "Education Program",
    title: "Education Program",
    description: "Distributing educational materials to children",
  },
  {
    id: 9,
    src: "/Gallary 9.jpg?height=600&width=800",
    alt: "Tree Plantation Drive",
    title: "Tree Plantation Drive",
    description: "Awareness Campaign to plant trees",
  },
  {
    id: 10,
    src: "/Gallary 10.jpg?height=600&width=800",
    alt: "Health Awareness Campaign",
    title: "Health Awareness Campaign",
    description: "Campaign to create awareness about cleenliness and sanitation",
  },
  {
    id: 11,
    src: "/Gallary 11.jpg?height=600&width=800",
    alt: "Yoga Sessions",
    title: "Yoga Sessions",
    description: "After School Yoga Sessions",
  },
  {
    id: 12,
    src: "/Gallary 12.jpg?height=600&width=800",
    alt: "Education Program",
    title: "Education Program",
    description: "Distributing educational materials to children",
  },
]

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      handleNext()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      handlePrev()
    }
  }

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1))
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, galleryImages.length])

  const pauseAutoPlay = () => setIsAutoPlaying(false)
  const resumeAutoPlay = () => setIsAutoPlaying(true)

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gallery</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A glimpse of our activities and the impact we're making in communities.
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {galleryImages.map((image) => (
              <div key={image.id} className="min-w-full">
                <div className="relative aspect-video">
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                    <h3 className="text-xl font-semibold">{image.title}</h3>
                    <p className="text-sm text-white/80">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === index ? "bg-white w-4" : "bg-white/50",
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
