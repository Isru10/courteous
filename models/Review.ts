import mongoose, { type Document, Schema } from "mongoose"

export interface IReview extends Document {
  rating: number
  text: string
  productId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
