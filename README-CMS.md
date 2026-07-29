# Hadith Faculty CMS — Phase 1

أساس CMS مبني بـNext.js App Router وTypeScript وSupabase. النسخة الثابتة المرجعية محفوظة في `legacy-static/`.

## التشغيل

1. ثبّت Node.js 22+ ثم نفّذ `npm install`.
2. انسخ `.env.example` إلى `.env.local` واملأ قيم مشروع Supabase **المخصص لهذا المستودع**.
3. طبّق migrations على بيئة تطوير: `supabase db reset` أو `supabase migration up`.
4. شغّل `npm run dev`.

لا تضع الأسرار في Git، ولا تستخدم Service Role داخل Client Components.

## متغيرات البيئة

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — خادم فقط.
- `SUPABASE_DB_URL` — migrations/CI فقط.
- `NEXT_PUBLIC_SITE_URL`

## Seed

`supabase/seed.sql` للتطوير المحلي فقط. لا تشغله على Production دون موافقة.

## إنشاء أول Admin

1. أنشئ المستخدم من Supabase Auth Dashboard أو بأداة خادم موثوقة.
2. تأكد من إنشاء صف `profiles`.
3. من SQL Editor الموثوق أضف الدور `admin` إلى `user_roles`.
4. لا تنشئ endpoint عامًا لترقية الأدوار، ولا تستخدم Service Role في المتصفح.

## Vercel

اربط Preview branch بمشروع Supabase غير إنتاجي، وأضف المتغيرات من Vercel Project Settings. لا تُضف القيم إلى المستودع.

## الفحوص

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

اختبارات RLS موجودة في `supabase/tests/rls.sql` وتُشغّل على قاعدة محلية/مؤقتة بعد migrations.

## Rollback

- الواجهة الثابتة محفوظة بالـTag `static-ui-v1`.
- يمكن الرجوع إلى commit `0f5e66f5290f9c7036e78679054846d0ba22da2a`.
- لا تدمج الفرع قبل نجاح Preview وRLS وE2E بدورة Supabase كاملة.

## حالة Phase 1

الكود والمخططات جاهزة. لا يُعد الربط مكتملًا حتى تُضاف Credentials معتمدة وتنجح دورة:
لوحة الإدارة → Database/Storage → `/news` → صفحة الخبر.
