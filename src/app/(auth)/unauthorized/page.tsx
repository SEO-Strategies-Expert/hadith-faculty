import Link from "next/link";
export default function UnauthorizedPage() {
  return <main className="auth-shell"><section className="auth-card"><h1>غير مصرح بالوصول</h1><p>لا يملك حسابك الدور المطلوب لفتح هذه الصفحة.</p><Link className="btn gold" href="/dashboard">العودة إلى لوحتك</Link></section></main>;
}
