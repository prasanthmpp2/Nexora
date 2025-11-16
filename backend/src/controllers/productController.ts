import { Request, Response } from 'express'
import Product from '../models/Product'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 12
    const skip = (page - 1) * limit

    const queryObj: any = {}

    if (req.query.category) {
      queryObj.category = req.query.category
    }

    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {}
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice)
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice)
    }

    if (req.query.rating) {
      queryObj.rating = { $gte: Number(req.query.rating) }
    }

    if (req.query.featured === 'true') {
      queryObj.isFeatured = true
    }

    if (req.query.search) {
      queryObj.$text = { $search: req.query.search as string }
    }

    let sortOptions: any = { createdAt: -1 }
    if (req.query.sort === 'price-asc') sortOptions = { price: 1 }
    if (req.query.sort === 'price-desc') sortOptions = { price: -1 }
    if (req.query.sort === 'rating') sortOptions = { rating: -1 }

    const products = await Product.find(queryObj).sort(sortOptions).limit(limit).skip(skip)
    const total = await Product.countDocuments(queryObj)

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product removed' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
