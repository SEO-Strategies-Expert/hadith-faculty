import { requireRoles } from "@/lib/auth/session";
export default async function MediaPage() {
  await requireRoles(["admin","editor"]);
  return <section className="dashboard-card"><h2>مكتبة الوسائط</h2><p>يتم تسجيل صور الأخبار المرفوعة في <code>media_assets</code>. واجهة الإدارة الشاملة مؤجلة للمرحلة التالية.</p></section>;
}
