"use client"

import { useState, useEffect, useCallback } from "react"
import { orderService } from "@/lib/api/order-service"
import { useAuth } from "@/contexts/auth-context"

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await orderService.listOrders({
        page: 1,
        size: 10,
        sort_by: "created_at",
        descending: true,
      })

      if (error) {
        setError(error)
      } else if (data) {
        setOrders(data.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching orders")
      console.error("Error fetching orders:", err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Function to manually update the orders data
  const mutate = useCallback((newOrders: any[] | ((prevOrders: any[]) => any[])) => {
    setOrders((prev) => {
      if (typeof newOrders === "function") {
        return newOrders(prev)
      }
      return newOrders
    })
  }, [])

  // Function to refresh the orders data
  const refresh = useCallback(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    isLoading,
    error,
    mutate,
    refresh,
  }
}
