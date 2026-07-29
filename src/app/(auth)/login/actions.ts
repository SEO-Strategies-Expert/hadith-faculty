"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { ROLE_HOME } from "@/lib/auth/roles";
import type { AppRole } from "@/types/cms";

export async function login(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/login?error=configuration");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 8) redirect("/login?error=credentials");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect("/login?error=credentials");
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
  const role = roles?.[0]?.role as AppRole | undefined;
  redirect(role ? ROLE_HOME[role] : "/unauthorized");
}

export async function requestPasswordReset(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/login?error=configuration");
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/update-password` });
  redirect("/login?message=reset-sent");
}
