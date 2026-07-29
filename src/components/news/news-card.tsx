import Image from "next/image";
import Link from "next/link";
import type { NewsEvent } from "@/types/cms";
import { publicMediaUrl } from "@/lib/storage/public-url";

const kindLabels = { news: "خبر", event: "فعالية", announcement: "إعلان", lecture: "محاضرة", workshop: "ورشة" };

export function NewsCard({ item }: { item: NewsEvent }) {
  const image = publicMediaUrl(item.cover_image_path);
  return <article className="card news-card reveal visible">
    {image ? <Image className="news-cover" src={image} width={900} height={506} alt={item.cover_image_alt || item.title} /> : <div className="news-cover news-cover-placeholder" aria-hidden>◆</div>}
    <div className="news-body">
      <div className="news-meta"><span>{kindLabels[item.kind]}</span><span>{item.published_at ? new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(new Date(item.published_at)) : ""}</span></div>
      <h2>{item.title}</h2><p className="muted">{item.excerpt}</p>
      <Link className="card-link" href={`/news/${item.slug}`}>قراءة التفاصيل</Link>
    </div>
  </article>;
}
