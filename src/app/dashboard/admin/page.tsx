import Link from "next/link";
import { requireRoles } from "@/lib/auth/session";
export default async function AdminHome() {
  await requireRoles(["admin"]);
  return <section className="dashboard-grid">
    <article className="dashboard-card"><span>القسم المنفذ في المرحلة الأولى</span><h2>الأخبار والفعاليات</h2><p>إدارة المسودات والنشر والصور والترتيب.</p><Link className="btn gold" href="/dashboard/admin/news">فتح الإدارة</Link></article>
    <article className="dashboard-card"><span>حالة الربط</span><h2>Supabase مطلوب</h2><p>الكود وmigrations جاهزة، ويجب إضافة متغيرات مشروع مخصص.</p></article>
  </section>;
}
