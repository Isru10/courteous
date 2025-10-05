import mongoose, { type Document, Schema } from "mongoose"

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  title: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: IOrderItem[]
  subtotal: number
  total: number
  status: "pending" | "paid" | "on_route" | "delivered" | "cancelled"
  stripeSessionId?: string
  trackingEvents: Array<{
    status: string
    timestamp: Date
    note?: string
  }>
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
})

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "on_route", "delivered", "cancelled"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
    },
    trackingEvents: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for user orders and status queries
OrderSchema.index({ userId: 1, createdAt: -1 })
OrderSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
