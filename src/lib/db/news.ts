import type { NewsEvent, Paginated } from "@/types/cms";
import { createClient } from "@/lib/supabase/server";

export function isPublishedVisible(item: Pick<NewsEvent, "status" | "is_visible" | "published_at">, now = new Date()) {
  return item.status === "published" && item.is_visible &&
    (!item.published_at || new Date(item.published_at).getTime() <= now.getTime());
}

export async function getPublishedNews(page = 1, pageSize = 9, kind?: string): Promise<Paginated<NewsEvent>> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  let query = supabase
    .from("news_events")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .eq("is_visible", true)
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("is_pinned", { ascending: false })
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (kind) query = query.eq("kind", kind as never);
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as NewsEvent[], count: count ?? 0, page, pageSize };
}

export async function getPublishedNewsBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_events").select("*")
    .eq("slug", slug).eq("status", "published").eq("is_visible", true)
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .maybeSingle();
  if (error) throw error;
  return data as NewsEvent | null;
}

export async function getAdminNews(page = 1, pageSize = 20, queryText = "", status = "") {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  let query = supabase.from("news_events").select("*", { count: "exact" })
    .order("updated_at", { ascending: false }).range(from, from + pageSize - 1);
  if (queryText) query = query.ilike("title", `%${queryText.replaceAll("%", "")}%`);
  if (status) query = query.eq("status", status as never);
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as NewsEvent[], count: count ?? 0, page, pageSize };
}
