"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"

interface UseProductsOptions {
  category?: string
  featured?: boolean
  limit?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Sample products data with real images
      const allProducts: Product[] = [
        {
          id: "laptop-1",
          title: "UltraBook Pro 16",
          description: "Powerful laptop for professionals",
          price: 1299.99,
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071",
          rating: 4.8,
          featured: true,
          category: "electronics",
          specs: ["16GB RAM", "512GB SSD", "Intel i7", "14 hour battery"],
        },
        {
          id: "laptop-2",
          title: "GameMaster X",
          description: "Ultimate gaming experience",
          price: 1799.99,
          originalPrice: 1999.99,
          discount: 10,
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068",
          rating: 4.7,
          featured: true,
          category: "electronics",
          specs: ["32GB RAM", "1TB SSD", "RTX 4070", '17.3" 144Hz display'],
        },
        {
          id: "phone-1",
          title: "Galaxy S22 Ultra",
          description: "Professional-grade camera system",
          price: 1199.99,
          image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2127",
          rating: 4.7,
          featured: true,
          category: "electronics",
          specs: ["108MP camera", '6.8" AMOLED', "5000mAh battery", "256GB storage"],
        },
        {
          id: "audio-1",
          title: "SoundMaster Pro",
          description: "Premium noise cancellation",
          price: 349.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
          rating: 4.8,
          featured: false,
          category: "electronics",
          specs: ["40h battery", "ANC", "Hi-Res Audio", "Bluetooth 5.2"],
        },
        {
          id: "watch-1",
          title: "Smart Watch Pro",
          description: "Track your fitness and stay connected",
          price: 249.99,
          image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072",
          rating: 4.5,
          featured: true,
          category: "electronics",
          specs: ["Heart rate monitor", "GPS", "7-day battery", "Water resistant"],
        },
        {
          id: "tv-1",
          title: 'Ultra HD Smart TV 65"',
          description: "Immersive viewing experience",
          price: 799.99,
          originalPrice: 999.99,
          discount: 20,
          image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070",
          rating: 4.7,
          featured: true,
          category: "electronics",
          specs: ['65" 4K', "HDR10+", "Smart assistant", "Game mode"],
        },
        {
          id: "fashion-1",
          title: "Premium Wool Coat",
          description: "Elegant wool coat for winter",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1974",
          rating: 4.6,
          featured: false,
          category: "fashion",
          specs: ["100% Wool", "Dry clean only", "Multiple colors", "Sizes XS-XXL"],
        },
        {
          id: "furniture-1",
          title: "Ergonomic Office Chair",
          description: "Premium comfortable chair for your workspace",
          price: 349.99,
          originalPrice: 399.99,
          discount: 12,
          image: "https://images.unsplash.com/photo-1505843490701-5be5d1b31f8f?q=80&w=1887",
          rating: 4.9,
          featured: true,
          category: "home",
          specs: ["Adjustable height", "Lumbar support", "Breathable mesh", "360° swivel"],
        },
      ]

      // Filter products based on options
      let filteredProducts = [...allProducts]

      if (options.category) {
        filteredProducts = filteredProducts.filter((p) => p.category === options.category)
      }

      if (options.featured) {
        filteredProducts = filteredProducts.filter((p) => p.featured)
      }

      if (options.limit) {
        filteredProducts = filteredProducts.slice(0, options.limit)
      }

      setProducts(filteredProducts)
      setIsLoading(false)
    }

    fetchProducts()
  }, [options.category, options.featured, options.limit])

  return { products, isLoading }
}
