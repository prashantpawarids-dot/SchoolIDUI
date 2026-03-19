"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Download,
  GraduationCap,
  Building2,
  Layers,
  BookOpen,
  Printer,
  LogOut,FileUp 
} from "lucide-react";
import { clearAuthData } from "@/lib/auth";
import Image from "next/image";
import LogoImage from "@/asset/logo2.jpeg";

interface SidebarProps {
  role: "admin" | "school" | "parent" | "partner"; // ✅ Accept role
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthData();
    router.push("/login");
  };

  const linksMap: Record<string, { href: string; label: string; icon: any }[]> =
    {
      admin: [
        { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/admin/students", label: "Manage Students", icon: Users },
        { href: "/admin/print", label: "Print ID Cards", icon: Printer },
        { href: "/admin/export",  label: "Export Data", icon: Download },
        { href: "/admin/school",   label: "School Manage and Academic Year ", icon: Building2 },
        { href: "/admin/classes", label: "Manage Classes", icon: Layers },
        { href: "/admin/import", label: "Import Student Data", icon: FileUp  },
        { href: "/register", label: "Add New User", icon: Users },
        {href:"/ChangeUserNamePass",label:"Change UserName & Pass",icon:Users}

      ],
      school: [
        { href: "/school/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/school/students", label: "Manage Students", icon: Users },
        { href: "/school/print", label: "Print ID Cards", icon: Printer },
        { href: "/school/export", label: "Export Data", icon: Download },
        { href: "/school/school", label: "School Settings", icon: Building2 },
        { href: "/school/classes", label: "Manage Classes", icon: Layers },
        { href: "/admin/import", label: "Import Student Data", icon: FileUp  },
         { href: "/register", label: "Add New User", icon: Users },
            {href:"/ChangeUserNamePass",label:"Change UserName & Pass",icon:Users}
      ],
      parent: [
        { href: "/parent/dashboard", label: "Dashboard", icon: BarChart3 },
        {
          href: "/parent/add-student",
          label: "Add Student",
          icon: GraduationCap,
        },
           {href:"/ChangeUserNamePass",label:"Change UserName & Pass",icon:Users}
      ],
      partner: [
        { href: "/partner/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/partner/students", label: "View Students", icon: BookOpen },
      ],
    };

  const roleColors: Record<string, string> = {
    admin: "from-primary to-primary/80",
    school: "from-blue-600 to-blue-500",
    parent: "from-accent to-accent/80",
    partner: "from-green-600 to-green-500",
  };

  const links = linksMap[role];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen overflow-y-auto flex flex-col">
      <div className="p-6">
        {/* <div className="w-20 h-20 flex items-center justify-center mb-3">
          <Image
            src={LogoImage}
            alt="Logo"
            width={100}
            height={100}
            className="object-contain rounded-xl border-2 border-gray-0"
          />
        </div> */}

        <div className="w-20 h-20 flex items-center justify-center mb-1">
  <Image
    src={LogoImage}
    alt="Logo"
    width={100}
    height={100}
    className="object-contain rounded-xl"
  />
</div>


        <div className="space-y-1">
          <h2 className="font-bold text-sm text-foreground">
            IDS ID PVT LTD
          </h2>
          <p className="text-xs text-muted-foreground">ID Card Management</p>
        </div>
      </div>

      <nav className="px-4 space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? `bg-linear-to-r ${roleColors[role]} text-white shadow-md`
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
