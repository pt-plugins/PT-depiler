import { onMessage } from "@/messages.ts";
import { extStorage } from "@/storage.ts";

// 监听 点击图标 事件
chrome.action.onClicked.addListener(async () => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed!");
});

// @ts-ignore
onMessage("getExtStorage", async ({ data: key }) => {
  return await extStorage.getItem(key);
});

onMessage("setExtStorage", async ({ data: { key, value } }) => {
  await extStorage.setItem(key, value);
});

onMessage("getSiteUserConfig", async ({ data: siteId }) => {
  const siteUserConfig = await extStorage.getItem("siteUserConfig");
  const storedSiteUserConfig = siteUserConfig?.[siteId] ?? { id: siteId };
  storedSiteUserConfig.isOffline ??= false;
  storedSiteUserConfig.sortIndex ??= 100;
  storedSiteUserConfig.merge ??= {};

  return storedSiteUserConfig;
});

// create offscreen for DOM_PARSER and other reason ( f**k google )
chrome.offscreen?.hasDocument((has) => {
  !has &&
    chrome.offscreen.createDocument({
      url: "src/entries/offscreen/offscreen.html",
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: "Allow DOM_PARSER, CLIPBOARD, BLOBS in background.",
    });
});
