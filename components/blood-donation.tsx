import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BloodDonation() {
  return (
    <section
      id="blood-donation"
      className="relative h-[700px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/donateBlood.jpg?height=1080&width=1920')",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(246,6,6,0.5),rgba(8,119,110,0.7))]"></div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Blood Donation</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Your blood donation can save lives. Join our blood donation drive or request blood if you're in need.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
          <Button
            asChild
            size="lg"
            className="bg-white text-teal-700 hover:bg-gray-100 py-6 text-lg font-semibold flex-1"
          >
            <Link href="/register-donate">Register to Donate</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-white text-teal-700 hover:bg-gray-100 py-6 text-lg font-semibold flex-1"
          >
            <Link href="/need-blood">Need Blood</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
