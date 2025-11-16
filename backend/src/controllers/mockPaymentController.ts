import { Request, Response } from 'express'
import Order from '../models/Order'
import { v4 as uuidv4 } from 'uuid'

// @desc    Mock payment - Instant success (for demo/testing only)
// @route   POST /api/payments/mock/process
// @access  Private
export const processMockPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body

    // Find order
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if already paid
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order already paid' })
    }

    // Generate fake transaction ID
    const transactionId = `MOCK_${uuidv4()}`

    // Simulate processing delay (optional - makes it feel more realistic)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mark order as paid
    order.isPaid = true
    order.paidAt = new Date()
    order.status = 'processing'
    order.paymentMethod = 'mock'
    order.paymentResult = {
      id: transactionId,
      status: 'completed',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    }

    await order.save()

    res.json({
      success: true,
      message: 'Payment successful (DEMO MODE)',
      transactionId,
      order: {
        _id: order._id,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        totalPrice: order.totalPrice,
      },
    })
  } catch (error: any) {
    console.error('Mock Payment Error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Mock payment - Simulate failure (optional for testing)
// @route   POST /api/payments/mock/fail
// @access  Private
export const simulateFailedPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mark as failed
    order.paymentResult = {
      id: `FAILED_${uuidv4()}`,
      status: 'failed',
      update_time: new Date().toISOString(),
    }

    await order.save()

    res.status(400).json({
      success: false,
      message: 'Payment failed (DEMO MODE)',
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
