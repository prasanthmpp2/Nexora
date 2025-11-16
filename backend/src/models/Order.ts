import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  orderItems: Array<{
    product: mongoose.Types.ObjectId
    name: string
    quantity: number
    price: number
    image: string
  }>
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  paymentResult?: {
    id: string
    status: string
    update_time: string
    email_address?: string
  }
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['razorpay', 'stripe', 'cod'],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IOrder>('Order', orderSchema)
