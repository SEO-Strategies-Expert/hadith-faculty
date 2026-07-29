import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/news-form";
import { createClient } from "@/lib/supabase/server";
import { updateNews } from "../../actions";
import type { NewsEvent } from "@/types/cms";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from("news_events").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <section><div className="admin-section-head"><div><span className="section-kicker">الأخبار والفعاليات</span><h2>تعديل المحتوى</h2></div></div><NewsForm item={data as NewsEvent} action={updateNews} /></section>;
}
