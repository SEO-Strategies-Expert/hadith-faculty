import Link from "next/link";

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  return <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <Link className="dashboard-brand" href="/"><b>كلية الحديث وعلومه</b><small>نظام إدارة المحتوى</small></Link>
      <nav>
        <Link href="/dashboard/admin">الرئيسية</Link>
        <Link href="/dashboard/admin/news">الأخبار والفعاليات</Link>
        <Link href="/dashboard/admin/media">مكتبة الوسائط</Link>
        <Link href="/dashboard/admin/users">المستخدمون والأدوار</Link>
      </nav>
      <form action="/auth/signout" method="post"><button className="btn ghost" type="submit">تسجيل الخروج</button></form>
    </aside>
    <main className="dashboard-main"><header className="dashboard-topbar"><h1>{title}</h1><Link href="/news">معاينة الموقع ↗</Link></header>{children}</main>
  </div>;
}
