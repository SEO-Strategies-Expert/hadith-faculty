import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { serviceRoleEnv } from "./env";

export function createAdminClient() {
  const { url, serviceRoleKey } = serviceRoleEnv();
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
