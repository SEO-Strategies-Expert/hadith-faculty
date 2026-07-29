"use client";
export default function NewsError({ reset }: { reset: () => void }) {
  return <section className="section"><div className="container empty-state"><h2>تعذر تحميل الأخبار</h2><p>حدث خطأ مؤقت أثناء الاتصال بمصدر البيانات.</p><button className="btn gold" onClick={reset}>إعادة المحاولة</button></div></section>;
}
