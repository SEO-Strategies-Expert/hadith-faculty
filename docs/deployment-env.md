# بيئات النشر

## Local

استخدم Supabase CLI وقاعدة محلية. يجوز تشغيل `seed.sql`.

## Preview

استخدم مشروع Supabase مخصصًا للـPreview وليس Production. أضف المتغيرات إلى Vercel Environment Variables للـPreview فقط، ثم نفّذ migrations من CI موثوق أو Supabase CLI.

## Production

لا تنشر هذا الفرع إلى Production قبل:

1. مراجعة migrations وRLS.
2. نجاح اختبارات RLS بأدوار حقيقية.
3. نجاح E2E الكامل مع Admin وStorage.
4. أخذ نسخة احتياطية وخطة rollback.
5. موافقة صريحة على migrations والنشر.

لا تُسجّل مفاتيح Supabase أو كلمات المرور في Logs. يجب تدوير أي مفتاح يُكشف عرضًا.
