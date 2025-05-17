"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Users, Award, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatProps {
  value: number
  label: string
  suffix?: string
  duration?: number
}

function StatCounter({ value, label, suffix = "", duration = 2000 }: StatProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        let startTime: number
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          setCount(Math.floor(progress * value))
          if (progress < 1) {
            window.requestAnimationFrame(step)
          }
        }
        window.requestAnimationFrame(step)
        observer.current?.disconnect()
      }
    })

    if (countRef.current) {
      observer.current.observe(countRef.current)
    }

    return () => {
      observer.current?.disconnect()
    }
  }, [value, duration])

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-teal-600">
        <span ref={countRef}>{count}</span>
        {suffix}
      </div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  )
}

interface TeamMember {
  name: string
  role: string
  image: string
  description: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Kumud Ranjan Pandey",
    role: "President",
    image: "/images/President.png",
    description:
      "Kumud leads with a deep commitment to social equity and inclusive growth, driving our vision forward.",
  },
  {
    name: "Druv Kumar Pandey",
    role: "Vice President",
    image: "/images/VicePresident.png",
    description:
      "Druv focuses on strategy and partnerships, ensuring that our programs scale with impact.",
  },
  {
    name: "Arvind Prasad",
    role: "Secretary",
    image: "/images/Secretary.png",
    description:
      "Arvind manages organizational governance and helps keep operations aligned with our mission.",
  },
  {
    name: "Sandip Chakraborty",
    role: "Chief Coordinator",
    image: "/images/ChiefCoordinator.png",
    description:
      "Sandip oversees program execution and ensures seamless coordination across initiatives.",
  },
  {
    name: "Ashutosh Kumar Mishra",
    role: "Treasurer",
    image: "/images/Treasurer.png",
    description:
      "Ashutosh ensures financial transparency and efficient resource allocation across all projects.",
  },
  {
    name: "Abhishek Mishra",
    role: "Tech Support",
    image: "/images/TS.jpg",
    description:
      "Abhishek empowers the organization through technical innovations and system support.",
  },
]

export default function AboutUs() {
  const [currentMember, setCurrentMember] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true)
      setTimeout(() => {
        setCurrentMember((prev) => (prev + 1) % teamMembers.length)
        setFadeOut(false)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="py-12 bg-gray-50"> {/* Reduced py-20 to py-12 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8"> {/* Reduced mb-16 to mb-8 */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Us</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto mb-4"></div> {/* Reduced mb-6 to mb-4 */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Arya Bhumi Seva Sansthan is a non-profit organization committed to serving communities through various
            initiatives in healthcare, education, and social welfare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"> {/* Reduced gap-12 to gap-8 and mb-16 to mb-12 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3> {/* Reduced mb-6 to mb-4 */}
            <p className="text-gray-600 mb-4">
              To empower underprivileged communities by providing access to quality healthcare, education, and
              sustainable development programs, fostering self-reliance and dignity.
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3> {/* Reduced mb-6 to mb-4 */}
            <p className="text-gray-600">
              A world where every individual has equal opportunities to thrive, with access to essential services and
              resources, regardless of their socio-economic background.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6"> {/* Reduced gap-12 to gap-6 */}
            <StatCounter value={50} label="Communities Served" suffix="+" />
            <StatCounter value={500} label="Active Volunteers" suffix="+" />
            <StatCounter value={100} label="Projects Completed" suffix="+" />
            <StatCounter value={10000} label="Lives Impacted" suffix="+" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Core Values</h3> {/* Reduced mb-8 to mb-6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"> {/* Reduced mb-20 to mb-12 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Compassion</h4>
                <p className="text-gray-600">
                  We approach our work with empathy and understanding, putting the needs of communities first.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Collaboration</h4>
                <p className="text-gray-600">
                  We believe in the power of partnerships and working together to create lasting change.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Excellence</h4>
                <p className="text-gray-600">
                  We strive for the highest standards in all our programs and services to maximize impact.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Sustainability</h4>
                <p className="text-gray-600">
                  We develop programs that create lasting change and empower communities to be self-reliant.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meet Our Team Section */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Meet Our Team</h3> {/* Reduced mb-8 to mb-6 */}
        <div className="flex justify-center items-center">
          <div
            className={`flex flex-col md:flex-row items-center md:items-start gap-6 max-w-4xl w-full p-6 border rounded-lg bg-white shadow-md transition-opacity duration-500 ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={teamMembers[currentMember].image}
              alt={teamMembers[currentMember].name}
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-md"
            />
            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold text-teal-600">{teamMembers[currentMember].name}</h4>
              <p className="text-gray-700 font-medium mb-2">{teamMembers[currentMember].role}</p>
              <p className="text-gray-600">{teamMembers[currentMember].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
