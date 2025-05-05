"use server"

import { orderService } from "@/lib/api/order-service"
import { auth } from "@/lib/auth"

export interface OrderItem {
  product_id: string
  quantity: number
}

export async function createOrder(items: OrderItem[]) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session) {
      return { error: "You must be logged in to place an order", data: null }
    }

    // Validate items
    if (!items || items.length === 0) {
      return { error: "Your cart is empty", data: null }
    }

    // Call the order service
    const response = await orderService.createOrder({
      items,
    })

    if (response.error) {
      return { error: response.error, data: null }
    }

    return { error: null, data: response.data }
  } catch (error) {
    console.error("Error creating order:", error)
    return { error: "An unexpected error occurred", data: null }
  }
}
