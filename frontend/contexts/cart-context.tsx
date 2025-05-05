"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem } from "@/types/cart"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  checkout: () => Promise<boolean>
  openCart: () => void
  closeCart: () => void
  isOpen: boolean
}

// Export the CartContext so it can be imported elsewhere
export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const openCart = () => {
    console.log("Opening cart drawer")
    setIsOpen(true)
  }

  const closeCart = () => {
    console.log("Closing cart drawer")
    setIsOpen(false)
  }

  const addItem = (newItem: CartItem) => {
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

    // Open the cart when adding an item
    openCart()
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const checkout = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      toast.error("Please log in to checkout")
      return false
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return false
    }

    // The actual checkout process is now handled by the CheckoutModal component
    // This function is kept for compatibility but doesn't need to do the API call anymore
    return true
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        checkout,
        openCart,
        closeCart,
        isOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
