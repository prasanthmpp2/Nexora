'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { CreditCard, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    phone: '',
  })

  const handleMockPayment = async () => {
    try {
      // Validate form
      if (!formData.address || !formData.city || !formData.phone) {
        toast.error('Please fill all shipping details')
        return
      }

      if (items.length === 0) {
        toast.error('Your cart is empty')
        return
      }

      setLoading(true)

      // Step 1: Create order
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0],
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: 'mock',
        totalPrice: getTotalPrice(),
        taxPrice: 0,
        shippingPrice: 0,
      }

      const { data: order } = await api.post('/orders', orderData)

      // Step 2: Process mock payment (instant success)
      const { data: payment } = await api.post('/payments/mock/process', {
        orderId: order._id,
      })

      if (payment.success) {
        toast.success('Payment successful! 🎉')
        clearCart()
        
        // Redirect to success page
        setTimeout(() => {
          router.push(`/payment/success?orderId=${order._id}`)
        }, 1000)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push('/products')}
          className="bg-nexora-gradient text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📦 Shipping Details
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-nexora-blue outline-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-nexora-blue outline-none"
                />

                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-nexora-blue outline-none"
                />
              </div>

              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-nexora-blue outline-none"
              />
            </div>
          </div>

          {/* Demo Mode Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>📢 Demo Mode:</strong> This is a mock payment system for
              demonstration purposes. No real money will be charged.
            </p>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-nexora-blue">
                  ₹{getTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleMockPayment}
              disabled={loading}
              className="w-full bg-nexora-gradient text-white py-4 rounded-full font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Complete Payment
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              🔒 Secure demo checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
