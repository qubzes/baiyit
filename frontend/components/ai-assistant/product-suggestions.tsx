"use client"

import { useEffect, useState } from "react"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import { useProducts } from "@/hooks/use-products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"

export function ProductSuggestions() {
  const { messages, contextInfo } = useAIAssistant()
  const { products } = useProducts()
  const { addItem } = useCart()
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

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <>
      {suggestions.map((product) => (
        <Card key={product.id} className="flex-shrink-0 w-[180px] overflow-hidden">
          <div className="aspect-square relative">
            <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
          </div>
          <CardContent className="p-3">
            <div className="mb-2 line-clamp-1 font-medium text-sm">{product.title}</div>
            <div className="mb-2 text-sm font-bold">${product.price.toFixed(2)}</div>
            <div className="flex gap-1">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs bg-primary-navy hover:bg-primary-navy/90"
                onClick={() => handleAddToCart(product)}
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
          </CardContent>
        </Card>
      ))}
    </>
  )
}
