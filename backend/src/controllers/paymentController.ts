import { Request, Response } from 'express'
import Razorpay from 'razorpay'
import Stripe from 'stripe'
import crypto from 'crypto'
import Order from '../models/Order'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create
// @access  Private
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR' } = req.body

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    res.json(order)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      req.body

    const body = razorpay_order_id + '|' + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Update order
      const order = await Order.findById(orderId)

      if (order) {
        order.isPaid = true
        order.paidAt = new Date()
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'completed',
          update_time: new Date().toISOString(),
        }
        order.status = 'processing'

        await order.save()

        res.json({ success: true, message: 'Payment verified successfully' })
      } else {
        res.status(404).json({ message: 'Order not found' })
      }
    } else {
      res.status(400).json({ message: 'Payment verification failed' })
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create
// @access  Private
export const createStripePaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd' } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Stripe webhook handler
// @route   POST /api/payments/stripe/webhook
// @access  Public
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object

      // Update order in database
      // Implementation depends on how you track orders with payment intents
    }

    res.json({ received: true })
  } catch (error: any) {
    res.status(400).json({ message: `Webhook Error: ${error.message}` })
  }
}
