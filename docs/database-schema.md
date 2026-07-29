# مخطط قاعدة البيانات

Migration الرئيسية: `supabase/migrations/202607290001_cms_foundation.sql`.

الجداول: `profiles`, `user_roles`, `pages`, `site_settings`, `news_events`, `programs`, `courses`, `faculty_members`, `scientific_council_members`, `publications`, `journal_issues`, `research_papers`, `ijazat`, `library_resources`, `research_sites`, `admission_applications`, `fee_options`, `live_sessions`, `social_links`, `media_assets`, `university_accreditation`, `audit_logs`.

الأنواع: `app_role`, `content_status`, `news_kind`.

كل المحتوى العام يستخدم `status`, `is_visible`, `published_at`, وترتيبًا واضحًا. مفاتيح `created_by` و`updated_by` تستخدم `ON DELETE SET NULL` حتى لا يُحذف المحتوى عند حذف المستخدم. توجد فهارس للنشر والترتيب وقيود للـslug والروابط.

`news_events` هو الـVertical Slice الكامل في Phase 1. قاعدة الظهور:

```text
status = published
AND is_visible = true
AND (published_at IS NULL OR published_at <= now())
ORDER BY is_pinned DESC, is_featured DESC, published_at DESC
```
