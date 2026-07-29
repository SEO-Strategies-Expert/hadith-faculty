import { describe, expect, it } from "vitest";
import { safeStoragePath, validateImage } from "@/lib/storage/upload";
describe("upload validation", () => {
  it("accepts safe image input", () => expect(() => validateImage({type:"image/webp",size:1024})).not.toThrow());
  it("rejects executable and oversized input", () => {
    expect(() => validateImage({type:"text/html",size:100})).toThrow();
    expect(() => validateImage({type:"image/png",size:11*1024*1024})).toThrow();
  });
  it("creates owner-scoped unique paths", () => {
    const path=safeStoragePath("11111111-1111-1111-1111-111111111111","image/webp");
    expect(path).toMatch(/^11111111-1111-1111-1111-111111111111\/news\/\d{4}-\d{2}-\d{2}\/[0-9a-f-]+\.webp$/);
    expect(path).not.toContain("..");
  });
});
