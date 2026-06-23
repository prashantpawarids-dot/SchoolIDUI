'use client'
import type React from "react"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import "./globals.css"
import "react-image-crop/dist/ReactCrop.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider swipeDirection="right">
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}