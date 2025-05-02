"use client"

import { useEffect, useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import Image from "next/image"
import type { Product } from "@/types/product"

interface ProductSuggestionProps {
  onSelect: (product: Product) => void
  messageIndex: number
}

export function ProductSuggestion({ onSelect, messageIndex }: ProductSuggestionProps) {
  const { messages } = useAIAssistant()
  const { products } = useProducts()
  const [suggestions, setSuggestions] = useState<Product[]>([])

  useEffect(() => {
    // Generate suggestions based on messages
    if (messages.length === 0) return

    // Get the current message and previous messages
    const currentMessage = messages[messageIndex]
    const recentMessages = messages
      .slice(Math.max(0, messageIndex - 3), messageIndex + 1)
      .map((m) => m.text.toLowerCase())
    const combinedText = recentMessages.join(" ")

    // Simple keyword matching for demo purposes
    let matchedProducts: Product[] = []

    if (combinedText.includes("laptop") || combinedText.includes("computer") || combinedText.includes("gaming")) {
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
  }, [messageIndex, messages, products])

  if (suggestions.length === 0) return null

  return (
    <>
      {suggestions.map((product) => (
        <div
          key={product.id}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-gray-200"
          onClick={() => onSelect(product)}
        >
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary-navy line-clamp-1">{product.title}</span>
            <span className="text-xs font-bold text-primary-navy">${product.price.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </>
  )
}
