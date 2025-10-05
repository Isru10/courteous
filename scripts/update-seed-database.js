import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tuxedo-ecommerce"

const updatedProducts = [
  {
    title: "Classic Black Tuxedo",
    slug: "classic-black-tuxedo",
    description:
      "Timeless elegance meets modern sophistication in this classic black tuxedo. Perfect for weddings, galas, and formal events.",
    brand: "Armani",
    country: "Italy",
    price: 1299.99,
    images: [
      "/elegant-black-tuxedo-front-view.jpg",
      "/elegant-black-tuxedo-back-view.jpg",
      "/elegant-black-tuxedo-detail-view.jpg",
    ],
    inventory: 25,
    rating: 4.8,
    reviewCount: 42,
    featured: true,
  },
  {
    title: "Midnight Blue Dinner Jacket",
    slug: "midnight-blue-dinner-jacket",
    description:
      "A sophisticated midnight blue dinner jacket that exudes luxury and refinement. Crafted from premium wool blend.",
    brand: "Tom Ford",
    country: "USA",
    price: 2199.99,
    images: ["/midnight-blue-dinner-jacket-elegant.jpg", "/midnight-blue-dinner-jacket-side-view.jpg"],
    inventory: 15,
    rating: 4.9,
    reviewCount: 28,
    featured: true,
  },
  {
    title: "White Tie Tailcoat",
    slug: "white-tie-tailcoat",
    description: "The ultimate in formal wear - a traditional white tie tailcoat for the most prestigious occasions.",
    brand: "Savile Row Co.",
    country: "UK",
    price: 1899.99,
    images: ["/white-tie-tailcoat-formal-wear.jpg", "/white-tie-tailcoat-back-view.jpg"],
    inventory: 8,
    rating: 4.7,
    reviewCount: 15,
    featured: false,
  },
  {
    title: "Burgundy Velvet Tuxedo",
    slug: "burgundy-velvet-tuxedo",
    description:
      "Make a statement with this luxurious burgundy velvet tuxedo. Perfect for holiday parties and special occasions.",
    brand: "Dolce & Gabbana",
    country: "Italy",
    price: 1799.99,
    images: ["/burgundy-velvet-tuxedo-luxury.jpg", "/burgundy-velvet-tuxedo-texture-detail.jpg"],
    inventory: 12,
    rating: 4.6,
    reviewCount: 23,
    featured: true,
  },
  {
    title: "Slim Fit Modern Tuxedo",
    slug: "slim-fit-modern-tuxedo",
    description:
      "Contemporary styling meets classic elegance in this slim-fit modern tuxedo. Ideal for the fashion-forward gentleman.",
    brand: "Hugo Boss",
    country: "Germany",
    price: 899.99,
    images: ["/slim-fit-modern-tuxedo-contemporary.jpg", "/slim-fit-modern-tuxedo-side-profile.jpg"],
    inventory: 30,
    rating: 4.5,
    reviewCount: 67,
    featured: false,
  },
  {
    title: "Double Breasted Tuxedo",
    slug: "double-breasted-tuxedo",
    description: "Classic double-breasted styling with peak lapels. A timeless choice for formal occasions.",
    brand: "Brioni",
    country: "Italy",
    price: 2499.99,
    images: ["/double-breasted-tuxedo-peak-lapels.jpg", "/double-breasted-tuxedo-formal-styling.jpg"],
    inventory: 10,
    rating: 4.9,
    reviewCount: 19,
    featured: true,
  },
]

async function updateDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Update products with correct image paths
    for (const product of updatedProducts) {
      await db.collection("products").updateOne({ slug: product.slug }, { $set: product }, { upsert: true })
    }

    console.log("Updated products with correct image paths")
  } catch (error) {
    console.error("Error updating database:", error)
  } finally {
    await client.close()
  }
}

updateDatabase()
