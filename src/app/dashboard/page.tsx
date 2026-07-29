import { redirect } from "next/navigation";
import { currentUserWithRoles } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const { user, roles } = await currentUserWithRoles();
  if (!user) redirect("/login");
  const role = roles[0];
  redirect(role ? ROLE_HOME[role] : "/unauthorized");
}
