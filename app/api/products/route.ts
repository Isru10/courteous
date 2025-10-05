import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const brand = searchParams.get("brand")
    const country = searchParams.get("country")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rating = searchParams.get("rating")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    // Build filter object
    const filter: any = {}

    if (brand) filter.brand = { $in: brand.split(",") }
    if (country) filter.country = { $in: country.split(",") }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }
    if (rating) filter.rating = { $gte: Number.parseFloat(rating) }
    if (featured === "true") filter.featured = true
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
