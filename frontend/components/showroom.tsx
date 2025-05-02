"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface ShowroomProps {
  onItemClick: () => void
}

export function Showroom({ onItemClick }: ShowroomProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const categories = [
    {
      id: "electronics",
      title: "Electronics",
      description: "Latest gadgets and tech",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: "fashion",
      title: "Fashion",
      description: "Trending styles and apparel",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-pink-500/20 to-red-500/20",
    },
    {
      id: "home",
      title: "Home & Living",
      description: "Furniture and decor",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-green-500/20 to-teal-500/20",
    },
    {
      id: "beauty",
      title: "Beauty",
      description: "Skincare and cosmetics",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-yellow-500/20 to-orange-500/20",
    },
    {
      id: "sports",
      title: "Sports & Fitness",
      description: "Equipment and activewear",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-red-500/20 to-yellow-500/20",
    },
    {
      id: "books",
      title: "Books & Media",
      description: "Bestsellers and entertainment",
      image: "/placeholder.svg?height=600&width=800",
      color: "from-indigo-500/20 to-blue-500/20",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary-navy mb-2">Showroom</h2>
        <p className="text-gray-600">Explore our curated categories or continue your conversation</p>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="relative h-80 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0">
              <Image src={category.image || "/placeholder.svg"} alt={category.title} fill className="object-cover" />
            </div>

            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} backdrop-blur-sm`} />

            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary-navy mb-2">{category.title}</h3>
                <p className="text-gray-700">{category.description}</p>
              </div>

              <Button className="self-start bg-white text-primary-navy hover:bg-white/90" onClick={onItemClick}>
                Explore
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="text-primary-navy" onClick={onItemClick}>
          Return to Concierge
        </Button>
      </div>
    </div>
  )
}
