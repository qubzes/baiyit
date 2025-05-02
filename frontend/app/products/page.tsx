"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Grid, List, Sliders, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import { useMobile } from "@/hooks/use-mobile"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const { products, isLoading } = useProducts({
    category: categoryParam || undefined,
  })

  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const { updateContextInfo, openAssistant } = useAIAssistant()
  const isMobile = useMobile()

  // Update context info when page loads
  useEffect(() => {
    updateContextInfo({
      page: "products",
      path: "/products" + (categoryParam ? `?category=${categoryParam}` : ""),
      data: {
        count: products.length,
        category: categoryParam,
      },
    })
  }, [products.length, categoryParam, updateContextInfo])

  // Get category name for display
  const getCategoryName = () => {
    if (!categoryParam) return "All Products"

    const categoryMap: Record<string, string> = {
      electronics: "Electronics",
      fashion: "Fashion",
      home: "Home & Kitchen",
      beauty: "Beauty & Personal Care",
      sports: "Sports & Fitness",
      toys: "Toys & Games",
    }

    return categoryMap[categoryParam] || "Products"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-navy">{getCategoryName()}</h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
              className="h-9 w-9"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
              className="h-9 w-9"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Sliders className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>Narrow down products based on your preferences</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {/* Filter options would go here */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Price Range</h3>
                    {/* Price range slider would go here */}
                    <div className="h-12 bg-gray-100 rounded-md"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    {/* Category checkboxes would go here */}
                    <div className="space-y-2">
                      {["Electronics", "Fashion", "Home & Kitchen", "Beauty"].map((category) => (
                        <div key={category} className="flex items-center">
                          <input type="checkbox" id={category} className="mr-2" />
                          <label htmlFor={category}>{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Brands</h3>
                    {/* Brand checkboxes would go here */}
                    <div className="space-y-2">
                      {["Apple", "Samsung", "Sony", "LG", "Nike"].map((brand) => (
                        <div key={brand} className="flex items-center">
                          <input type="checkbox" id={brand} className="mr-2" />
                          <label htmlFor={brand}>{brand}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <Button variant="outline" className="flex-1">
                  Reset
                </Button>
                <Button className="flex-1 bg-primary-navy hover:bg-primary-navy/90">Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button className="md:ml-2 bg-accent-sky hover:bg-accent-sky/90" onClick={openAssistant}>
            <MessageSquare className="h-4 w-4 mr-2" />
            {isMobile ? "Ask" : "Ask Baiyit"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-[300px] md:h-[380px] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div layout>
          {view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 flex"
                >
                  <div className="w-24 h-24 md:w-40 md:h-40 relative flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                  <div className="ml-4 md:ml-6 flex-1">
                    <h3 className="font-medium text-sm md:text-lg text-primary-navy">{product.title}</h3>
                    <p className="text-gray-600 mt-1 text-xs md:text-sm line-clamp-2">{product.description}</p>
                    <div className="flex items-baseline mt-2">
                      <span className="text-sm md:text-lg font-bold text-primary-navy">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs md:text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 md:mt-4 flex flex-wrap gap-2">
                      <Button size={isMobile ? "sm" : "default"} className="bg-primary-navy hover:bg-primary-navy/90">
                        Add to Bag
                      </Button>
                      <Button size={isMobile ? "sm" : "default"} variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
