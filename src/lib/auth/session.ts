import { redirect } from "next/navigation";
import type { AppRole } from "@/types/cms";
import { createClient } from "@/lib/supabase/server";
import { hasAnyRole } from "./permissions";

export async function currentUserWithRoles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, roles: [] as AppRole[] };
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  return { user, roles: (data ?? []).map((row) => row.role as AppRole) };
}

export async function requireRoles(allowed: AppRole[]) {
  const session = await currentUserWithRoles();
  if (!session.user) redirect("/login");
  if (!hasAnyRole(session.roles, allowed)) redirect("/unauthorized");
  return session;
}
