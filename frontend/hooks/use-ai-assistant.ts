"use client"

import { useContext } from "react"
import { AIAssistantContext } from "@/contexts/ai-assistant-context"

export function useAIAssistant() {
  const context = useContext(AIAssistantContext)

  if (context === undefined) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider")
  }

  return context
}
