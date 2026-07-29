"use client";

import { useMemo, useState } from "react";
import type { NewsEvent } from "@/types/cms";
import { slugify } from "@/lib/validation/slug";

export function NewsForm({ item, action }: { item?: NewsEvent; action: (data: FormData) => void | Promise<void> }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const generated = useMemo(() => slugify(title), [title]);

  return <form action={action} className="cms-form news-editor-form">
    {item ? <input type="hidden" name="id" value={item.id} /> : null}
    <div className="form-grid">
      <label className="full-row">العنوان<input name="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!item) setSlug(slugify(e.target.value)); }} minLength={3} maxLength={180} required /></label>
      <label>الرابط المختصر<input name="slug" value={slug || generated} onChange={(e) => setSlug(e.target.value)} required /></label>
      <label>النوع<select name="kind" defaultValue={item?.kind ?? "news"}><option value="news">خبر</option><option value="event">فعالية</option><option value="announcement">إعلان</option><option value="lecture">محاضرة</option><option value="workshop">ورشة</option></select></label>
      <label className="full-row">المقتطف<textarea name="excerpt" maxLength={500} defaultValue={item?.excerpt ?? ""} rows={3} /></label>
      <label className="full-row">المحتوى<textarea name="body" maxLength={50000} defaultValue={item?.body ?? ""} rows={12} /></label>
      <label>التصنيف<input name="category" defaultValue={item?.category ?? ""} /></label>
      <label>الموقع<input name="location" defaultValue={item?.location ?? ""} /></label>
      <label>رابط خارجي<input name="external_url" type="url" defaultValue={item?.external_url ?? ""} /></label>
      <label>رابط التسجيل<input name="registration_url" type="url" defaultValue={item?.registration_url ?? ""} /></label>
      <label>بداية الفعالية<input name="event_start_at" type="datetime-local" defaultValue={item?.event_start_at?.slice(0,16) ?? ""} /></label>
      <label>نهاية الفعالية<input name="event_end_at" type="datetime-local" defaultValue={item?.event_end_at?.slice(0,16) ?? ""} /></label>
      <label>صورة الغلاف<input name="cover_image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { const file=e.target.files?.[0]; setPreview(file ? URL.createObjectURL(file) : null); }} /></label>
      <label>النص البديل للصورة<input name="cover_image_alt" defaultValue={item?.cover_image_alt ?? ""} /></label>
      <input type="hidden" name="cover_image_path" value={item?.cover_image_path ?? ""} />
      {/* Blob previews are local-only and intentionally bypass Next image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {preview ? <img className="upload-preview full-row" src={preview} alt="معاينة الصورة الجديدة" /> : null}
      <label>الحالة<select name="status" defaultValue={item?.status ?? "draft"}><option value="draft">مسودة</option><option value="published">منشور</option><option value="archived">مؤرشف</option></select></label>
      <label>تاريخ النشر<input name="published_at" type="datetime-local" defaultValue={item?.published_at?.slice(0,16) ?? ""} /></label>
      <label>الترتيب<input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} /></label>
      <div className="check-group"><label><input name="is_visible" type="checkbox" defaultChecked={item?.is_visible ?? true} /> ظاهر</label><label><input name="is_featured" type="checkbox" defaultChecked={item?.is_featured ?? false} /> مميز</label><label><input name="is_pinned" type="checkbox" defaultChecked={item?.is_pinned ?? false} /> مثبت</label></div>
    </div>
    <div className="editor-actions"><button className="btn gold" type="submit">حفظ</button><a className="btn ghost" href={item?.slug ? `/news/${item.slug}` : "/news"} target="_blank">معاينة</a></div>
  </form>;
}
