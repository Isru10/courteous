"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import type { Product } from "@/redux/slices/productsSlice"

interface RelatedProductsProps {
  currentProductId: string
  brand: string
}

export function RelatedProducts({ currentProductId, brand }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedProducts()
  }, [currentProductId, brand])

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products?brand=${brand}&limit=4`)
      const data = await response.json()

      // Filter out current product and limit to 3 items
      const filtered = data.products.filter((product: Product) => product._id !== currentProductId).slice(0, 3)

      setRelatedProducts(filtered)
    } catch (error) {
      console.error("Error fetching related products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-light">You might also like</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-light">You might also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
