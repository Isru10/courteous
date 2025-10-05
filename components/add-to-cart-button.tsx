"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/redux/hooks"
import { addToCart } from "@/redux/slices/cartSlice"
import { ShoppingBag, Check } from "lucide-react"

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    price: number
    image: string
    brand: string
  }
  quantity?: number
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function AddToCartButton({
  product,
  quantity = 1,
  disabled = false,
  className,
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product))
    }

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdded}
      size={size}
      variant={variant}
      className={className}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
