export const APP_ROLES = [
  "admin",
  "editor",
  "faculty",
  "admissions",
  "library_editor",
  "student"
] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type ContentStatus = "draft" | "published" | "archived";
export type NewsKind = "news" | "event" | "announcement" | "lecture" | "workshop";

export interface NewsEvent {
  id: string;
  slug: string;
  kind: NewsKind;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  category: string | null;
  location: string | null;
  external_url: string | null;
  event_start_at: string | null;
  event_end_at: string | null;
  registration_url: string | null;
  status: ContentStatus;
  is_visible: boolean;
  is_featured: boolean;
  is_pinned: boolean;
  sort_order: number;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
