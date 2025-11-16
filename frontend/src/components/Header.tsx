'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function Header() {
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Nexora
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-blue-600 transition">
            Products
          </Link>
          <Link href="/checkout" className="relative hover:text-blue-600 transition">
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
