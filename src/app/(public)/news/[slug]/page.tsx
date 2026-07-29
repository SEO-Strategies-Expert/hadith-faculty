import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedNews, getPublishedNewsBySlug } from "@/lib/db/news";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { publicMediaUrl } from "@/lib/storage/public-url";
import { NewsCard } from "@/components/news/news-card";
import { isSafeSlug } from "@/lib/validation/slug";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!hasSupabaseEnv() || !isSafeSlug(slug)) return { title: "الخبر غير موجود" };
  const item = await getPublishedNewsBySlug(slug);
  if (!item) return { title: "الخبر غير موجود" };
  const image = publicMediaUrl(item.cover_image_path);
  return { title: item.title, description: item.excerpt, openGraph: { title: item.title, description: item.excerpt ?? undefined, images: image ? [image] : [] } };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabaseEnv() || !isSafeSlug(slug)) notFound();
  const item = await getPublishedNewsBySlug(slug);
  if (!item) notFound();
  const image = publicMediaUrl(item.cover_image_path);
  const related = (await getPublishedNews(1, 4, item.kind)).data.filter((x)=>x.id!==item.id).slice(0,3);
  return <>
    <section className="page-hero"><div className="container"><div className="page-hero-shell"><div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>◆</span><Link href="/news">الأخبار</Link></div><h1>{item.title}</h1><p className="lead">{item.excerpt}</p></div></div></section>
    <article className="section"><div className="container article-shell">
      {image ? <Image className="article-cover" src={image} width={1400} height={788} alt={item.cover_image_alt || item.title} priority /> : null}
      <div className="article-meta"><span>{item.kind}</span>{item.published_at ? <time dateTime={item.published_at}>{new Intl.DateTimeFormat("ar",{dateStyle:"long"}).format(new Date(item.published_at))}</time> : null}{item.location ? <span>{item.location}</span> : null}</div>
      <div className="article-body">{(item.body ?? "").split(/\n{2,}/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>
      {item.registration_url ? <a className="btn gold" href={item.registration_url} rel="noopener noreferrer">التسجيل في الفعالية</a> : null}
    </div></article>
    {related.length ? <section className="section compact"><div className="container"><div className="section-head"><div className="copy"><h2>أخبار مشابهة</h2></div></div><div className="grid-3">{related.map((x)=><NewsCard item={x} key={x.id} />)}</div></div></section> : null}
  </>;
}
