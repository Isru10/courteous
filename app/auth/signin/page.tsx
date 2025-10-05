"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch } from "@/redux/hooks"
import { setUser, setLoading } from "@/redux/slices/userSlice"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const redirectUrl = searchParams.get("redirect") || "/"

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name!,
            role: session.user.role as "customer" | "admin",
            avatarUrl: session.user.avatarUrl,
          }),
        )
        router.push(redirectUrl)
      }
    })
  }, [dispatch, router, redirectUrl])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    dispatch(setLoading(true))

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Get the session to update Redux state
        const session = await getSession()
        if (session?.user) {
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.name!,
              role: session.user.role as "customer" | "admin",
              avatarUrl: session.user.avatarUrl,
            }),
          )
          router.push(redirectUrl)
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-light">Welcome Back</CardTitle>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                  Forgot your password?
                </Link>
              </div>

              <Separator />

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Don't have an account?</p>
                <Link href={`/auth/signup${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
