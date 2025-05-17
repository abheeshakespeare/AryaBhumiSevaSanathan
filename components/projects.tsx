import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const projects = [
  {
    id: 1,
    title: "GAUMITRA",
    description:
      "Gaumitra is dedicated to the protection, conservation, and welfare of cows while promoting sustainable agriculture and environmental harmony.",
    image: "/project1.jpg?height=400&width=600",
  },
  {
    id: 2,
    title: "Tree Plantation Drive",
    description:
      "Join us in our tree plantation drive to create a greener, healthier future. Every tree planted is a step toward restoring nature.",
    image: "/project2.jpg?height=400&width=600",
  },
  {
    id: 3,
    title: "YogMitra Abhiyan",
    description:
      "Through the YogMitra Abhiyan, we promote a healthy life and inner peace. Join us in embracing yoga for a balanced and positive lifestyle.",
    image: "/project3.jpg?height=400&width=600",
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-teal-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ongoing Projects</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Explore our ongoing initiatives that are making a positive impact in communities across the region.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden bg-white">
              <div className="relative h-48">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
