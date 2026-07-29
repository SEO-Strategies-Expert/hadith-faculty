import { requireRoles } from "@/lib/auth/session";
export default async function FacultyPage() { await requireRoles(["admin","faculty"]); return <main className="role-placeholder"><h1>لوحة هيئة التدريس</h1><p>أساس محمي جاهز للمرحلة التالية.</p></main>; }
