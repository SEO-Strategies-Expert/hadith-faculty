# سياسة التخزين

## public-media

- قراءة عامة.
- رفع: `admin`, `editor`, `library_editor`.
- المسار يبدأ بمعرّف المستخدم.
- الصور: JPEG/PNG/WebP/AVIF حتى 10MB؛ PDF مسموح للموارد العلمية وفق الـBucket.
- Metadata تحفظ في `media_assets`.

## private-admission-documents

- Bucket خاص حتى 25MB.
- المستخدم المصادق يرفع داخل مجلده فقط.
- القراءة للإدارة و`admissions`.
- العرض يكون عبر Signed URLs قصيرة العمر بعد التحقق من الصلاحية.

الأسماء تولّد UUID ولا تعتمد على الاسم الأصلي. يمنع `..` وPath Traversal. التحسين إلى WebP/thumbnail يمكن إضافته بخدمة معالجة صور في المرحلة التالية.
