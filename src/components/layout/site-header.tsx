import Image from "next/image";
import Link from "next/link";

const menuGroups = [
  {
    label: "الكلية",
    links: [["عن الكلية", "/about.html"], ["الهيئة العلمية", "/faculty.html"], ["الأخبار والفعاليات", "/news"], ["تواصل معنا", "/contact.html"]]
  },
  {
    label: "البرامج",
    links: [["البرامج الأكاديمية", "/programs.html"], ["الدبلوم التأسيسي", "/program-foundation.html"], ["التخريج والأسانيد", "/program-takhrij.html"], ["التحقيق والمخطوطات", "/program-manuscripts.html"], ["المسار العالي", "/program-higher.html"]]
  },
  {
    label: "المعرفة الرقمية",
    links: [["مختبر التخريج", "/takhrij-lab.html"], ["مختبر التحقيق", "/manuscripts-lab.html"], ["المكتبة الرقمية", "/library.html"], ["المواقع الحديثية", "/hadith-research-sites.html"]]
  }
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="كلية الحديث وعلومه — الرئيسية">
          <Image src="/hadith-college-logo-transparent.png" width={74} height={74} alt="شعار كلية الحديث وعلومه" priority />
          <span className="brand-title"><b>كلية الحديث وعلومه</b><small>للرواية والدراية والتحقيق</small></span>
        </Link>
        <nav className="primary-nav" aria-label="القائمة الرئيسية">
          <ul className="nav-links">
            <li><Link href="/">الرئيسية</Link></li>
            {menuGroups.map((group) => (
              <li className="has-menu" key={group.label}>
                <details>
                  <summary className="nav-link-button">{group.label} <span aria-hidden>⌄</span></summary>
                  <div className="dropdown-menu compact-menu">
                    {group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                  </div>
                </details>
              </li>
            ))}
            <li><Link href="/publications.html">مجلة الكلية</Link></li>
            <li className="has-menu">
              <details>
                <summary className="nav-link-button university-trigger">
                  <Image className="accreditation-shield" src="/university-logo.png" width={28} height={28} alt="" />
                  جامعة أبو بكر إبراهيم <span aria-hidden>⌄</span>
                </summary>
                <div className="dropdown-menu university-menu-react">
                  <b>جامعة أبو بكر إبراهيم</b>
                  <small>الجهة الأكاديمية المعتمدة للكلية</small>
                  <Link href="/about.html#university-accreditation">اعتماد الكلية</Link>
                </div>
              </details>
            </li>
          </ul>
        </nav>
        <details className="mobile-nav-details">
          <summary className="menu-toggle" aria-label="فتح القائمة"><span /><span /><span /></summary>
          <nav className="mobile-primary-nav" aria-label="القائمة الرئيسية للهاتف">
            <Link href="/">الرئيسية</Link>
            <Link href="/about.html">عن الكلية</Link>
            <Link href="/programs.html">البرامج الأكاديمية</Link>
            <Link href="/news">الأخبار والفعاليات</Link>
            <Link href="/faculty.html">الهيئة العلمية</Link>
            <Link href="/publications.html">مجلة الكلية</Link>
            <Link href="/library.html">المكتبة الرقمية</Link>
          </nav>
        </details>
        <Link className="student-login" href="/dashboard/student"><span aria-hidden>🎓</span> دخول الطالب</Link>
      </div>
    </header>
  );
}
