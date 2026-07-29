import Link from "next/link";
import { getAdminNews } from "@/lib/db/news";
import { deleteNews } from "./actions";

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const result = await getAdminNews(page, 20, params.q ?? "", params.status ?? "");
  return <section>
    <div className="admin-section-head"><div><span className="section-kicker">إدارة المحتوى</span><h2>الأخبار والفعاليات</h2></div><Link className="btn gold" href="/dashboard/admin/news/new">إضافة خبر</Link></div>
    <form className="admin-filters">
      <input name="q" placeholder="بحث بالعنوان" defaultValue={params.q} />
      <select name="status" defaultValue={params.status}><option value="">كل الحالات</option><option value="draft">مسودة</option><option value="published">منشور</option><option value="archived">مؤرشف</option></select>
      <button className="btn ghost">تصفية</button>
    </form>
    {result.data.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>العنوان</th><th>النوع</th><th>الحالة</th><th>النشر</th><th>الإجراءات</th></tr></thead><tbody>
      {result.data.map((item) => <tr key={item.id}><td><b>{item.title}</b><small>{item.slug}</small></td><td>{item.kind}</td><td><span className={`cms-status ${item.status}`}>{item.status}</span></td><td>{item.published_at ? new Intl.DateTimeFormat("ar").format(new Date(item.published_at)) : "—"}</td><td><div className="row-actions"><Link href={`/dashboard/admin/news/${item.id}/edit`}>تعديل</Link><form action={deleteNews}><input type="hidden" name="id" value={item.id} /><button className="danger-link" type="submit">حذف</button></form></div></td></tr>)}
    </tbody></table></div> : <div className="empty-state"><h3>لا يوجد محتوى</h3><p>أضف أول خبر أو فعالية.</p></div>}
    <p className="pagination-summary">الإجمالي: {result.count} — الصفحة {result.page}</p>
  </section>;
}
