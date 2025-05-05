"use client";

import { useState, useEffect } from "react";
import type { Message } from "@/types/chat";
import { useSession } from "@/contexts/session-context";

export function useConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSessionId, saveSession, getSessionMessages } = useSession();

  // Load messages from session if available
  useEffect(() => {
    if (currentSessionId) {
      const savedMessages = getSessionMessages(currentSessionId);
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      } else if (messages.length === 0) {
        // Add initial greeting if no messages
        const initialMessage: Message = {
          id: "1",
          sender: "ai",
          text: "Hello! I'm Baiyit, your AI shopping concierge. How can I help you today? You can ask me about products, upload images, or tell me what you're looking for.",
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMessage]);
      }
    }
  }, [currentSessionId]);

  // Save messages to session when they change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      saveSession(currentSessionId, messages);
    }
  }, [messages, currentSessionId]);

  const sendMessage = async (text: string, image?: File) => {
    if (!text.trim() && !image) return;

    // Create user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toISOString(),
    };

    // If there's an image, add it to the message
    if (image) {
      userMessage.image = URL.createObjectURL(image);
    }

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create AI response
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      sender: "ai",
      text: generateAIResponse(text, image),
      timestamp: new Date().toISOString(),
    };

    // Add AI message to state
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}

// Helper function to generate mock AI responses
function generateAIResponse(text: string, image?: File): string {
  if (image) {
    return "I see the image you've uploaded! Based on what I'm seeing, here are some products that might interest you. You can browse through the recommendations on the right, or let me know if you'd like something more specific.";
  }

  const lowercaseText = text.toLowerCase();

  if (lowercaseText.includes("laptop") || lowercaseText.includes("computer")) {
    return "I've found some excellent laptop options for you! There's the UltraBook Pro with 16GB RAM and 512GB SSD, perfect for productivity. There's also the GameMaster X with a dedicated GPU if you're into gaming. Would you like more details on any of these?";
  }

  if (lowercaseText.includes("phone") || lowercaseText.includes("smartphone")) {
    return "Looking for a new phone? I've curated some top options based on the latest reviews. The Galaxy S22 has an amazing camera, while the iPhone 14 Pro offers excellent performance. There's also the Pixel 7 with its AI features. Which aspects are most important to you?";
  }

  if (
    lowercaseText.includes("headphone") ||
    lowercaseText.includes("earbuds")
  ) {
    return "For audio gear, I'd recommend the SoundMaster Pro headphones with noise cancellation, or the AirBuds Ultra for a truly wireless experience. Both have excellent sound quality and battery life. Would you prefer over-ear headphones or earbuds?";
  }

  return "I've found some products that might match what you're looking for. Take a look at the recommendations on the right, or give me more details about what you need so I can refine my suggestions. What specific features or price range are you interested in?";
}
