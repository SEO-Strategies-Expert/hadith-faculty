import type { AppRole, ContentStatus, NewsKind } from "./cms";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; full_name: string | null; display_name: string | null;
          email: string | null; avatar_path: string | null; phone: string | null;
          is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      user_roles: {
        Row: { id: string; user_id: string; role: AppRole; created_at: string; created_by: string | null };
        Insert: { id?: string; user_id: string; role: AppRole; created_at?: string; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>;
        Relationships: [];
      };
      news_events: {
        Row: {
          id: string; slug: string; kind: NewsKind; title: string; excerpt: string | null;
          body: string | null; cover_image_path: string | null; cover_image_alt: string | null;
          category: string | null; location: string | null; external_url: string | null;
          event_start_at: string | null; event_end_at: string | null; registration_url: string | null;
          status: ContentStatus; is_visible: boolean; is_featured: boolean; is_pinned: boolean;
          sort_order: number; published_at: string | null; created_by: string | null;
          updated_by: string | null; created_at: string; updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["news_events"]["Row"]> & {
          slug: string; kind: NewsKind; title: string;
        };
        Update: Partial<Database["public"]["Tables"]["news_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: { Args: { requested_role: AppRole }; Returns: boolean };
      has_any_role: { Args: { requested_roles: AppRole[] }; Returns: boolean };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      current_profile_id: { Args: Record<PropertyKey, never>; Returns: string | null };
    };
    Enums: { app_role: AppRole; content_status: ContentStatus; news_kind: NewsKind };
    CompositeTypes: Record<string, never>;
  };
}
