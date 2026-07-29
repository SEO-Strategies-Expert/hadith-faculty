import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "كلية الحديث وعلومه", template: "%s | كلية الحديث وعلومه" },
  description: "كلية تدريسية بحثية متخصصة في علوم الحديث والرواية والدراية والتحقيق."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
