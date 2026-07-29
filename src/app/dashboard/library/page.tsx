import { requireRoles } from "@/lib/auth/session";
export default async function LibraryPage() { await requireRoles(["admin","library_editor"]); return <main className="role-placeholder"><h1>لوحة المكتبة والبحث</h1><p>أساس محمي جاهز للمرحلة التالية.</p></main>; }
