'use client'

import { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { AdminAuth } from "@/components/admin-auth"
import { PrivacyPolicyDialog } from "./privacy-policy-dialog"
import { TermsOfUseDialog } from "./terms-of-use-dialog"
import { VolunteerDialog } from "./volunteer-dialog"
import { JoinForm } from "./join-form"

export default function Footer() {
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false)
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false)
  const [isTermsOfUseOpen, setIsTermsOfUseOpen] = useState(false)
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isJoinFormOpen, setIsJoinFormOpen] = useState(false)

  return (
    <>
      <footer className="bg-[#08776e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <p>C/O- Kumud Ranjan Pandey,</p>
            <p>Vill - Hotwag, P.O- Parsahi,</p>
            <p>P.S / DIST- Latehar, Jharkhand,</p>
            <p>829207</p>
            <p>Phone: +91 9471517320</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setIsPrivacyPolicyOpen(true)}
                  className="hover:text-[#99ccc8] cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsOfUseOpen(true)}
                  className="hover:text-[#99ccc8] cursor-pointer"
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsVolunteerOpen(true)}
                  className="hover:text-[#99ccc8] cursor-pointer"
                >
                  Volunteer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="hover:text-[#99ccc8] cursor-pointer"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Admin Login */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#99ccc8]">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/aryabhumisevasansthan" className="hover:text-[#99ccc8]">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Developer Info */}
          <div>
          <h2 className="text-xl font-semibold mb-4">
            <a href="https://corpolink.in" className="text-grey-500 hover:underline">
              CorpoLink
            </a>
          </h2>

            <h3 className="text-xl font-semibold mb-4">About the Developer</h3>
            <p className="mb-2">Abhishek Mishra</p>
            <p className="mb-4">For inquiries or collaborations, feel free to reach out through the following platforms:</p>
            <div className="flex space-x-4">
              <Link href="http://t.me/abheeshakespeare" className="hover:text-[#99ccc8]" target="_blank">
                <i className="bi bi-telegram text-xl"></i>
              </Link>
              <Link
                href="https://www.linkedin.com/in/abheeshakespeare"
                className="hover:text-[#99ccc8]"
                target="_blank"
              >
                <i className="bi bi-linkedin text-xl"></i>
              </Link>
              <Link
                href="https://www.instagram.com/abheeshakespeare?igsh=bHZocXRhbnh5a2Q="
                className="hover:text-[#99ccc8]"
                target="_blank"
              >
                <i className="bi bi-instagram text-xl"></i>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <AdminAuth 
        isOpen={isAdminAuthOpen} 
        onClose={() => setIsAdminAuthOpen(false)} 
      />

      <PrivacyPolicyDialog 
        isOpen={isPrivacyPolicyOpen} 
        onClose={() => setIsPrivacyPolicyOpen(false)} 
      />
      
      <TermsOfUseDialog 
        isOpen={isTermsOfUseOpen} 
        onClose={() => setIsTermsOfUseOpen(false)} 
      />
      
      <VolunteerDialog 
        isOpen={isVolunteerOpen} 
        onClose={() => setIsVolunteerOpen(false)}
        onJoinClick={() => {
          setIsVolunteerOpen(false)
          setIsJoinFormOpen(true)
        }}
      />

      <JoinForm 
        isOpen={isJoinFormOpen} 
        onClose={() => setIsJoinFormOpen(false)} 
      />
    </>
  )
}
