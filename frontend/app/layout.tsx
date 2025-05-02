import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BagProvider } from "@/contexts/bag-context"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"
import { AIAssistantProvider } from "@/contexts/ai-assistant-context"
import { AIAssistantModal } from "@/components/ai-assistant/ai-assistant-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Baiyit - AI-Powered Shopping Experience",
  description:
    "Shop with confidence using our AI-powered shopping experience. Browse, compare, and purchase with ease.",
    generator: 'v0.dev'
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
          <BagProvider>
            <AIAssistantProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 pt-24 md:pt-20">{children}</main>
                <Footer />
                <AIAssistantModal />
              </div>
            </AIAssistantProvider>
          </BagProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
