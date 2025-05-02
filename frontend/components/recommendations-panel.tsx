"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/product"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecommendationsPanelProps {
  recommendations: Product[]
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollAmount = 300

  const handleScrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - scrollAmount)
    setScrollPosition(newPosition)
    document.getElementById("recommendations-container")?.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })
  }

  const handleScrollRight = () => {
    const container = document.getElementById("recommendations-container")
    if (container) {
      const newPosition = Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)
      setScrollPosition(newPosition)
      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-primary-navy">Live Recommendations</h2>
        <p className="text-sm text-gray-500">Products tailored to your conversation</p>
      </div>

      <div className="flex-1 overflow-hidden p-4 relative">
        {recommendations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent-sky/10 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-accent-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No recommendations yet</h3>
            <p className="text-gray-500 mb-6">Start a conversation to get personalized product recommendations</p>
          </div>
        ) : (
          <>
            <div
              id="recommendations-container"
              className="h-full overflow-x-auto flex items-start space-x-4 pb-4 scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex-shrink-0 w-64"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {recommendations.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm z-10"
                  onClick={handleScrollLeft}
                  disabled={scrollPosition === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm z-10"
                  onClick={handleScrollRight}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
