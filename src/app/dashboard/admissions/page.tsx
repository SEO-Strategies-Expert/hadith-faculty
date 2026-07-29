import { requireRoles } from "@/lib/auth/session";
export default async function AdmissionsPage() { await requireRoles(["admin","admissions"]); return <main className="role-placeholder"><h1>لوحة القبول</h1><p>أساس محمي جاهز للمرحلة التالية.</p></main>; }
