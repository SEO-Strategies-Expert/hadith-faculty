import { describe, expect, it } from "vitest";
import { canManageNews, canManageUsers, roleCanAccessPath } from "@/lib/auth/permissions";
describe("role permissions", () => {
  it("allows editors to manage news but not users", () => {
    expect(canManageNews(["editor"])).toBe(true);
    expect(canManageUsers(["editor"])).toBe(false);
  });
  it("keeps students out of administration", () => expect(roleCanAccessPath(["student"], "/dashboard/admin")).toBe(false));
  it("allows only the matching role area", () => expect(roleCanAccessPath(["admissions"], "/dashboard/admissions")).toBe(true));
});
