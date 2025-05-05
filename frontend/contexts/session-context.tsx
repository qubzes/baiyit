"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Message } from "@/types/chat";

interface SessionContextType {
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  saveSession: (id: string, messages: Message[]) => void;
  getSessionMessages: (id: string) => Message[] | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Generate a new session ID when needed
  useEffect(() => {
    if (!currentSessionId) {
      const newSessionId = `session_${Date.now()}`;
      setCurrentSessionId(newSessionId);
    }
  }, [currentSessionId]);

  const saveSession = (id: string, messages: Message[]) => {
    try {
      localStorage.setItem(`session_${id}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const getSessionMessages = (id: string): Message[] | null => {
    try {
      const savedSession = localStorage.getItem(`session_${id}`);
      return savedSession ? JSON.parse(savedSession) : null;
    } catch (error) {
      console.error("Failed to get session messages:", error);
      return null;
    }
  };

  return (
    <SessionContext.Provider
      value={{
        currentSessionId,
        setCurrentSessionId,
        saveSession,
        getSessionMessages,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
