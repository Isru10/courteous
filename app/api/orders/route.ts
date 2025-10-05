import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, subtotal, total } = await request.json()

    await dbConnect()

    // Create order in database
    const order = await Order.create({
      userId: session.user.id,
      items,
      subtotal,
      total,
      status: "pending",
      trackingEvents: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order created",
        },
      ],
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
      },
    })

    // Update order with Stripe session ID
    await Order.findByIdAndUpdate(order._id, {
      stripeSessionId: stripeSession.id,
    })

    return NextResponse.json({
      orderId: order._id,
      checkoutUrl: stripeSession.url,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
