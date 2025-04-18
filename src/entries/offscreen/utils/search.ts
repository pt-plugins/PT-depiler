import { onMessage } from "@/messages.ts";
import { getSiteInstance } from "@/shared/adapters/site.ts";

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  const site = await getSiteInstance<"public">(siteId);
  return await site.getSearchResult(keyword, searchEntry);
});
