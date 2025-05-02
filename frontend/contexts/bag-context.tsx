"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { BagItem } from "@/types/bag"

interface BagContextType {
  items: BagItem[]
  addItem: (item: BagItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearBag: () => void
  getTotalPrice: () => number
}

const BagContext = createContext<BagContextType | undefined>(undefined)

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([])

  // Load bag from localStorage on mount
  useEffect(() => {
    const savedBag = localStorage.getItem("bag")
    if (savedBag) {
      try {
        setItems(JSON.parse(savedBag))
      } catch (error) {
        console.error("Failed to parse bag from localStorage:", error)
      }
    }
  }, [])

  // Save bag to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bag", JSON.stringify(items))
  }, [items])

  const addItem = (newItem: BagItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        }
        return updatedItems
      } else {
        // Item doesn't exist, add it
        return [...prevItems, newItem]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearBag = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <BagContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearBag,
        getTotalPrice,
      }}
    >
      {children}
    </BagContext.Provider>
  )
}

export function useBag() {
  const context = useContext(BagContext)
  if (context === undefined) {
    throw new Error("useBag must be used within a BagProvider")
  }
  return context
}
