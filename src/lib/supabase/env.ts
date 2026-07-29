const requiredPublic = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

export function hasSupabaseEnv() {
  return requiredPublic.every((name) => Boolean(process.env[name]));
}

export function publicSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase is not configured. Add the required environment variables.");
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  };
}

export function serviceRoleEnv() {
  const { url } = publicSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is unavailable on the server.");
  return { url, serviceRoleKey };
}
