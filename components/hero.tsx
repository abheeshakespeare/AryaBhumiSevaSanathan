import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-[700px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/yoga.jpeg?height=1080&width=1920')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Join Our Yoga Sessions</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Experience peace and wellness through our guided yoga sessions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
            <Link href="https://wa.me/919471517320?text=Namaskaram...%20I%20want%20to%20join%20the%20online%20wellness%20program">Join Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
