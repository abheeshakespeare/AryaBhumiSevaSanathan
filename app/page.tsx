import Header from "@/components/header"
import Hero from "@/components/hero"
import BloodDonation from "@/components/blood-donation"
import AboutUs from "@/components/about-us"
import Projects from "@/components/projects"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"
import Donate from "@/components/donate"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <Header />
      <main>
        <Hero />
        <div className="h-8" /> {}

        <Projects />
        <div className="h-8" /> {}

        <BloodDonation />
        <AboutUs />
        <Gallery />
        <Contact />
        <Donate />
      </main>
      <Footer />
    </div>
  )
}
