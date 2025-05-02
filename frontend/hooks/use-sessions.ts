"use client"

import { useState, useEffect } from "react"
import type { Session } from "@/types/session"

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchSessions = async () => {
      setIsLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockSessions: Session[] = [
        {
          id: "session_1681558200000",
          title: "Laptop Shopping",
          date: "2023-04-15T10:30:00Z",
          preview: "I need a new laptop for work and gaming. Something with good battery life and a powerful GPU.",
          products: ["UltraBook Pro 16", "GameMaster X", "SlimBook Air"],
        },
        {
          id: "session_1679493900000",
          title: "Headphone Recommendations",
          date: "2023-03-22T14:45:00Z",
          preview: "Looking for noise-cancelling headphones for travel. Budget around $300.",
          products: ["SoundMaster Pro", "BassDrop Studio"],
        },
        {
          id: "session_1676022900000",
          title: "Smartphone Comparison",
          date: "2023-02-10T09:15:00Z",
          preview: "Help me choose between the latest iPhone and Galaxy models. Camera quality is important to me.",
          products: ["iPhone 14 Pro", "Galaxy S22 Ultra", "Pixel 7 Pro"],
        },
      ]

      setSessions(mockSessions)
      setIsLoading(false)
    }

    fetchSessions()
  }, [])

  return { sessions, isLoading }
}
