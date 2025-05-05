"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, ShoppingBag, User, CreditCard, MessageSquare } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { useOrders } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { cancelOrder } from "@/app/actions/order-actions"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const { orders, isLoading: isOrdersLoading, mutate } = useOrders()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrderId(orderId)

      const result = await cancelOrder(orderId)

      if (!result.success) {
        toast.error(result.error || "Failed to cancel order. Please try again.")
      } else {
        toast.success("Order has been cancelled successfully.")

        // Update the order status in the local state without a full reload
        mutate(orders.map((order) => (order.id === orderId ? { ...order, status: "Cancelled" } : order)))
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setCancellingOrderId(null)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="font-medium">First Name</div>
                <div>{user.first_name}</div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="font-medium">Last Name</div>
                <div>{user.last_name}</div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="font-medium">Email</div>
                <div>{user.email}</div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="font-medium">Member Since</div>
                <div>{formatDate(user.created_at)}</div>
              </div>
            </CardContent>
          </Card>
        )
      case "payment":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-md bg-gray-100 p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-muted-foreground">Expires 12/25</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-primary">Default</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        )
      case "orders":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-md border p-4">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{order.status}</div>
                          {order.status === "Processing" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancellingOrderId === order.id}
                            >
                              {cancellingOrderId === order.id ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : null}
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.product_id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-md bg-gray-100">
                                {item.image && (
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="h-full w-full object-cover rounded-md"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-medium">${item.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center space-y-2 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  <div className="font-medium">No orders yet</div>
                  <div className="text-sm text-muted-foreground">
                    When you make a purchase, your orders will appear here.
                  </div>
                  <Button variant="outline" onClick={() => router.push("/products")}>
                    Browse Products
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      case "sessions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Baiyit Sessions</CardTitle>
              <CardDescription>View your conversation history with Baiyit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-2 font-medium">Coming Soon</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You'll soon be able to see all your past conversations with Baiyit here.
                </p>
                <Button className="mt-4" onClick={() => router.push("/concierge")}>
                  Chat with Baiyit
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 mt-0 md:mt-6">
      <h1 className="mb-6 text-2xl font-bold md:hidden">My Profile</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <SidebarProvider>
          <Sidebar className="hidden md:flex" collapsible="none">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={activeTab === "account"} onClick={() => setActiveTab("account")}>
                        <User className="h-4 w-4" />
                        <span>Account</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={activeTab === "payment"} onClick={() => setActiveTab("payment")}>
                        <CreditCard className="h-4 w-4" />
                        <span>Payment Methods</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Orders</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={activeTab === "sessions"} onClick={() => setActiveTab("sessions")}>
                        <MessageSquare className="h-4 w-4" />
                        <span>Baiyit Sessions</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={logout} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Mobile navigation */}
          <div className="flex flex-wrap gap-2 md:hidden">
            <Button
              variant={activeTab === "account" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("account")}
              className="flex-grow"
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </Button>
            <Button
              variant={activeTab === "payment" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("payment")}
              className="flex-grow"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payment
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("orders")}
              className="flex-grow"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeTab === "sessions" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("sessions")}
              className="flex-grow"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Sessions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex-grow text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </SidebarProvider>

        <div>{renderContent()}</div>
      </div>
    </div>
  )
}
