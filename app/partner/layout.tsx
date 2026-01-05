import type React from "react"
import { Navbar } from "@/components/common/navbar"
import { Sidebar } from "@/components/common/sidebar"

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="partner" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="Partner" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
