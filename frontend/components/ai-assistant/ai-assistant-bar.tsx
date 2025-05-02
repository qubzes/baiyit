"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AIAssistantModal } from "@/components/ai-assistant/ai-assistant-modal"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

export function AIAssistantBar() {
  const { isOpen, openAssistant, closeAssistant, sendMessage, contextInfo } = useAIAssistant()
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const isMobile = useMobile()

  // Close the assistant when navigating to a new page
  useEffect(() => {
    closeAssistant()
  }, [pathname, closeAssistant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      sendMessage(query)
      setQuery("")
      openAssistant()
    }
  }

  // Generate placeholder based on current context
  const getPlaceholder = () => {
    if (contextInfo.page === "product" && contextInfo.data) {
      return `Ask about ${contextInfo.data.title}...`
    } else if (contextInfo.page === "category") {
      return `Ask about ${contextInfo.data?.name || "this category"}...`
    } else {
      return "Ask Baiyit to help you shop..."
    }
  }

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-2">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div
              className={`flex items-center transition-all duration-300 rounded-full border ${
                isFocused ? "border-accent-sky shadow-sm" : "border-gray-200"
              }`}
            >
              <div className="flex-shrink-0 pl-3">
                {isFocused ? (
                  <Sparkles className="h-5 w-5 text-accent-sky" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <Input
                ref={inputRef}
                type="text"
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                placeholder={getPlaceholder()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <Button
                type="submit"
                size="sm"
                className={`mr-1 rounded-full transition-all duration-300 ${
                  query.trim() ? "bg-accent-sky hover:bg-accent-sky/90" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                disabled={!query.trim()}
              >
                {isMobile ? <ArrowRight className="h-4 w-4" /> : "Ask Baiyit"}
              </Button>
            </div>

            <AnimatePresence>
              {isFocused && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10"
                >
                  <div className="text-sm text-gray-500 mb-2">Try asking:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Find me wireless headphones under $100",
                      "What's the best laptop for students?",
                      "Show me trending products",
                      "Compare these two smartphones",
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start h-auto py-2 text-sm"
                        onClick={() => {
                          setQuery(suggestion)
                          inputRef.current?.focus()
                        }}
                      >
                        <Search className="h-3 w-3 mr-2 text-gray-400" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      <AIAssistantModal />
    </>
  )
}
