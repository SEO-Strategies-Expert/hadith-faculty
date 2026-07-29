import Link from "next/link";
import { NewsCard } from "@/components/news/news-card";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getPublishedNews } from "@/lib/db/news";

export const metadata = { title: "الأخبار والفعاليات", description: "أخبار كلية الحديث وعلومه وفعالياتها العلمية." };
const kinds = [["","الكل"],["news","الأخبار"],["event","الفعاليات"],["announcement","الإعلانات"],["lecture","المحاضرات"],["workshop","الورش"]] as const;

export default async function NewsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const kind = kinds.some(([value]) => value === params.kind) ? params.kind : "";
  return <>
    <section className="page-hero"><div className="container"><div className="page-hero-shell" style={{"--page-hero-image":"url('/media/heroes/news-events-hero.webp')"} as React.CSSProperties}><div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>◆</span><span>الأخبار والفعاليات</span></div><h1>الأخبار والفعاليات</h1><p className="lead">المجالس العلمية والدورات والإعلانات ومستجدات الكلية.</p></div></div></section>
    <section className="section"><div className="container">
      <nav className="research-filters" aria-label="تصفية الأخبار">{kinds.map(([value,label]) => <Link className={kind === value ? "research-filter active" : "research-filter"} key={value} href={value ? `/news?kind=${value}` : "/news"}>{label}</Link>)}</nav>
      {!hasSupabaseEnv() ? <div className="empty-state"><h2>قسم الأخبار جاهز للربط</h2><p>يلزم ربط مشروع Supabase المخصص وإضافة متغيرات البيئة لتظهر البيانات الديناميكية.</p></div> : <NewsResults page={page} kind={kind} />}
    </div></section>
  </>;
}

async function NewsResults({ page, kind }: { page: number; kind?: string }) {
  const result = await getPublishedNews(page, 9, kind || undefined);
  if (!result.data.length) return <div className="empty-state"><h2>لا توجد أخبار منشورة حاليًا</h2><p>ستظهر الأخبار هنا بعد اعتمادها ونشرها.</p></div>;
  const pages = Math.ceil(result.count / result.pageSize);
  return <><div className="grid-3 news-grid">{result.data.map((item) => <NewsCard item={item} key={item.id} />)}</div>
    {pages > 1 ? <nav className="pagination" aria-label="صفحات الأخبار">{Array.from({length:pages},(_,i)=>i+1).map((n)=><Link className={n===page?"active":""} href={`/news?page=${n}${kind?`&kind=${kind}`:""}`} key={n}>{n}</Link>)}</nav> : null}
  </>;
}
