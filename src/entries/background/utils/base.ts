import { onMessage } from "@/messages.ts";
import { extStorage } from "@/storage.ts";
import { stringifyQuery } from "@ptd/utils/url.ts";

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
