// // Auth utilities
// import { ROLES, type RoleId, type User } from "./types"

// export function getRoleFromId(roleId: RoleId): string {
//   switch (roleId) {
//     case ROLES.ADMIN:
//       return "admin"
//     case ROLES.PARENT:
//       return "parent"
//     case ROLES.PARTNER:
//       return "partner"
//     default:
//       return "parent"
//   }
// }

// export function getRoleIdFromName(roleName: string): RoleId {
//   switch (roleName.toLowerCase()) {
//     case "admin":
//       return ROLES.ADMIN
//     case "parent":
//       return ROLES.PARENT
//     case "partner":
//       return ROLES.PARTNER
//     default:
//       return ROLES.PARENT
//   }
// }

// export function getRedirectPath(roleId: RoleId): string {
//   switch (roleId) {
//     case ROLES.ADMIN:
//       return "/admin/dashboard"
//     case ROLES.PARENT:
//       return "/parent/dashboard"
//     case ROLES.PARTNER:
//       return "/partner/dashboard"
//     default:
//       return "/login"
//   }
// }

// export function saveAuthData(user: User, token: string): void {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("authToken", token)
//     localStorage.setItem("user", JSON.stringify(user))
//   }
// }

// export function getAuthData(): { user: User | null; token: string | null } {
//   if (typeof window === "undefined") {
//     return { user: null, token: null }
//   }
//   const token = localStorage.getItem("authToken")
//   const userStr = localStorage.getItem("user")
//   const user = userStr ? JSON.parse(userStr) : null
//   return { user, token }
// }

// export function clearAuthData(): void {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("authToken")
//     localStorage.removeItem("user")
//   }
// }

// export function isAuthenticated(): boolean {
//   const { token } = getAuthData()
//   return !!token
// }

// Auth utilities
import { ROLES, type RoleId, type User } from "./types";

export function getRoleFromId(roleId: RoleId): string {
  switch (roleId) {
    case ROLES.ADMIN:
      return "admin";
    case ROLES.SCHOOL: // ✅ ADDED
      return "school";
    case ROLES.PARENT:
      return "parent";
    case ROLES.PARTNER:
      return "partner";
    default:
      return "parent";
  }
}

export function getRoleIdFromName(roleName: string): RoleId {
  switch (roleName.toLowerCase()) {
    case "admin":
      return ROLES.ADMIN;
    case "school": // ✅ ADDED
      return ROLES.SCHOOL;
    case "parent":
      return ROLES.PARENT;
    case "partner":
      return ROLES.PARTNER;
    default:
      return ROLES.PARENT;
  }
}

export function getRedirectPath(roleId: RoleId): string {
  switch (roleId) {
    case ROLES.ADMIN:
      return "/admin/dashboard";
    case ROLES.SCHOOL: // ✅ ADDED
      return "/school/dashboard";
    case ROLES.PARENT:
      return "/parent/dashboard";
    case ROLES.PARTNER:
      return "/partner/dashboard";
    default:
      return "/login";
  }
}

export function saveAuthData(user: User, token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getAuthData(): { user: User | null; token: string | null } {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return { user, token };
}

export function clearAuthData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

export function isAuthenticated(): boolean {
  const { token } = getAuthData();
  return !!token;
}
