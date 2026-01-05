'use client'

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider swipeDirection="right">
          {children}
          <ToastViewport />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}

