import { NewsForm } from "@/components/admin/news-form";
import { createNews } from "../actions";
export default function NewNewsPage() {
  return <section><div className="admin-section-head"><div><span className="section-kicker">الأخبار والفعاليات</span><h2>إضافة محتوى جديد</h2></div></div><NewsForm action={createNews} /></section>;
}
