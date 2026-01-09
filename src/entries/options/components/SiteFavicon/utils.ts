import { ref } from "vue";
import { type TSiteID } from "@ptd/site";
import { sendMessage } from "@/messages.ts";

/**
 * 构造一个前端的 favicon 缓存，以避免过多的调用 sendMessage("getSiteFavicon") 方法
 */
const siteFaviconCache = ref<Record<TSiteID, string>>({});

export async function getSiteFavicon(siteId: TSiteID, flush: boolean = false) {
  let siteFavicon = siteFaviconCache.value[siteId];
  if (!siteFavicon || flush) {
    siteFavicon = await sendMessage("getSiteFavicon", { site: siteId, flush });
    siteFaviconCache.value[siteId] = siteFavicon;
  }

  return siteFavicon;
}
