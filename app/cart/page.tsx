"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateQuantity, removeFromCart, clearCart } from "@/redux/slices/cartSlice"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { items, total, itemCount } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.user)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const estimatedTax = total * 0.08 // 8% tax estimate
  const shipping = total > 1000 ? 0 : 50 // Free shipping over $1000
  const finalTotal = total + estimatedTax + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-16">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-light">Your cart is empty</h1>
              <p className="text-muted-foreground">Discover our collection of premium tuxedos and formal wear.</p>
            </div>
            <Link href="/products">
              <Button size="lg" className="group">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{itemCount} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Items</h2>
              <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-destructive">
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={96}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 text-sm min-w-[3rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">${item.price.toLocaleString()} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>

                  {shipping === 0 && <p className="text-sm text-green-600">Free shipping on orders over $1,000!</p>}

                  <Separator />

                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {isAuthenticated ? (
                    <Link href="/checkout">
                      <Button size="lg" className="w-full">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth/signin?redirect=/checkout">
                        <Button size="lg" className="w-full">
                          Sign In to Checkout
                        </Button>
                      </Link>
                      <p className="text-xs text-muted-foreground text-center">
                        New customer?{" "}
                        <Link href="/auth/signup" className="underline hover:no-underline">
                          Create an account
                        </Link>
                      </p>
                    </div>
                  )}

                  <Link href="/products">
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-3">Secure Checkout</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>SSL encrypted payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Authenticity guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
