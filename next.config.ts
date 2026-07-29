import type { NextConfig } from "next";

const legacyPages = [
  "about", "programs", "faculty", "publications", "courses", "library",
  "contact", "admissions", "ijazat", "takhrij-lab", "manuscripts-lab",
  "hadith-research-sites", "program-foundation", "program-takhrij",
  "program-manuscripts", "program-higher", "student-dashboard"
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: process.cwd()
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" }
    ]
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/news.html", destination: "/news", permanent: true },
      { source: "/dashboard-admin.html", destination: "/dashboard/admin", permanent: true },
      { source: "/dashboard-faculty.html", destination: "/dashboard/faculty", permanent: true },
      { source: "/dashboard-student.html", destination: "/dashboard/student", permanent: true },
      { source: "/research-sites-admin.html", destination: "/dashboard/library", permanent: true }
    ];
  },
  async rewrites() {
    return legacyPages.map((page) => ({
      source: `/${page}.html`,
      destination: `/legacy-static/${page}.html`
    }));
  }
};

export default nextConfig;
