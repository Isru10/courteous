import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 params is now a Promise
) {
  try {
    await dbConnect();

    const { id } = await params; // 👈 await params
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get reviews for this product
    const reviews = await Review.find({ productId: id })
      .populate("userId", "name avatarUrl")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      product,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
