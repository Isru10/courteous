import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  name: string
  password: string
  avatarUrl?: string
  role: "customer" | "admin"
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  },
)

// Prevent re-compilation during development
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
