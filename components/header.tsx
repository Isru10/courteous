"use client"

import Link from "next/link"
import { User, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartSidebar } from "@/components/cart-sidebar"
import { useAppSelector } from "@/redux/hooks"
import { useState } from "react"

export function Header() {
  const { itemCount } = useAppSelector((state) => state.cart)
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex flex-col">
            <span className="text-xl font-light tracking-tight">TUXEDO</span>
            <span className="text-xs font-light tracking-widest text-muted-foreground">EMPORIUM</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/products" className="text-sm font-light hover:text-primary transition-colors">
            Collection
          </Link>
          <Link href="/about" className="text-sm font-light hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-light hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>

          <CartSidebar>
            <Button variant="ghost" size="icon" className="relative">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </CartSidebar>

          {isAuthenticated ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                Sign In
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 space-y-4">
            <Link href="/products" className="block text-sm font-light hover:text-primary transition-colors">
              Collection
            </Link>
            <Link href="/about" className="block text-sm font-light hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="block text-sm font-light hover:text-primary transition-colors">
              Contact
            </Link>
            {!isAuthenticated && (
              <Link href="/auth/signin" className="block">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
