"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateQuantity, removeFromCart } from "@/redux/slices/cartSlice"
import { ShoppingBag, X, Minus, Plus, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartSidebarProps {
  children: React.ReactNode
}

export function CartSidebar({ children }: CartSidebarProps) {
  const dispatch = useAppDispatch()
  const { items, total, itemCount } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.user)
  const [isOpen, setIsOpen] = useState(false)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const estimatedTax = total * 0.08
  const shipping = total > 1000 ? 0 : 50
  const finalTotal = total + estimatedTax + shipping

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add some items to get started</p>
                </div>
                <Button onClick={() => setIsOpen(false)} asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (estimated)</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                    <Link href="/cart">View Cart</Link>
                  </Button>

                  {isAuthenticated ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/checkout">
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/auth/signin?redirect=/checkout">Sign In to Checkout</Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
