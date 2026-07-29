import { DashboardShell } from "@/components/admin/dashboard-shell";
import { requireRoles } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRoles(["admin", "editor"]);
  return <DashboardShell title="لوحة الإدارة">{children}</DashboardShell>;
}
