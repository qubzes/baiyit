"use client"

import type React from "react"

import { useRef } from "react"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { ShoppingBag, MessageSquare } from "lucide-react"
import { useBag } from "@/hooks/use-bag"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useBag()
  const { updateContextInfo, openAssistant } = useAIAssistant()
  const cardRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // 3D tilt effect - only on desktop
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 400, damping: 30 })
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 })

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleAddToBag = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const handleAskAbout = () => {
    updateContextInfo({
      page: "product",
      path: `/products/${product.id}`,
      data: product,
    })
    openAssistant()
  }

  return (
    <motion.div
      ref={cardRef}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden h-full transition-shadow hover:shadow-md"
      style={
        isMobile
          ? {}
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }
      }
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-square">
        <Link href={`/products/${product.id}`}>
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        </Link>

        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-accent-sky text-white">{product.discount}% OFF</Badge>
        )}
      </div>

      <div className="p-3 md:p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-sm md:text-base text-primary-navy line-clamp-2 hover:text-accent-sky transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-baseline mt-1 md:mt-2 mb-2 md:mb-3">
          <span className="text-base md:text-lg font-bold text-primary-navy">${product.price.toFixed(2)}</span>

          {product.originalPrice && (
            <span className="text-xs md:text-sm text-gray-500 line-through ml-2">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Button
            size={isMobile ? "sm" : "default"}
            className="w-full bg-primary-navy hover:bg-primary-navy/90"
            onClick={handleAddToBag}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Bag
          </Button>

          <Button size={isMobile ? "sm" : "default"} variant="outline" className="w-full" onClick={handleAskAbout}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask Baiyit
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
