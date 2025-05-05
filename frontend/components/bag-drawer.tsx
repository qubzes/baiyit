"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { useBag } from "@/hooks/use-bag";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BagDrawer({ isOpen, onClose }: BagDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useBag();

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary-navy">Your Bag</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-background-light flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start adding items to your bag
                  </p>
                  <Button className="button-accent" onClick={onClose}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      className="flex gap-4"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-primary-navy">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          ${item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="mx-3 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-sm text-gray-500"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-medium">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <Link href="/bag/checkout">
                  <Button className="button-accent w-full">
                    Proceed to Thanks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
