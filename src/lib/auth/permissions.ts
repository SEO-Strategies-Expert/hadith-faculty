import type { AppRole } from "@/types/cms";

export function hasRole(roles: AppRole[], role: AppRole) {
  return roles.includes(role);
}

export function hasAnyRole(roles: AppRole[], allowed: AppRole[]) {
  return allowed.some((role) => roles.includes(role));
}

export function canManageNews(roles: AppRole[]) {
  return hasAnyRole(roles, ["admin", "editor"]);
}

export function canManageUsers(roles: AppRole[]) {
  return hasRole(roles, "admin");
}

export function roleCanAccessPath(roles: AppRole[], pathname: string) {
  if (pathname.startsWith("/dashboard/admin/news") || pathname.startsWith("/dashboard/admin/media")) {
    return hasAnyRole(roles, ["admin", "editor"]);
  }
  if (pathname.startsWith("/dashboard/admin")) return hasRole(roles, "admin");
  if (pathname.startsWith("/dashboard/editor")) return hasAnyRole(roles, ["admin", "editor"]);
  if (pathname.startsWith("/dashboard/faculty")) return hasAnyRole(roles, ["admin", "faculty"]);
  if (pathname.startsWith("/dashboard/admissions")) return hasAnyRole(roles, ["admin", "admissions"]);
  if (pathname.startsWith("/dashboard/library")) return hasAnyRole(roles, ["admin", "library_editor"]);
  if (pathname.startsWith("/dashboard/student")) return hasAnyRole(roles, ["admin", "student"]);
  return pathname === "/dashboard" ? roles.length > 0 : false;
}
