"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Users, Download, GraduationCap, Building2, Layers, BookOpen, Printer, LogOut, FileUp, CreditCard, KeyRound, School, ChevronLeft, ChevronRight, X } from "lucide-react";
import { clearAuthData } from "@/lib/auth";
import Image from "next/image";
import LogoImage from "@/asset/logo2.jpeg";
import { useEffect, useState } from "react";

interface SidebarProps {
  role: "admin" | "school" | "parent" | "partner";
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ role, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [roleId, setRoleId] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setRoleId(Number(localStorage.getItem("roleId") || 0));
  }, []);

  const handleLogout = () => {
    clearAuthData();
    router.push("/login");
  };

  const linksMap: Record<string, { href: string; label: string; icon: any }[]> = {
    admin: [
      { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/admin/school", label: "Add Organisation", icon: Building2 },
      { href: "/admin/classes", label: "Manage Organisation", icon: Layers },
      { href: "/admin/import", label: "Import data", icon: FileUp },
      { href: "/admin/students", label: "Card Approval", icon: Users },
      { href: "/admin/print", label: "Print Cards", icon: Printer },
      { href: "/admin/export", label: "Export Data", icon: Download },
      { href: "/register", label: "Add New User", icon: Users },
      { href: "/admin/manageusernamepass", label: "User Credential", icon: KeyRound },
      { href: "/admin/assign-schools", label: "Assign Schools", icon: School },
    ],
    school: [
      { href: "/school/dashboard", label: "Dashboard", icon: BarChart3 },
       { href: "/school/import", label: "Import data", icon: FileUp },
        // { href: "/school/print", label: "Print Cards", icon: Printer },
         { href: "/school/school", label: "School Settings", icon: Building2 },
      { href: "/school/students", label: "Manage Students", icon: Users },
       { href: "/school/classes", label: "Manage Classes", icon: Layers },
     
      // { href: "/school/export", label: "Export Data", icon: Download },
     { href: "/school/manageusernamepass", label: "Manage Credentials", icon: KeyRound },
      { href: "/register", label: "Add New User", icon: Users },
    ],
    parent: [
      { href: "/parent/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/parent/add-student", label: "Add Student", icon: GraduationCap },
      { href: "/ChangeUserNamePass", label: "Change UserName & Pass", icon: Users },
    ],
    // partner: [
    //   { href: "/partner/dashboard", label: "Dashboard", icon: BarChart3 },
    //   { href: "/partner/students", label: "View Students", icon: BookOpen },
    // ],
  };

  const roleColors: Record<string, string> = {
    admin: "from-primary to-primary/80",
    school: "from-blue-600 to-blue-500",
    parent: "from-accent to-accent/80",
    partner: "from-green-600 to-green-500",
  };

  const filteredLinks = linksMap[role].filter(link => {
    if (link.href === "/admin/assign-schools" && roleId !== 5) return false;
    return true;
  });

  const renderSidebarBody = (showLabels: boolean, isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className={cn("flex items-center border-b border-border", showLabels ? "p-4 gap-3" : "p-3 justify-center")}>
        {isMobile && onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
          <Image src={LogoImage} alt="Logo" width={40} height={40} className="object-contain rounded-lg" />
        </div>
        {showLabels && (
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm text-foreground">IDS ID PVT LTD</h2>
            {/* <p className="text-xs text-muted-foreground">ID Card Management</p> */}
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className={cn("flex-1 overflow-y-auto py-3", showLabels ? "px-3 space-y-1" : "px-2 space-y-1")}>
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              title={!showLabels ? link.label : undefined}
              onClick={isMobile ? onMobileClose : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] lg:min-h-0",
                showLabels ? "gap-3 px-3 py-2.5" : "justify-center p-3",
                isActive
                  ? `bg-linear-to-r ${roleColors[role]} text-white shadow-md`
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              {showLabels && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={cn("border-t border-border", showLabels ? "p-3" : "p-2")}>
        <button
          onClick={handleLogout}
          title={!showLabels ? "Logout" : undefined}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors min-h-[44px] lg:min-h-0",
            showLabels ? "gap-3 px-3 py-2.5" : "justify-center p-3"
          )}>
          <LogOut className="w-4 h-4 shrink-0" />
          {showLabels && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        "relative bg-card border-r border-border h-screen flex-col transition-all duration-300 overflow-visible hidden lg:flex",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="absolute -right-3 top-6 z-20 w-6 h-6 bg-primary text-white rounded-full hidden lg:flex items-center justify-center shadow-lg border-2 border-white hover:bg-primary/90 transition-colors">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {renderSidebarBody(!collapsed, false)}
      </aside>

      {/* Mobile drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-card border-r border-border flex flex-col transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
      )}>
        {renderSidebarBody(true, true)}
      </aside>
    </>
  );
}
