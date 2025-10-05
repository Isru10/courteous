"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Cancel Icon */}
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          {/* Cancel Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-light">Payment Cancelled</h1>
            <p className="text-lg text-muted-foreground">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </div>

          {/* Information Card */}
          <Card>
            <CardContent className="p-8 space-y-4">
              <h3 className="font-medium">What happened?</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Your payment was cancelled before completion</p>
                <p>• Your cart items are still saved and ready for checkout</p>
                <p>• No payment has been processed</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout">
              <Button size="lg" className="group">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-muted/30 rounded-lg p-6 text-left">
            <h3 className="font-medium mb-3">Need Help?</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>If you're experiencing issues with checkout, please:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check that your payment information is correct</li>
                <li>Ensure your card has sufficient funds</li>
                <li>Try a different payment method</li>
                <li>Contact our support team if the problem persists</li>
              </ul>
            </div>
            <Link href="/contact" className="inline-block mt-4">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
