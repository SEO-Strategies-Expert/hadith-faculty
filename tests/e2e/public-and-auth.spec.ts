import { expect, test } from "@playwright/test";
test("dashboard without Supabase configuration redirects to login", async ({ page }) => {
  await page.goto("/dashboard/admin");
  await expect(page).toHaveURL(/\/login\?configuration=required/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
});
test("public home and news routes render in RTL", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: /من الرواية/ })).toBeVisible();
  await page.goto("/news");
  await expect(page.getByRole("heading", { name: "الأخبار والفعاليات" })).toBeVisible();
});
test("legacy news URL redirects", async ({ page }) => {
  await page.goto("/news.html");
  await expect(page).toHaveURL(/\/news$/);
});
test("legacy public routes remain available and old admin is protected", async ({ request }) => {
  for (const route of ["/about.html","/programs.html","/faculty.html","/publications.html","/courses.html","/library.html"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
  }
  const oldAdmin = await request.get("/dashboard-admin.html", { maxRedirects: 0 });
  expect([307,308]).toContain(oldAdmin.status());
});
test("mobile navigation remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-nav-details > summary").click();
  await expect(page.locator(".mobile-nav-details")).toHaveAttribute("open", "");
  await expect(page.getByRole("navigation", { name: "القائمة الرئيسية للهاتف" }).getByRole("link", { name: "مجلة الكلية" })).toBeVisible();
});
