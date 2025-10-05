import { type NextRequest, NextResponse } from "next/server"


import dbConnect from "@/lib/db"
import Review from "@/models/Review"
import Product from "@/models/Product"
import { authOptions } from "@/lib/auth"
import { reviewSchema } from "@/lib/validators"
import { getServerSession } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    await dbConnect()

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId: validatedData.productId,
      userId: session.user.id,
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Create review
    const review = await Review.create({
      ...validatedData,
      userId: session.user.id,
    })

    // Update product rating
    const reviews = await Review.find({ productId: validatedData.productId })
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await Product.findByIdAndUpdate(validatedData.productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    })

    const populatedReview = await Review.findById(review._id).populate("userId", "name avatarUrl").lean()

    return NextResponse.json(populatedReview, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
