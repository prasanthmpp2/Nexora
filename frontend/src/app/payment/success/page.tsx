'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import api from '@/lib/api'
import Confetti from 'react-confetti'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { clearCart } = useCartStore()
  const [order, setOrder] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    clearCart()

    if (orderId) {
      // Fetch order details
      api.get(`/orders/${orderId}`)
        .then(({ data }) => setOrder(data))
        .catch(console.error)
    }

    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000)
  }, [orderId, clearCart])

  return (
    <div className="container mx-auto px-4 py-16">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your order has been placed successfully
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order ID
                </p>
                <p className="font-mono font-semibold text-sm">
                  {order._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="font-semibold text-nexora-blue text-lg">
                  ₹{order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Delivery Address
              </p>
              <p className="text-sm">
                {order.shippingAddress.address}, {order.shippingAddress.city}
                <br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                What happens next?
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>✓ Order confirmation email sent</li>
                <li>✓ Your order is being processed</li>
                <li>✓ Estimated delivery: 3-5 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/orders/${orderId}`}
            className="flex items-center justify-center gap-2 w-full bg-nexora-gradient text-white py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            View Order Details
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/products"
            className="block w-full text-center border border-gray-300 dark:border-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🎭 This was a demo payment - No real money was charged
          </p>
        </div>
      </div>
    </div>
  )
}
