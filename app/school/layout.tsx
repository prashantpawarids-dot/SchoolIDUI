"use client";
import type React from "react";
import { Sidebar } from "@/components/common/sidebar";
import { Navbar } from "@/components/common/navbar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useAuthGuard();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="school" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="School" /> 
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

