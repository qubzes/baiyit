"use client"

import { useState, useEffect } from "react"
import type { Message } from "@/types/chat"
import type { Product } from "@/types/product"

export function useRecommendations(messages: Message[]) {
  const [recommendations, setRecommendations] = useState<Product[]>([])

  useEffect(() => {
    if (messages.length === 0) return

    // Get the last message
    const lastMessage = messages[messages.length - 1]

    // Only generate recommendations for AI messages
    if (lastMessage.sender !== "ai") return

    // Generate mock recommendations based on the message content
    const mockRecommendations = generateMockRecommendations(lastMessage.text, messages)
    setRecommendations(mockRecommendations)
  }, [messages])

  return { recommendations }
}

// Helper function to generate mock recommendations
function generateMockRecommendations(text: string, messages: Message[]): Product[] {
  // Check all user messages for keywords
  const userMessages = messages.filter((msg) => msg.sender === "user")
  const userText = userMessages
    .map((msg) => msg.text)
    .join(" ")
    .toLowerCase()

  if (userText.includes("laptop") || userText.includes("computer")) {
    return [
      {
        id: "laptop-1",
        title: "UltraBook Pro 16",
        description: "Powerful laptop for professionals",
        price: 1299.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.8,
        specs: ["16GB RAM", "512GB SSD", "Intel i7", "14 hour battery"],
      },
      {
        id: "laptop-2",
        title: "GameMaster X",
        description: "Ultimate gaming experience",
        price: 1799.99,
        originalPrice: 1999.99,
        discount: 10,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.7,
        specs: ["32GB RAM", "1TB SSD", "RTX 4070", '17.3" 144Hz display'],
      },
      {
        id: "laptop-3",
        title: "SlimBook Air",
        description: "Ultraportable and stylish",
        price: 899.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.5,
        specs: ["8GB RAM", "256GB SSD", "Intel i5", "Weighs only 2.2 lbs"],
      },
      {
        id: "laptop-4",
        title: "WorkStation Pro",
        description: "For demanding professional tasks",
        price: 2499.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.9,
        specs: ["64GB RAM", "2TB SSD", "Intel Xeon", '15.6" 4K display'],
      },
    ]
  }

  if (userText.includes("phone") || userText.includes("smartphone")) {
    return [
      {
        id: "phone-1",
        title: "Galaxy S22 Ultra",
        description: "Professional-grade camera system",
        price: 1199.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.7,
        specs: ["108MP camera", '6.8" AMOLED', "5000mAh battery", "256GB storage"],
      },
      {
        id: "phone-2",
        title: "iPhone 14 Pro",
        description: "Cutting-edge performance",
        price: 999.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.8,
        specs: ["A16 Bionic", "Dynamic Island", "48MP camera", '6.1" ProMotion'],
      },
      {
        id: "phone-3",
        title: "Pixel 7 Pro",
        description: "The best of Google AI",
        price: 899.99,
        originalPrice: 999.99,
        discount: 10,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.6,
        specs: ["Tensor G2", "Magic Eraser", "50MP camera", '6.7" LTPO OLED'],
      },
    ]
  }

  if (userText.includes("headphone") || userText.includes("earbuds")) {
    return [
      {
        id: "audio-1",
        title: "SoundMaster Pro",
        description: "Premium noise cancellation",
        price: 349.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.8,
        specs: ["40h battery", "ANC", "Hi-Res Audio", "Bluetooth 5.2"],
      },
      {
        id: "audio-2",
        title: "AirBuds Ultra",
        description: "True wireless freedom",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.7,
        specs: ["8h playback", "Wireless charging", "IPX7 waterproof", "Touch controls"],
      },
      {
        id: "audio-3",
        title: "BassDrop Studio",
        description: "Immersive bass experience",
        price: 279.99,
        image: "/placeholder.svg?height=400&width=400",
        rating: 4.6,
        specs: ["36h battery", "Enhanced bass", "Foldable design", "Built-in mic"],
      },
    ]
  }

  // Default recommendations if no specific category is detected
  return [
    {
      id: "trending-1",
      title: "Smart Watch Pro",
      description: "Track your fitness and stay connected",
      price: 249.99,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.5,
      specs: ["Heart rate monitor", "GPS", "7-day battery", "Water resistant"],
    },
    {
      id: "trending-2",
      title: "Ultra HD Smart TV",
      description: "Immersive viewing experience",
      price: 799.99,
      originalPrice: 999.99,
      discount: 20,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.7,
      specs: ['65" 4K', "HDR10+", "Smart assistant", "Game mode"],
    },
    {
      id: "trending-3",
      title: "Wireless Charging Pad",
      description: "Convenient charging for all devices",
      price: 39.99,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.3,
      specs: ["15W fast charging", "Multi-device", "LED indicator", "Slim design"],
    },
  ]
}
