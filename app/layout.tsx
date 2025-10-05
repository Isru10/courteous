import type React from "react"

import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/components/redux-provider"
import { NextAuthProvider } from "@/components/session-provider"
import { Suspense } from "react"
import "./globals.css"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tuxedo Emporium - Premium Formal Wear",
  description: "Discover the finest collection of tuxedos and formal wear from world-renowned designers",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <NextAuthProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </NextAuthProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
