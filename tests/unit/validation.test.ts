import { describe, expect, it } from "vitest";
import { newsSchema } from "@/lib/validation/news";
describe("news validation", () => {
  it("accepts a valid draft", () => expect(newsSchema.safeParse({title:"خبر صحيح",slug:"valid-news",kind:"news",status:"draft",is_visible:true,is_featured:false,is_pinned:false,sort_order:0}).success).toBe(true));
  it("rejects an insecure URL", () => expect(newsSchema.safeParse({title:"خبر صحيح",slug:"valid-news",kind:"news",external_url:"http://example.com",status:"draft",is_visible:true,is_featured:false,is_pinned:false,sort_order:0}).success).toBe(false));
});
