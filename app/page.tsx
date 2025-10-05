import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Star } from "lucide-react"

export default function HomePage() {
  const featuredProducts = [
    {
      id: "1",
      title: "Classic Black Tuxedo",
      brand: "Armani",
      price: 1299.99,
      image: "/elegant-black-tuxedo-front-view.jpg",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Midnight Blue Dinner Jacket",
      brand: "Tom Ford",
      price: 2199.99,
      image: "/midnight-blue-dinner-jacket-elegant.jpg",
      rating: 4.9,
    },
    {
      id: "3",
      title: "Burgundy Velvet Tuxedo",
      brand: "Dolce & Gabbana",
      price: 1799.99,
      image: "/burgundy-velvet-tuxedo-luxury.jpg",
      rating: 4.6,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-muted/20">
        <div className="container text-center space-y-8">
          <h1 className="heading-display text-balance">
            Timeless elegance
            <br />
            meets modern sophistication
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the finest collection of tuxedos and formal wear from world-renowned designers. Perfect for
            weddings, galas, and life's most important moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="group">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="heading-large text-balance">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Handpicked pieces from our most prestigious designers, crafted for the discerning gentleman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[3/4] overflow-hidden bg-muted/20">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <p className="text-xl font-light">${product.price.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="group bg-transparent">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Highlights */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="heading-large text-balance">Crafted by Masters</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We partner with the world's most prestigious fashion houses to bring you unparalleled quality and style.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Armani", "Tom Ford", "Brioni", "Hugo Boss"].map((brand) => (
              <div key={brand} className="text-center">
                <div className="h-20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-light tracking-wider text-muted-foreground">{brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container text-center space-y-8">
          <h2 className="heading-large text-balance">Ready for your perfect fit?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Book a consultation with our expert stylists and discover the tuxedo that defines your style.
          </p>
          <Link href="/contact">
            <Button size="lg" className="group">
              Book Consultation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
