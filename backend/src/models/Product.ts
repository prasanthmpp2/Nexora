import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: string
  subcategory?: string
  brand?: string
  stock: number
  images: string[]
  rating: number
  numReviews: number
  isFeatured: boolean
  specifications?: Map<string, string>
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Electronics',
        'Fashion',
        'Home & Kitchen',
        'Beauty',
        'Sports',
        'Books',
        'Toys',
        'Automotive',
      ],
    },
    subcategory: String,
    brand: String,
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0 && v.length <= 10
        },
        message: 'Must have between 1 and 10 images',
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: Map,
      of: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
)

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, price: 1 })
productSchema.index({ rating: -1 })

export default mongoose.model<IProduct>('Product', productSchema)
