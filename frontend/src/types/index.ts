export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  rating: number
  numReviews: number
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
}

export interface Order {
  _id: string
  user: User
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult?: PaymentResult
  totalPrice: number
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  createdAt: string
}

export interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface PaymentResult {
  id: string
  status: string
  update_time: string
  email_address: string
}
