"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ImageIcon, Mic, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import type { Message } from "@/types/chat";
import Image from "next/image";

interface ConciergeChatProps {
  messages: Message[];
  onSendMessage: (message: string, image?: File) => void;
  isLoading: boolean;
}

export function ConciergeChat({
  messages,
  onSendMessage,
  isLoading,
}: ConciergeChatProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() || imageFile) {
      onSendMessage(input, imageFile || undefined);
      setInput("");
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const cancelImageUpload = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp).toLocaleDateString();

    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({
        date: messageDate,
        messages: [message],
      });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-primary-navy">
          Baiyit Concierge
        </h2>
        <p className="text-sm text-gray-500">Ask me anything about products</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {groupedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent-sky/10 flex items-center justify-center mb-4">
              <MessageIcon className="h-8 w-8 text-accent-sky" />
            </div>
            <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              Ask about products, upload images, or get recommendations
            </p>

            <div className="space-y-2 w-full">
              {[
                "Find me the best wireless keyboard under $100",
                "I need a new phone with great battery life",
                "What are the trending sneakers right now?",
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => {
                    setInput(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <div className="flex justify-center mb-4">
                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {group.date}
                  </span>
                </div>

                {group.messages.map((message, messageIndex) => (
                  <motion.div
                    key={messageIndex}
                    className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} max-w-[80%]`}
                    >
                      <Avatar
                        className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}
                      >
                        {message.sender === "user" ? (
                          <div className="bg-accent-sky text-white h-full w-full flex items-center justify-center">
                            U
                          </div>
                        ) : (
                          <div className="bg-primary-navy text-white h-full w-full flex items-center justify-center">
                            B
                          </div>
                        )}
                      </Avatar>

                      <div
                        className={`p-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-accent-sky text-white rounded-tr-none"
                            : "bg-white border border-gray-200 rounded-tl-none"
                        }`}
                      >
                        {message.image && (
                          <div className="mb-2 rounded-lg overflow-hidden">
                            <Image
                              src={message.image || "/placeholder.svg"}
                              alt="Uploaded image"
                              width={200}
                              height={200}
                              className="w-full h-auto"
                            />
                          </div>
                        )}
                        <p>{message.text}</p>
                        <div className="text-xs opacity-70 mt-1 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}

            {isLoading && (
              <div className="flex mb-4">
                <Avatar className="h-8 w-8 mr-2">
                  <div className="bg-primary-navy text-white h-full w-full flex items-center justify-center">
                    B
                  </div>
                </Avatar>
                <div className="p-3 rounded-2xl bg-white border border-gray-200 rounded-tl-none">
                  <div className="flex space-x-2">
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
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              className="mb-2 relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={cancelImageUpload}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleImageClick}
          >
            <ImageIcon className="h-5 w-5" />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>

          <Button variant="outline" size="icon" className="rounded-full">
            <Mic className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Ask about products, upload images, or get recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-full"
          />

          <Button
            variant="default"
            size="icon"
            className="rounded-full bg-accent-sky hover:bg-accent-sky/90"
            onClick={handleSendMessage}
            disabled={!input.trim() && !imageFile}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper component for the example
function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
