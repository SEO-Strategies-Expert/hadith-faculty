import { requireRoles } from "@/lib/auth/session";
import Link from "next/link";
export default async function EditorPage() {
  await requireRoles(["admin", "editor"]);
  return <main className="role-placeholder"><h1>لوحة المحرر</h1><Link href="/dashboard/admin/news">إدارة الأخبار</Link></main>;
}
