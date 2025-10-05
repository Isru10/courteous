"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAppDispatch } from "@/redux/hooks"
import { setUser, clearUser, setLoading } from "@/redux/slices/userSlice"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo = "/auth/signin",
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "loading") {
      dispatch(setLoading(true))
      return
    }

    dispatch(setLoading(false))

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

      // Check admin requirement
      if (requireAdmin && session.user.role !== "admin") {
        router.push("/")
        return
      }
    } else {
      dispatch(clearUser())

      // Check auth requirement
      if (requireAuth) {
        router.push(redirectTo)
        return
      }
    }
  }, [session, status, dispatch, router, requireAuth, requireAdmin, redirectTo])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (requireAdmin && session?.user?.role !== "admin") {
    return null
  }

  return <>{children}</>
}
