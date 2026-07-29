-- DEVELOPMENT ONLY. Do not run on production without explicit approval.
insert into public.news_events
  (slug, kind, title, excerpt, body, status, is_visible, is_featured, published_at)
values
  ('dev-weekly-ijazah-council', 'event', '[تجريبي] مجلس الإجازة الأسبوعي',
   'بيان تطويري لاختبار واجهة الأخبار.', 'هذا المحتوى مخصص للتطوير المحلي فقط.',
   'published', true, true, now()),
  ('dev-hadith-manuscript-reading', 'workshop', '[تجريبي] قراءة مخطوط حديثي',
   'ورشة تطويرية لاختبار الفلاتر.', 'هذا المحتوى مخصص للتطوير المحلي فقط.',
   'published', true, false, now() - interval '1 day'),
  ('dev-methods-of-critics', 'lecture', '[تجريبي] مناهج المحدثين في العلل',
   'محاضرة تطويرية لاختبار صفحة التفاصيل.', 'هذا المحتوى مخصص للتطوير المحلي فقط.',
   'draft', true, false, null)
on conflict (slug) do nothing;
