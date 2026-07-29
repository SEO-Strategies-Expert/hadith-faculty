import { updatePassword } from "./actions";
export default function UpdatePasswordPage() {
  return <main className="auth-shell"><section className="auth-card"><h1>تحديث كلمة المرور</h1><form action={updatePassword} className="cms-form"><label>كلمة المرور الجديدة<input name="password" type="password" minLength={12} required /></label><button className="btn gold">حفظ كلمة المرور</button></form></section></main>;
}
