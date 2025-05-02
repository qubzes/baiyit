"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

export function FeaturedProducts() {
  const { products } = useProducts({ featured: true })
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollAmount = 300

  const handleScrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - scrollAmount)
    setScrollPosition(newPosition)
    document.getElementById("featured-products-container")?.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })
  }

  const handleScrollRight = () => {
    const container = document.getElementById("featured-products-container")
    if (container) {
      const newPosition = Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)
      setScrollPosition(newPosition)
      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Loading featured products...</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        id="featured-products-container"
        className="flex overflow-x-auto space-x-6 py-4 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[280px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm z-10 shadow-md"
        onClick={handleScrollLeft}
        disabled={scrollPosition === 0}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm z-10 shadow-md"
        onClick={handleScrollRight}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
