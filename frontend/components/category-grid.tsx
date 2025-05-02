"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function CategoryGrid() {
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
      count: 1243,
    },
    {
      id: "fashion",
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071",
      count: 2458,
    },
    {
      id: "home",
      name: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-bda9f7f6b548?q=80&w=2070",
      count: 1876,
    },
    {
      id: "beauty",
      name: "Beauty & Personal Care",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080",
      count: 932,
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070",
      count: 754,
    },
    {
      id: "toys",
      name: "Toys & Games",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070",
      count: 623,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/categories/${category.id}`}
            className="block group overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-medium text-primary-navy mb-1 group-hover:text-accent-sky transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} products</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
