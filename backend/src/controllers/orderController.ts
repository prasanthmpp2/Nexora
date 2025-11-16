import { Request, Response } from 'express'
import Order from '../models/Order'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' })
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,
    })

    res.status(201).json(order)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = req.body.status || order.status
    order.isDelivered = req.body.isDelivered || order.isDelivered
    if (req.body.isDelivered) {
      order.deliveredAt = new Date()
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
