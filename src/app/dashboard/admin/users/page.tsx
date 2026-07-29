import { requireRoles } from "@/lib/auth/session";
export default async function UsersPage() {
  await requireRoles(["admin"]);
  return <section className="dashboard-card"><h2>المستخدمون والأدوار</h2><p>الجداول والسياسات جاهزة. إنشاء أول مدير يتم بخطوة موثقة من الخادم بعد ربط Supabase.</p></section>;
}
