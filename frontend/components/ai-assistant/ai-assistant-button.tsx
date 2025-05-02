"use client"

import { Button } from "@/components/ui/button"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import { AIAssistantModal } from "@/components/ai-assistant/ai-assistant-modal"
import { MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AIAssistantButton() {
  const { isOpen, openAssistant } = useAIAssistant()

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={openAssistant}
              size="lg"
              className="h-14 w-14 rounded-full bg-accent-sky hover:bg-accent-sky/90 shadow-lg"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistantModal />
    </>
  )
}
