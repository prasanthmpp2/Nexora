import { Request, Response } from 'express'
import Product from '../models/Product'
import Order from '../models/Order'

// Simple collaborative filtering for recommendations
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id

    // Get user's purchase history
    const userOrders = await Order.find({ user: userId })
      .populate('orderItems.product')
      .limit(10)

    // Extract categories and brands
    const categories = new Set<string>()
    const brands = new Set<string>()

    userOrders.forEach((order) => {
      order.orderItems.forEach((item: any) => {
        if (item.product.category) categories.add(item.product.category)
        if (item.product.brand) brands.add(item.product.brand)
      })
    })

    // Find similar products
    const recommendations = await Product.find({
      $or: [
        { category: { $in: Array.from(categories) } },
        { brand: { $in: Array.from(brands) } },
      ],
    })
      .sort({ rating: -1, numReviews: -1 })
      .limit(10)

    res.json(recommendations)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
