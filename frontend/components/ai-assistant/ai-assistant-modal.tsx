"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import { Button } from "@/components/ui/button"
import { X, Camera, PhoneCall, SendHorizontal, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { ProductSuggestion } from "@/components/ai-assistant/product-suggestion"
import { ProductDetail } from "@/components/ai-assistant/product-detail"
import type { Product } from "@/types/product"

export function AIAssistantModal() {
  const { isOpen, closeAssistant, messages, input, setInput, sendMessage, isLoading } = useAIAssistant()
  const isMobile = useMobile()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showChat, setShowChat] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && showChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, showChat])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && showChat) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, showChat])

  // When input is focused or changed, switch to chat view on mobile
  useEffect(() => {
    if (isMobile && input.trim().length > 0) {
      setShowChat(true)
    }
  }, [input, isMobile])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
      setInput("")
      setShowChat(true)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeAssistant}
          />

          <motion.div
            initial={{ opacity: 0, y: isMobile ? 100 : 50, scale: isMobile ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? 100 : 50, scale: isMobile ? 1 : 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed ${
              isMobile
                ? "bottom-0 left-0 right-0 top-auto rounded-t-2xl max-h-[90vh]"
                : "bottom-[5%] left-[10%] right-[10%] top-[15%] rounded-2xl"
            } bg-white shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-md border border-white/20`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white/90">
              <div>
                <h2 className="text-xl font-bold text-primary-navy">Baiyit</h2>
                <p className="text-sm text-gray-500">Your AI shopping companion</p>
              </div>
              <Button variant="ghost" size="icon" onClick={closeAssistant}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content area - split into chat and product details */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Messages */}
              <div
                className={`${
                  isMobile && selectedProduct && !showChat ? "hidden" : "flex-1"
                } ${selectedProduct && !isMobile ? "md:w-1/2" : "w-full"} overflow-y-auto`}
              >
                <div className="p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-accent-sky/10 flex items-center justify-center mb-4">
                        <svg
                          className="h-8 w-8 text-accent-sky"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium mb-2">How can I help you today?</h3>
                      <p className="text-gray-500 mb-6">
                        Ask me about products, shopping advice, or anything else you need help with.
                      </p>

                      {/* Suggested questions */}
                      <div className="w-full space-y-2">
                        {[
                          "Find me wireless headphones under $100",
                          "What's the best laptop for students?",
                          "Show me trending products",
                          "Compare these two smartphones",
                        ].map((question, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-3 px-4"
                            onClick={() => {
                              sendMessage(question)
                            }}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message, index) => (
                        <div key={index}>
                          {message.sender === "user" ? (
                            <div className="text-right">
                              <div className="inline-block bg-accent-sky text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[85%]">
                                <p>{message.text}</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-gray-800 max-w-[85%]">
                                <p>{message.text}</p>
                              </div>
                              {/* Product suggestions after AI messages */}
                              {index > 0 && index % 2 === 1 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <ProductSuggestion
                                    onSelect={(product) => {
                                      setSelectedProduct(product)
                                      if (isMobile) {
                                        setShowChat(false)
                                      }
                                    }}
                                    messageIndex={index}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {isLoading && (
                        <div>
                          <div className="flex space-x-2 px-4 py-2 max-w-[85%]">
                            <div
                              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Product details - only show when a product is selected */}
              {selectedProduct && !isMobile && (
                <div className="hidden md:block md:w-1/2 border-l border-gray-100 overflow-y-auto">
                  <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
                </div>
              )}

              {/* Mobile product details view */}
              {selectedProduct && isMobile && !showChat && (
                <div className="flex-1 overflow-y-auto">
                  <ProductDetail
                    product={selectedProduct}
                    onClose={() => {
                      setShowChat(true)
                    }}
                    isMobile={true}
                  />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white/90">
              <form onSubmit={handleSubmit} className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-sky" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Tell Baiyit what you need..."
                  className="h-12 rounded-full pl-12 pr-24 text-base border-gray-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => {
                    if (isMobile && selectedProduct) {
                      setShowChat(true)
                    }
                  }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-8 w-8"
                    onClick={() => {
                      // Handle camera click
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  {input.trim() ? (
                    <Button
                      type="submit"
                      size="icon"
                      variant="secondary"
                      disabled={isLoading}
                      className="rounded-full h-8 w-8 bg-accent-sky hover:bg-accent-sky/90 text-white"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="rounded-full h-8 w-8 bg-accent-sky hover:bg-accent-sky/90 text-white"
                      onClick={() => {
                        // Handle voice input
                      }}
                    >
                      <PhoneCall className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
