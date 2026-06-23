'use client';
import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/common/navbar"
import { Sidebar } from "@/components/common/sidebar"
import { useAuthGuard } from "@/hooks/use-auth-guard";
export default function ParentLayout({

  children,
}: {
  children: React.ReactNode
}) {
  useAuthGuard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="parent" mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar userRole="Parent" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 md:p-6">{children}</main>
      </div>
    </div>
  )
}
