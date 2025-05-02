"use client"

import { useEffect, useState } from "react"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import { useProducts } from "@/hooks/use-products"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { useBag } from "@/hooks/use-bag"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"

export function ProductSuggestions() {
  const { messages, contextInfo } = useAIAssistant()
  const { products } = useProducts()
  const { addItem } = useBag()
  const [suggestions, setSuggestions] = useState<Product[]>([])

  useEffect(() => {
    // Generate suggestions based on messages and context
    if (messages.length === 0) {
      // Show trending products if no conversation yet
      setSuggestions(products.filter((p) => p.featured).slice(0, 3))
      return
    }

    // Extract keywords from the last few messages
    const recentMessages = messages.slice(-3).map((m) => m.text.toLowerCase())
    const combinedText = recentMessages.join(" ")

    // Simple keyword matching for demo purposes
    let matchedProducts: Product[] = []

    if (contextInfo.page === "product" && contextInfo.data) {
      // If viewing a product, suggest similar products
      const currentCategory = contextInfo.data.category
      matchedProducts = products
        .filter((p) => p.category === currentCategory && p.id !== contextInfo.data.id)
        .slice(0, 3)
    } else if (
      combinedText.includes("laptop") ||
      combinedText.includes("computer") ||
      combinedText.includes("gaming")
    ) {
      matchedProducts = products.filter((p) => p.id.includes("laptop")).slice(0, 3)
    } else if (
      combinedText.includes("phone") ||
      combinedText.includes("smartphone") ||
      combinedText.includes("mobile")
    ) {
      matchedProducts = products.filter((p) => p.id.includes("phone")).slice(0, 3)
    } else if (combinedText.includes("headphone") || combinedText.includes("audio") || combinedText.includes("sound")) {
      matchedProducts = products.filter((p) => p.id.includes("audio")).slice(0, 3)
    } else {
      // Default to featured products
      matchedProducts = products.filter((p) => p.featured).slice(0, 3)
    }

    setSuggestions(matchedProducts)
  }, [messages, products, contextInfo])

  const handleAddToBag = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  if (suggestions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">Loading suggestions...</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-medium text-primary-navy mb-3">Suggested Products</h3>
      <div className="space-y-3">
        {suggestions.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex p-3">
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <Link href={`/products/${product.id}`} className="hover:text-accent-sky">
                  <h4 className="font-medium text-sm text-primary-navy line-clamp-2">{product.title}</h4>
                </Link>
                <p className="text-sm font-bold text-primary-navy mt-1">${product.price.toFixed(2)}</p>
                <div className="flex mt-2 space-x-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary-navy hover:bg-primary-navy/90 flex-1"
                    onClick={() => handleAddToBag(product)}
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                  <Link href={`/products/${product.id}`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      View
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
