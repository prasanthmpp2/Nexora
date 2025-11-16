import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  rating: number
  title: string
  comment: string
  images?: string[]
  helpful: number
  verified: boolean
  sentiment?: 'positive' | 'negative' | 'neutral'
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    images: [String],
    helpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
  },
  {
    timestamps: true,
  }
)

// Prevent multiple reviews from same user for same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.model<IReview>('Review', reviewSchema)
