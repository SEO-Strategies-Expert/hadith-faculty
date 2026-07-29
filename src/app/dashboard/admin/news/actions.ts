"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRoles } from "@/lib/auth/session";
import { newsFromFormData } from "@/lib/validation/news";
import { safeStoragePath, validateImage } from "@/lib/storage/upload";

async function uploadCover(formData: FormData, userId: string) {
  const file = formData.get("cover_image");
  if (!(file instanceof File) || file.size === 0) return null;
  validateImage(file);
  const supabase = await createClient();
  const path = safeStoragePath(userId, file.type);
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage.from("public-media").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
    cacheControl: "31536000"
  });
  if (error) throw error;
  const { error: mediaError } = await supabase.from("media_assets").insert({
    bucket_id: "public-media",
    storage_path: path,
    original_name: file.name.slice(0, 255),
    alt_text: String(formData.get("cover_image_alt") ?? "").slice(0, 180),
    mime_type: file.type,
    size_bytes: file.size,
    owner_id: userId
  } as never);
  if (mediaError) {
    await supabase.storage.from("public-media").remove([path]);
    throw mediaError;
  }
  return path;
}

function nullable(value?: string) {
  return value?.trim() ? value.trim() : null;
}

export async function createNews(formData: FormData) {
  const { user } = await requireRoles(["admin", "editor"]);
  const input = newsFromFormData(formData);
  const cover = await uploadCover(formData, user.id);
  const supabase = await createClient();
  const payload = {
    ...input,
    id: undefined,
    excerpt: nullable(input.excerpt),
    body: nullable(input.body),
    cover_image_path: cover ?? nullable(input.cover_image_path),
    cover_image_alt: nullable(input.cover_image_alt),
    category: nullable(input.category),
    location: nullable(input.location),
    external_url: nullable(input.external_url),
    registration_url: nullable(input.registration_url),
    event_start_at: nullable(input.event_start_at),
    event_end_at: nullable(input.event_end_at),
    published_at: input.status === "published" ? (nullable(input.published_at) ?? new Date().toISOString()) : nullable(input.published_at),
    created_by: user.id,
    updated_by: user.id
  };
  const { data, error } = await supabase.from("news_events").insert(payload as never).select("id").single();
  if (error) throw error;
  await supabase.from("audit_logs").insert({
    actor_id: user.id, action: input.status === "published" ? "publish" : "create",
    entity_type: "news_events", entity_id: data.id, new_data: payload
  } as never);
  revalidatePath("/news");
  redirect("/dashboard/admin/news?created=1");
}

export async function updateNews(formData: FormData) {
  const { user } = await requireRoles(["admin", "editor"]);
  const input = newsFromFormData(formData);
  if (!input.id) throw new Error("معرّف الخبر مطلوب.");
  const supabase = await createClient();
  const { data: previous, error: readError } = await supabase.from("news_events").select("*").eq("id", input.id).single();
  if (readError) throw readError;
  const cover = await uploadCover(formData, user.id);
  const payload = {
    ...input,
    id: undefined,
    excerpt: nullable(input.excerpt), body: nullable(input.body),
    cover_image_path: cover ?? nullable(input.cover_image_path),
    cover_image_alt: nullable(input.cover_image_alt), category: nullable(input.category),
    location: nullable(input.location), external_url: nullable(input.external_url),
    registration_url: nullable(input.registration_url),
    event_start_at: nullable(input.event_start_at), event_end_at: nullable(input.event_end_at),
    published_at: input.status === "published" ? (nullable(input.published_at) ?? new Date().toISOString()) : nullable(input.published_at),
    updated_by: user.id
  };
  const { error } = await supabase.from("news_events").update(payload as never).eq("id", input.id);
  if (error) throw error;
  const action = input.status === "archived" ? "archive" : previous.status !== "published" && input.status === "published" ? "publish" : "update";
  await supabase.from("audit_logs").insert({
    actor_id: user.id, action, entity_type: "news_events", entity_id: input.id,
    previous_data: previous, new_data: payload
  } as never);
  revalidatePath("/news"); revalidatePath(`/news/${input.slug}`);
  redirect("/dashboard/admin/news?updated=1");
}

export async function deleteNews(formData: FormData) {
  const { user } = await requireRoles(["admin", "editor"]);
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("معرّف غير صالح.");
  const supabase = await createClient();
  const { data: previous, error: readError } = await supabase.from("news_events").select("*").eq("id", id).single();
  if (readError) throw readError;
  const { error } = await supabase.from("news_events").delete().eq("id", id);
  if (error) throw error;
  await supabase.from("audit_logs").insert({
    actor_id: user.id, action: "delete", entity_type: "news_events", entity_id: id, previous_data: previous
  } as never);
  revalidatePath("/news");
}
