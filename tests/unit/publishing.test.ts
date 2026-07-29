import { describe, expect, it } from "vitest";
import { isPublishedVisible } from "@/lib/db/news";
describe("public publishing filter", () => {
  const now = new Date("2026-07-29T12:00:00Z");
  it("shows current visible published content", () => expect(isPublishedVisible({status:"published",is_visible:true,published_at:null},now)).toBe(true));
  it("hides drafts, archived, invisible and future content", () => {
    expect(isPublishedVisible({status:"draft",is_visible:true,published_at:null},now)).toBe(false);
    expect(isPublishedVisible({status:"archived",is_visible:true,published_at:null},now)).toBe(false);
    expect(isPublishedVisible({status:"published",is_visible:false,published_at:null},now)).toBe(false);
    expect(isPublishedVisible({status:"published",is_visible:true,published_at:"2026-07-30T00:00:00Z"},now)).toBe(false);
  });
});
