import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"
import { AIAssistantProvider } from "@/contexts/ai-assistant-context"
import { AIAssistantModal } from "@/components/ai-assistant/ai-assistant-modal"
import { AuthProvider } from "@/contexts/auth-context"
import { SessionProvider } from "@/contexts/session-context"
import { Toaster } from "sonner"
import { CartDrawer } from "@/components/cart-drawer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Baiyit - AI-Powered Shopping Experience",
  description:
    "Shop with confidence using our AI-powered shopping experience. Browse, compare, and purchase with ease.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-text-dark`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <SessionProvider>
              <CartProvider>
                <AIAssistantProvider>
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1 pt-16 md:pt-16">{children}</main>
                    <Footer />
                    <AIAssistantModal />
                    <CartDrawer />
                  </div>
                  <Toaster position="top-center" richColors />
                </AIAssistantProvider>
              </CartProvider>
            </SessionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
