"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch } from "@/redux/hooks"
import { clearCart } from "@/redux/slices/cartSlice"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    if (sessionId) {
      // Clear the cart since order was successful
      dispatch(clearCart())

      // In a real app, you'd fetch order details using the session ID
      // For now, we'll show a generic success message
      setOrderDetails({
        orderNumber: `ORD-${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      })
    }
  }, [sessionId, dispatch])

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-light">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-center gap-3 text-lg">
                  <Package className="h-5 w-5" />
                  <span>Order #{orderDetails.orderNumber}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-medium">{orderDetails.estimatedDelivery}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Order Status</p>
                    <p className="font-medium text-green-600">Processing</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• A confirmation email has been sent to your email address</p>
                  <p>• You can track your order status in your profile</p>
                  <p>• Our team will contact you if any additional information is needed</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button size="lg" className="group">
                View Order Details
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Additional Information */}
          <div className="bg-muted/30 rounded-lg p-6 text-left space-y-4">
            <h3 className="font-medium">What happens next?</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Order Processing</p>
                  <p>We'll prepare your tuxedo and ensure quality standards are met.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-muted-foreground text-background text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Shipping</p>
                  <p>Your order will be carefully packaged and shipped to your address.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-muted-foreground text-background text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Delivery</p>
                  <p>Receive your premium tuxedo and enjoy your special occasion!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
