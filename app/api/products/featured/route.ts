import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"

export async function GET() {
  try {
    await dbConnect()

    const featuredProducts = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(6).lean()

    return NextResponse.json({ products: featuredProducts })
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}
