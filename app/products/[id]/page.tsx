"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { useAppDispatch } from "@/redux/hooks"
import { addToCart } from "@/redux/slices/cartSlice"
import type { Product } from "@/redux/slices/productsSlice"

interface Review {
  _id: string
  rating: number
  text: string
  userId: {
    name: string
    avatarUrl?: string
  }
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()

      setProduct(data.product)
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          brand: product.brand,
        }),
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-md" />
                ))}
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-12 bg-muted rounded w-1/4" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-light mb-4">Product not found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                {product.featured && <Badge variant="secondary">Featured</Badge>}
                {product.inventory < 10 && <Badge variant="destructive">Only {product.inventory} left</Badge>}
              </div>

              <h1 className="text-3xl font-light">{product.title}</h1>
              <p className="text-lg text-muted-foreground">
                {product.brand} • {product.country}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-light">${product.price.toLocaleString()}</div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    disabled={quantity >= product.inventory}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.inventory === 0}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-muted-foreground">On orders over $1,000</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Authenticity Guarantee</p>
                      <p className="text-sm text-muted-foreground">100% authentic designer pieces</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">30-Day Returns</p>
                      <p className="text-sm text-muted-foreground">Easy returns and exchanges</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <ProductReviews
            productId={product._id}
            reviews={reviews}
            averageRating={product.rating}
            totalReviews={product.reviewCount}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts currentProductId={product._id} brand={product.brand} />
      </div>

      <Footer />
    </div>
  )
}
