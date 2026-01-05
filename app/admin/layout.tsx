// import type React from "react"
// import { Navbar } from "@/components/common/navbar"
// import { Sidebar } from "@/components/common/sidebar"

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="flex h-screen bg-background">
//       <Sidebar role="admin" />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar userRole="Admin" />
//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   )
// }


import type React from "react";
import { Sidebar } from "@/components/common/sidebar";
import { Navbar } from "@/components/common/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userRole="Admin" /> {/* now client-only */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

