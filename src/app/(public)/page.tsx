import Image from "next/image";
import Link from "next/link";

const programs = [
  { n: "01", title: "التخريج ودراسة الأسانيد", text: "تتبع الحديث في مصادره، وجمع طرقه، ودراسة رجاله وصياغة الحكم العلمي.", href: "/program-takhrij.html", image: "/media/isnad-research.webp" },
  { n: "02", title: "الدبلوم التأسيسي", text: "مدخل منهجي إلى مصطلح الحديث ومناهج المحدثين ومصادر السنة.", href: "/program-foundation.html", image: "/media/student-study.webp" },
  { n: "03", title: "التحقيق وعلوم المخطوطات", text: "قراءة المخطوط، وصف النسخ، المقابلة، الضبط وصناعة الحواشي.", href: "/program-manuscripts.html", image: "/media/manuscript-scholar.webp" },
  { n: "04", title: "المسار العالي", text: "تأهيل بحثي متقدم يجمع التخصصين ويقود إلى مشروع علمي أصيل.", href: "/program-higher.html", image: "/media/scientific-council.webp" }
];

export default function HomePage() {
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy reveal visible">
        <span className="eyebrow"><i />كلية تدريسية بحثية تجمع الأصالة والمنهج والتقنية</span>
        <h1>من الرواية إلى <span>التحقيق</span>… مسار علمي يصنع الباحث المتقن</h1>
        <p className="lead">كلية متخصصة في علوم الحديث تجمع البرامج الأكاديمية والمختبرات الرقمية وقاعدة المعرفة والإنتاج العلمي في منصة واحدة.</p>
        <div className="hero-points"><span>مسارات متدرجة</span><span>تعلم بالممارسة</span><span>مكتبة وقاعدة بيانات</span></div>
        <div className="button-row"><Link className="btn gold" href="/admissions.html">ابدأ طلب الالتحاق</Link><Link className="btn ghost" href="/programs.html">استكشف البرامج</Link></div>
      </div>
      <div className="hero-visual reveal visible">
        <div className="arch-stage hero-photo-stage"><Image className="hero-photo" src="/media/digital-hadith-research.webp" fill sizes="(max-width: 900px) 100vw, 50vw" alt="باحث في علوم الحديث يستخدم المصادر التراثية والأدوات الرقمية" priority /></div>
        <div className="floating-card fc-1"><b>مختبر التخريج</b><small>بحث · طرق · رواة · حكم</small></div>
        <div className="floating-card fc-2"><b>مختبر التحقيق</b><small>صور · مقابلة · حواشٍ · إخراج</small></div>
      </div>
    </div></section>
    <section className="trust-strip"><div className="container"><div className="trust-grid">
      {["تعليم متدرج","تطبيق عملي","تحقيق المخطوط","شهادات وإجازات"].map((x) => <div className="trust-item" key={x}><div className="icon-badge">◆</div><div><b>{x}</b><span>منهج علمي وتطبيق بإشراف</span></div></div>)}
    </div></div></section>
    <section className="section islamic-light-section"><div className="container">
      <div className="section-head"><div className="copy"><span className="section-kicker">المسارات الأكاديمية</span><h2>رحلة علمية واضحة، لا دورات متناثرة</h2><p className="muted">يتقدم الطالب عبر مسار تأسيسي ثم يتخصص في التخريج أو التحقيق.</p></div><Link className="btn ghost" href="/programs.html">عرض جميع البرامج</Link></div>
      <div className="bento">{programs.map((p, i) => <article className={`card reveal visible ${i === 0 ? "featured dark-card" : ""}`} key={p.n}><Image className="card-media" src={p.image} width={800} height={450} alt={p.title} /><div className="num">{p.n}</div><h3>{p.title}</h3><p className="muted">{p.text}</p><Link className="card-link" href={p.href}>تفاصيل المسار</Link></article>)}</div>
    </div></section>
    <section className="section dark islamic-dark-section"><div className="container">
      <div className="section-head"><div className="copy"><span className="section-kicker">ميزة الكلية التنافسية</span><h2>مختبران يحولان المعرفة إلى ممارسة</h2></div></div>
      <div className="lab-showcase">
        <article className="lab-card"><span className="tag">مختبر التخريج</span><h3>ابحث، اجمع الطرق، ثم علّل الحكم</h3><Image className="lab-photo" src="/media/isnad-research.webp" width={900} height={506} alt="تطبيق عملي على دراسة الإسناد" /></article>
        <article className="lab-card"><span className="tag">مختبر التحقيق</span><h3>قارن النسخ وأخرج نصًا موثقًا</h3><Image className="lab-photo" src="/media/manuscript-review.webp" width={900} height={506} alt="مقابلة نسخ مخطوطة" /></article>
      </div>
    </div></section>
    <section className="section islamic-ornament-section"><div className="container"><div className="section-head"><div className="copy"><span className="section-kicker">آخر المستجدات</span><h2>الأخبار والفعاليات</h2></div><Link className="btn ghost" href="/news">عرض الأخبار الديناميكية</Link></div></div></section>
  </>;
}
