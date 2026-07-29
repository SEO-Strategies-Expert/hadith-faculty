import Link from "next/link";
import { login, requestPasswordReset } from "./actions";

export const metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return <main className="auth-shell">
    <section className="auth-card" aria-labelledby="login-title">
      <span className="section-kicker">بوابة الكلية الآمنة</span>
      <h1 id="login-title">تسجيل الدخول</h1>
      {params.configuration || params.error === "configuration" ? <div className="notice">يلزم ربط مشروع Supabase وإضافة متغيرات البيئة قبل تسجيل الدخول.</div> : null}
      {params.error === "credentials" ? <div className="form-error">بيانات الدخول غير صحيحة.</div> : null}
      {params.message === "reset-sent" ? <div className="form-success">إذا كان البريد مسجلًا فستصلك رسالة الاستعادة.</div> : null}
      <form action={login} className="cms-form">
        <label>البريد الإلكتروني<input name="email" type="email" autoComplete="email" required /></label>
        <label>كلمة المرور<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
        <button className="btn gold" type="submit">دخول</button>
      </form>
      <details className="reset-panel"><summary>نسيت كلمة المرور؟</summary>
        <form action={requestPasswordReset} className="cms-form compact-form">
          <label>البريد الإلكتروني<input name="email" type="email" required /></label>
          <button className="btn ghost" type="submit">إرسال رابط الاستعادة</button>
        </form>
      </details>
      <Link href="/">العودة إلى الموقع</Link>
    </section>
  </main>;
}
