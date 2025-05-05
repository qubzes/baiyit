"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"
import type { ProductQueryParams } from "@/lib/api/product-service"

interface UseProductsOptions extends ProductQueryParams {}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(options.page || 1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Build query string
        const params = new URLSearchParams()

        if (options.page) params.set("page", options.page.toString())
        if (options.size) params.set("size", options.size.toString())
        if (options.sort_by) params.set("sort_by", options.sort_by)
        if (options.descending !== undefined) params.set("descending", options.descending.toString())
        if (options.search) params.set("search", options.search)
        if (options.category) params.set("category", options.category)
        if (options.featured !== undefined) params.set("featured", options.featured.toString())
        if (options.min_price) params.set("min_price", options.min_price.toString())
        if (options.max_price) params.set("max_price", options.max_price.toString())
        if (options.min_rating) params.set("min_rating", options.min_rating.toString())

        // Fetch from our server-side API
        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to fetch products")
        } else {
          // Map API response to our Product type
          const mappedProducts: Product[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            originalPrice: item.discount_price,
            discount: item.discount_price
              ? Math.round(((item.discount_price - item.price) / item.discount_price) * 100)
              : undefined,
            image: item.image,
            rating: item.rating,
            category: item.category || undefined,
            featured: item.featured || false,
            specs: item.specs || undefined,
          }))

          setProducts(mappedProducts)
          setTotalProducts(data.total)
          setCurrentPage(data.page)
          setTotalPages(data.pages)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching products")
        console.error("Error fetching products:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [
    options.page,
    options.size,
    options.sort_by,
    options.descending,
    options.search,
    options.category,
    options.featured,
    options.min_price,
    options.max_price,
    options.min_rating,
  ])

  return {
    products,
    isLoading,
    error,
    totalProducts,
    currentPage,
    totalPages,
  }
}
