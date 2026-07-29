import type { AppRole } from "@/types/cms";

export const ROLE_HOME: Record<AppRole, string> = {
  admin: "/dashboard/admin",
  editor: "/dashboard/editor",
  faculty: "/dashboard/faculty",
  admissions: "/dashboard/admissions",
  library_editor: "/dashboard/library",
  student: "/dashboard/student"
};

export const CONTENT_ROLES: AppRole[] = ["admin", "editor"];
export const MEDIA_ROLES: AppRole[] = ["admin", "editor", "library_editor"];
