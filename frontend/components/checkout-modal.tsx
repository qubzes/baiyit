"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, Loader2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { createOrder } from "@/app/actions/order-actions"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsProcessing(true)
    setError(null)

    try {
      // Create order items from cart items
      const orderItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }))

      // Call server action to create order
      const result = await createOrder({ items: orderItems })

      if (result.success && result.data) {
        setIsSuccess(true)
        setOrderId(result.data.id)
        clearCart()
      } else {
        setError(result.error || "Failed to place order. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleViewOrder = () => {
    onClose()
    router.push("/profile?tab=orders")
  }

  const handleContinueShopping = () => {
    onClose()
    router.push("/products")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white shadow-xl z-50 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary-navy">{isSuccess ? "Order Confirmed" : "Checkout"}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Thank you for your order!</h3>
                  <p className="text-gray-600 mb-6">
                    Your order #{orderId} has been placed successfully and is now being processed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button className="flex-1" onClick={handleViewOrder}>
                      View Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleContinueShopping}>
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">Order Summary</h3>
                    <div className="max-h-60 overflow-y-auto mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center py-2 border-b">
                          <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

                  <Button
                    className="w-full bg-accent-sky hover:bg-accent-sky/90 h-12 text-base"
                    onClick={handleCheckout}
                    disabled={isProcessing || items.length === 0}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
