'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Search, Moon, Sun } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useTheme } from 'next-themes'
import Cart from './Cart'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const { items, toggleCart, getTotalItems } = useCartStore()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-nexora-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <div className="text-2xl font-bold bg-nexora-gradient bg-clip-text text-transparent">
                  NEXORA
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Next-generation shopping
                </div>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-nexora-blue"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-nexora-blue transition-colors"
              >
                Products
              </Link>
              <Link
                href="/deals"
                className="text-gray-700 dark:text-gray-300 hover:text-nexora-blue transition-colors"
              >
                Deals
              </Link>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <Link
                href="/auth/login"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-6 h-6" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
              />
              <Link href="/products" className="block py-2">
                Products
              </Link>
              <Link href="/deals" className="block py-2">
                Deals
              </Link>
            </div>
          )}
        </nav>
      </header>

      <Cart />
    </>
  )
}
