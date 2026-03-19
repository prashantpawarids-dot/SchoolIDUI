"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROLE_DASHBOARD: Record<number, string> = {
  1: "/admin/dashboard",
  2: "/parent/dashboard",
  3: "/partner/dashboard",
  4: "/school/dashboard",
};

const ROUTE_ROLE: Record<string, number> = {
  "/admin": 1,
  "/school": 4,
  "/parent": 2,
  "/partner": 3,
};

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (!stored) { router.replace("/login"); return; }

    let user: { roleId: number } | null = null;
    try { user = JSON.parse(stored); } catch { router.replace("/login"); return; }

    if (!user?.roleId) { router.replace("/login"); return; }

    const pathname = window.location.pathname;
    for (const [prefix, roleId] of Object.entries(ROUTE_ROLE)) {
      if (pathname.startsWith(prefix) && user.roleId !== roleId) {
        router.replace(ROLE_DASHBOARD[user.roleId] ?? "/login");
        return;
      }
    }
  }, [router]);
}