import { describe, expect, it } from "vitest";
import { isSafeSlug, slugify } from "@/lib/validation/slug";
describe("slug utilities", () => {
  it("generates a stable Arabic slug", () => expect(slugify("مجلس الإجازة الأسبوعي")).toBe("مجلس-الإجازة-الأسبوعي"));
  it("rejects traversal and malformed slugs", () => {
    expect(isSafeSlug("../admin")).toBe(false);
    expect(isSafeSlug("valid-slug")).toBe(true);
  });
});
