"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, User } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { AIAssistantInput } from "@/components/ai-assistant/ai-assistant-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { CartDrawer } from "./cart-drawer"

export function Navbar() {
  const { items, openCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  // Debug logging
  const handleCartClick = () => {
    console.log("Cart icon clicked")
    openCart()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md mx-0 mt-0 px-4 py-3 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold text-primary-navy">Baiyit</span>
            </motion.div>
          </Link>

          {/* AI Assistant Input in the middle */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <AIAssistantInput />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="relative"
              onClick={handleCartClick}
              aria-label={`Open cart with ${items.length} items`}
            >
              <ShoppingCart className="h-5 w-5 text-primary-navy" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-sky text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>

            {/* Profile/Login */}
            {isAuthenticated ? (
              <Button asChild variant="ghost" size="sm" className="px-2 flex items-center gap-1.5" aria-label="Profile">
                <Link href="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.first_name || "User"} />
                    <AvatarFallback>{user?.first_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline ml-2">{user?.first_name || "User"}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="px-2 flex items-center gap-1.5" aria-label="Login">
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile AI Assistant Input - shown below navbar on mobile */}
      <div className="md:hidden fixed top-[60px] left-0 right-0 z-30 bg-white/90 backdrop-blur-md px-4 py-2 border-b border-gray-200">
        <AIAssistantInput />
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  )
}
