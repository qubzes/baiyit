"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  PhoneCall,
  SendHorizontal,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { useTypewriter } from "react-simple-typewriter";

export function AIAssistantInput() {
  const { sendMessage, openAssistant, isLoading } = useAIAssistant();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const slogans = [
    "What can Baiyit help you find today?",
    "Ask anything, Baiyit's here to shop for you.",
    "Describe your perfect product, we'll do the rest.",
    "Let Baiyit hunt the best deals for you.",
    "Don't search, just tell Baiyit what you want.",
    "Need advice or a product? Baiyit's listening.",
    "Baiyit finds. You choose. Simple.",
    "Ready to discover something new? Ask Baiyit.",
    "Your shopping assistant, just type your wish.",
    "Unlock smarter shopping. Ask Baiyit anything.",
    "Baiyit: Your shortcut to the perfect purchase.",
  ];

  const [typewriterPlaceholder] = useTypewriter({
    words: slogans,
    loop: 0,
    typeSpeed: 50,
    deleteSpeed: 20,
    delaySpeed: 1500,
  });

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    sendMessage(inputValue.trim());
    setInputValue("");
    setIsFocused(false);
    openAssistant();
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setInputValue("");
    setIsFocused(false);
    openAssistant();
  };

  return (
    <div className="w-full flex justify-center items-center bg-transparent relative">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center">
            <Sparkles className="absolute left-4 h-5 w-5 text-accent-sky" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={
                typewriterPlaceholder || "Tell Baiyit what you need..."
              }
              className="h-12 rounded-full pl-12 pr-24 text-base border-gray-200 focus-visible:ring-accent-sky"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              disabled={isLoading}
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
              {inputValue.trim() ? (
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
          </div>
        </form>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10"
            >
              <div className="text-sm text-gray-500 mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Find me wireless headphones under $100",
                  "What's the best laptop for students?",
                  "Show me trending products",
                  "Compare these two smartphones",
                  "Recommend a gift for my mom",
                  "Find running shoes for men",
                ].map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-sm py-1 px-3 h-auto rounded-full"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Search className="h-3 w-3 mr-2 text-gray-400" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
