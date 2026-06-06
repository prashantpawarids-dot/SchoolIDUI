// "use client"; 
// import type React from "react";
// import { Sidebar } from "@/components/common/sidebar";
// import { Navbar } from "@/components/common/navbar";
// import { useAuthGuard } from "@/hooks/use-auth-guard";
// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//    useAuthGuard();
//   return (
//     <div className="flex h-screen bg-background">
//       <Sidebar role="admin" />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar userRole="Admin" /> {/* now client-only */}
//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   );
// }

"use client";
import type React from "react";
import { Sidebar } from "@/components/common/sidebar";
import { Navbar } from "@/components/common/navbar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { SchoolProvider } from "@/lib/school-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useAuthGuard();
  return (
    <SchoolProvider>
      <div className="flex h-screen bg-background">
        <Sidebar role="admin" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar userRole="Admin" />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SchoolProvider>
  );
}