import { Request, Response } from 'express'
import Order from '../models/Order'
import { v4 as uuidv4 } from 'uuid'

export const processMockPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order already paid' })
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const transactionId = `MOCK_${uuidv4()}`

    order.isPaid = true
    order.paidAt = new Date()
    order.status = 'processing'
    order.paymentMethod = 'mock'
    order.paymentResult = {
      id: transactionId,
      status: 'completed',
      update_time: new Date().toISOString(),
    }

    await order.save()

    res.json({
      success: true,
      message: 'Payment successful (DEMO MODE)',
      transactionId,
      order: {
        _id: order._id,
        isPaid: order.isPaid,
        totalPrice: order.totalPrice,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
