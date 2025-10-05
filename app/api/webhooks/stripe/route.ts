import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    await dbConnect()

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            status: "paid",
            $push: {
              trackingEvents: {
                status: "paid",
                timestamp: new Date(),
                note: "Payment completed successfully",
              },
            },
          })
        }
        break

      case "checkout.session.expired":
        const expiredSession = event.data.object
        const expiredOrderId = expiredSession.metadata?.orderId

        if (expiredOrderId) {
          await Order.findByIdAndUpdate(expiredOrderId, {
            status: "cancelled",
            $push: {
              trackingEvents: {
                status: "cancelled",
                timestamp: new Date(),
                note: "Payment session expired",
              },
            },
          })
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
