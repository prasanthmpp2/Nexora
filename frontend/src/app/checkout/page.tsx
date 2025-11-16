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

  const handlePayment = async () => {
    if (!formData.address || !formData.city || !formData.phone) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      // Create order
      const { data: order } = await api.post('/orders', {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0],
        })),
        shippingAddress: formData,
        paymentMethod: 'mock',
        totalPrice: getTotalPrice(),
        taxPrice: 0,
        shippingPrice: 0,
      })

      // Process mock payment
      const { data: payment } = await api.post('/payments/mock/process', {
        orderId: order._id,
      })

      if (payment.success) {
        toast.success('Payment successful! 🎉')
        clearCart()
        router.push(`/payment/success?orderId=${order._id}`)
      }
    } catch (error: any) {
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
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900"
                />

                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900"
                />
              </div>

              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              📢 <strong>Demo Mode:</strong> Mock payment for demonstration
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-nexora-blue">₹{getTotalPrice()}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-nexora-gradient text-white py-4 rounded-full font-semibold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
