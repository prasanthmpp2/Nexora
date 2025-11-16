'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.numReviews})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-nexora-blue">
              ₹{product.price.toLocaleString()}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-nexora-gradient text-white p-3 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
