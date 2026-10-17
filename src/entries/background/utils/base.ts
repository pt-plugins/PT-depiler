import { onMessage } from "@/messages.ts";
import { extStorage } from "@/storage.ts";
import { stringifyQuery } from "@ptd/utils/url.ts";
import { getHostFromUrl } from "@ptd/site/utils/html.ts"; // 同 contextMenus：不能用 @ptd/site 主入口，会导致 sw 无法加载

export function openOptionsPage(url?: string | { path: string; query?: Record<string, any> }) {
  if (url && typeof url !== "string") {
    url = url.path + (url.query ? "?" + stringifyQuery(url.query) : "");
  }
  url ??= "/";

  chrome.tabs.create({ url: "/src/entries/options/index.html#" + url }).catch();
}

onMessage("openOptionsPage", async ({ data: url }) => {
  openOptionsPage(url);
});

onMessage("downloadFile", async ({ data: downloadOptions }) => {
  return await chrome.downloads.download(downloadOptions);
});

// @ts-ignore
onMessage("getExtStorage", async ({ data: key }) => {
  return await extStorage.getItem(key);
});

onMessage("setExtStorage", async ({ data: { key, value } }) => {
  await extStorage.setItem(key, value);
});

/**
 * content-script 引导唯一的站点判断：当前 URL 是不是已添加的站点，以及该站点是否允许注入。
 *
 * 以前这一步是让页面自己 `getExtStorage("metadata")` —— 整份 metadata store
 * （sites + solutions + snapshots + siteNameMap + siteHostMap + lastUserInfo）会被结构化克隆到
 * 每个标签页的页面上下文里，而实际只用到 `siteHostMap[host]` 一项；`allowExceptionSites` 的排除逻辑
 * 也随之搬到 SW 侧，页面只拿一个小对象。
 */
onMessage("matchSitePage", async ({ data: url }) => {
  const metadataStore = (await extStorage.getItem("metadata"))! ?? {};
  const siteId = metadataStore?.siteHostMap?.[getHostFromUrl(url)];
  if (!siteId) {
    return null;
  }

  const configStore = (await extStorage.getItem("config"))! ?? {};
  const allowContentScript = !(
    configStore?.contentScript?.allowExceptionSites === true &&
    metadataStore?.sites?.[siteId]?.allowContentScript === false
  );

  return { siteId, allowContentScript };
});
