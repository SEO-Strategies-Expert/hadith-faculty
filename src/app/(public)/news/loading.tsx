export default function NewsLoading() {
  return <section className="section"><div className="container"><div className="loading-grid" aria-label="جاري تحميل الأخبار">{[1,2,3].map((n)=><div className="loading-card" key={n} />)}</div></div></section>;
}
