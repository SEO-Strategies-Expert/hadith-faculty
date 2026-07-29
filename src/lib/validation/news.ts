import { z } from "zod";
import { isSafeSlug } from "./slug";

const optionalUrl = z.union([z.literal(""), z.url().refine((url) => url.startsWith("https://"), "يجب استخدام HTTPS")]).optional();

export const newsSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(1).max(160).refine(isSafeSlug, "الرابط المختصر غير صالح"),
  kind: z.enum(["news", "event", "announcement", "lecture", "workshop"]),
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().trim().max(50000).optional(),
  cover_image_path: z.string().trim().max(500).optional(),
  cover_image_alt: z.string().trim().max(180).optional(),
  category: z.string().trim().max(100).optional(),
  location: z.string().trim().max(180).optional(),
  external_url: optionalUrl,
  registration_url: optionalUrl,
  event_start_at: z.string().optional(),
  event_end_at: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_visible: z.boolean(),
  is_featured: z.boolean(),
  is_pinned: z.boolean(),
  sort_order: z.number().int().min(-10000).max(10000),
  published_at: z.string().optional()
}).refine((value) => !value.event_start_at || !value.event_end_at || new Date(value.event_end_at) >= new Date(value.event_start_at), {
  message: "نهاية الفعالية يجب أن تكون بعد بدايتها",
  path: ["event_end_at"]
});

export function newsFromFormData(formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? "");
  return newsSchema.parse({
    id: text("id") || undefined,
    title: text("title"),
    slug: text("slug"),
    kind: text("kind"),
    excerpt: text("excerpt"),
    body: text("body"),
    cover_image_path: text("cover_image_path"),
    cover_image_alt: text("cover_image_alt"),
    category: text("category"),
    location: text("location"),
    external_url: text("external_url"),
    registration_url: text("registration_url"),
    event_start_at: text("event_start_at") || undefined,
    event_end_at: text("event_end_at") || undefined,
    status: text("status"),
    is_visible: formData.get("is_visible") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_pinned: formData.get("is_pinned") === "on",
    sort_order: Number(text("sort_order") || 0),
    published_at: text("published_at") || undefined
  });
}
