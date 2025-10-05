import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  title: string
  slug: string
  description: string
  brand: string
  country: string
  price: number
  images: string[]
  inventory: number
  rating: number
  reviewCount: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    inventory: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
ProductSchema.index({ brand: 1, price: 1 })
ProductSchema.index({ featured: 1, createdAt: -1 })
ProductSchema.index({ slug: 1 })

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
