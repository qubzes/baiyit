"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { useAcquisitions } from "@/hooks/use-acquisitions"
import { Button } from "@/components/ui/button"
import { Package, ChevronRight, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function AcquisitionsPage() {
  const { acquisitions, isLoading } = useAcquisitions()

  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-4xl font-bold text-primary-navy mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Acquisitions
          </motion.h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 text-accent-sky animate-spin" />
            </div>
          ) : acquisitions.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-accent-sky/10 flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-accent-sky" />
              </div>
              <h2 className="text-2xl font-bold text-primary-navy mb-4">No acquisitions yet</h2>
              <p className="text-gray-600 mb-6">Start shopping with Baiyit to see your acquisitions here</p>
              <Button className="button-accent">Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {acquisitions.map((acquisition, index) => (
                <motion.div
                  key={acquisition.id}
                  className="glass-panel overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Order #{acquisition.id}</p>
                        <p className="text-lg font-medium text-primary-navy">
                          {new Date(acquisition.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-primary-navy">${acquisition.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex -space-x-4">
                          {acquisition.items.slice(0, 3).map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                            >
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}

                          {acquisition.items.length > 3 && (
                            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">+{acquisition.items.length - 3}</span>
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <p className="font-medium text-primary-navy">
                            {acquisition.items.length} {acquisition.items.length === 1 ? "item" : "items"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Status:{" "}
                            <span
                              className={`font-medium ${
                                acquisition.status === "Delivered"
                                  ? "text-green-600"
                                  : acquisition.status === "Shipped"
                                    ? "text-blue-600"
                                    : "text-orange-600"
                              }`}
                            >
                              {acquisition.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Button variant="ghost" className="text-primary-navy">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
