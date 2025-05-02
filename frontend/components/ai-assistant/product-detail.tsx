"use client"

import { Button } from "@/components/ui/button"
import { X, ShoppingBag, Star, ChevronRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useBag } from "@/hooks/use-bag"
import type { Product } from "@/types/product"
import { motion } from "framer-motion"

interface ProductDetailProps {
  product: Product
  onClose: () => void
  isMobile?: boolean
}

export function ProductDetail({ product, onClose, isMobile = false }: ProductDetailProps) {
  const { addItem } = useBag()

  const handleAddToBag = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between p-4 border-b">
        {isMobile ? (
          <Button variant="ghost" size="sm" className="flex items-center" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
        ) : (
          <h3 className="font-medium text-primary-navy">Product Details</h3>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-square relative mb-4 rounded-lg overflow-hidden"
        >
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-primary-navy mb-2">{product.title}</h2>

          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({Math.floor(Math.random() * 500) + 50} reviews)
            </span>
          </div>

          <div className="flex items-baseline mb-4">
            <span className="text-2xl font-bold text-primary-navy">${product.price.toFixed(2)}</span>

            {product.originalPrice && (
              <>
                <span className="text-base text-gray-500 line-through ml-3">${product.originalPrice.toFixed(2)}</span>
                <span className="ml-3 bg-accent-sky/10 text-accent-sky text-sm font-medium px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>
        </motion.div>

        {/* Specs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="font-medium text-primary-navy mb-2">Key Features</h3>
          <ul className="space-y-2">
            {product.specs?.map((spec, index) => (
              <li key={index} className="flex items-start">
                <ChevronRight className="h-4 w-4 text-accent-sky mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{spec}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button className="w-full bg-primary-navy hover:bg-primary-navy/90 py-3 mb-4" onClick={handleAddToBag}>
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Bag
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
