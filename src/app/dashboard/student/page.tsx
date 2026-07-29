import { requireRoles } from "@/lib/auth/session";
export default async function StudentPage() { await requireRoles(["admin","student"]); return <main className="role-placeholder"><h1>لوحة الطالب</h1><p>أساس محمي جاهز للمرحلة التالية.</p></main>; }
