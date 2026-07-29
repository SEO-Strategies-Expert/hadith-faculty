import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-brand-lockup">
            <Image className="footer-logo" src="/hadith-college-logo-transparent.png" width={70} height={70} alt="شعار كلية الحديث وعلومه" />
            <div className="footer-brand-name"><b>كلية الحديث وعلومه</b><span>للرواية والدراية والتحقيق</span></div>
          </div>
          <p>بيئة علمية رقمية تجمع تعليم الحديث المتدرج، والتخريج التطبيقي، والتحقيق العلمي للمخطوطات.</p>
          <div className="socials"><a aria-label="X" href="#">X</a><a aria-label="Instagram" href="#">◎</a><a aria-label="YouTube" href="#">▶</a></div>
        </div>
        <div><h4>الكلية</h4><ul><li><Link href="/about.html">الرؤية والرسالة</Link></li><li><Link href="/faculty.html">المجلس العلمي</Link></li><li><Link href="/news">الأخبار</Link></li></ul></div>
        <div><h4>الدراسة</h4><ul><li><Link href="/programs.html">البرامج</Link></li><li><Link href="/courses.html">الدورات</Link></li><li><Link href="/admissions.html">القبول</Link></li></ul></div>
        <div><h4>المعرفة الرقمية</h4><ul><li><Link href="/takhrij-lab.html">مختبر التخريج</Link></li><li><Link href="/library.html">المكتبة</Link></li><li><Link href="/publications.html">مجلة الكلية</Link></li></ul></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 كلية الحديث وعلومه. جميع الحقوق محفوظة.</span><span>منصة تدريسية بحثية لخدمة علوم الحديث.</span></div>
    </footer>
  );
}
