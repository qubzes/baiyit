"use client"

import { createContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Message } from "@/types/chat"
import type { Product } from "@/types/product"

interface ContextInfo {
  page: string
  path?: string
  data?: any
}

interface AIAssistantContextType {
  isOpen: boolean
  openAssistant: () => void
  closeAssistant: () => void
  messages: Message[]
  sendMessage: (text: string) => void
  input: string
  setInput: (text: string) => void
  isLoading: boolean
  contextInfo: ContextInfo
  updateContextInfo: (info: Partial<ContextInfo>) => void
  selectedProduct: Product | null
  selectProduct: (product: Product) => void
  clearSelectedProduct: () => void
}

export const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState("")
  const [contextInfo, setContextInfo] = useState<ContextInfo>({ page: "home" })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const openAssistant = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeAssistant = useCallback(() => {
    setIsOpen(false)
  }, [])

  const updateContextInfo = useCallback((info: Partial<ContextInfo>) => {
    setContextInfo((prev) => ({ ...prev, ...info }))
  }, [])

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      // Add user message
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      // Simulate AI response
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate context-aware response
        let response = ""

        if (contextInfo.page === "product" && contextInfo.data) {
          const product = contextInfo.data as Product
          response = `I can tell you all about the ${product.title}. It's priced at $${product.price.toFixed(
            2,
          )} and features ${product.specs?.join(", ")}. Would you like to add this to your bag or have more information?`
        } else if (text.toLowerCase().includes("laptop") || text.toLowerCase().includes("computer")) {
          response = `I've found some excellent laptop options for you! There's the UltraBook Pro with 16GB RAM and 512GB SSD, perfect for productivity. There's also the GameMaster X with a dedicated GPU if you're into gaming. I've added these to your suggestions panel. Would you like more details on any of these?`
        } else if (text.toLowerCase().includes("phone") || text.toLowerCase().includes("smartphone")) {
          response = `Looking for a new phone? I've curated some top options based on the latest reviews. The Galaxy S22 has an amazing camera, while the iPhone 14 Pro offers excellent performance. I've added these to your suggestions panel. Which aspects are most important to you?`
        } else if (text.toLowerCase().includes("headphone") || text.toLowerCase().includes("earbuds")) {
          response = `For audio gear, I'd recommend the SoundMaster Pro headphones with noise cancellation, or the AirBuds Ultra for a truly wireless experience. Both have excellent sound quality and battery life. I've added these to your suggestions panel. Would you prefer over-ear headphones or earbuds?`
        } else if (text.toLowerCase().includes("hello") || text.toLowerCase().includes("hi")) {
          response = `Hello! I'm Baiyit, your AI shopping assistant. I can help you find products, answer questions, and provide recommendations. What are you looking for today?`
        } else if (text.toLowerCase().includes("recommend") || text.toLowerCase().includes("suggest")) {
          response = `Based on trending items and your browsing history, I'd recommend checking out our premium wireless headphones or the new ultra-slim laptops. I've added some suggestions to the panel on the right. Would you like me to refine these recommendations?`
        } else if (text.toLowerCase().includes("compare")) {
          response = `I'd be happy to help you compare products. Could you tell me which specific items you're interested in comparing? Or I can suggest some popular comparisons in a particular category.`
        } else {
          response = `I'd be happy to help with that. I've added some relevant products to the suggestions panel based on your query. Would you like more specific information about any of these items, or would you prefer different options?`
        }

        // Add AI message
        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: response,
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, aiMessage])
      } catch (error) {
        console.error("Error generating AI response:", error)

        // Add error message
        const errorMessage: Message = {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [contextInfo],
  )

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai_assistant_messages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to parse saved messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai_assistant_messages", JSON.stringify(messages))
    }
  }, [messages])

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        messages,
        sendMessage,
        input,
        setInput,
        isLoading,
        contextInfo,
        updateContextInfo,
        selectedProduct,
        selectProduct,
        clearSelectedProduct,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  )
}
