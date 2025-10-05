import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Star } from "lucide-react"
import type { Product } from "@/redux/slices/productsSlice"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-muted/20 relative">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            width={400}
            height={533}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
              Featured
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
          {product.inventory < 10 && (
            <span className="text-xs text-destructive font-medium">Only {product.inventory} left</span>
          )}
        </div>

        <Link href={`/products/${product._id}`}>
          <div className="space-y-1">
            <h3 className="font-medium text-lg hover:text-primary transition-colors">{product.title}</h3>
            <p className="text-sm text-muted-foreground">
              {product.brand} • {product.country}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-xl font-light">${product.price.toLocaleString()}</p>
          <AddToCartButton
            product={{
              id: product._id,
              title: product.title,
              price: product.price,
              image: product.images[0],
              brand: product.brand,
            }}
            size="sm"
            variant="ghost"
            disabled={product.inventory === 0}
          />
        </div>
      </CardContent>
    </Card>
  )
}
