import Link from "next/link";
export default function NotFound() {
  return <main className="auth-shell"><section className="auth-card"><h1>الصفحة غير موجودة</h1><p>لم نتمكن من العثور على المحتوى المطلوب، أو أنه غير منشور.</p><Link className="btn gold" href="/">العودة للرئيسية</Link></section></main>;
}
