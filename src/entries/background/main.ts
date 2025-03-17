import { onMessage } from "@/messages.ts";
import { extStorage, ISitePiniaStorageSchema } from "@/storage.ts";
import { log } from "~/helper.ts";
import { format } from "date-fns";

// 监听 点击图标 事件
chrome.action.onClicked.addListener(async () => {
  await chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  log("Installed!");
});

// @ts-ignore
onMessage("getExtStorage", async ({ data: key }) => {
  return await extStorage.getItem(key);
});

onMessage("setExtStorage", async ({ data: { key, value } }) => {
  await extStorage.setItem(key, value);
  log(`setExtStorage for ${key}: `, value);
});

onMessage("getSiteUserConfig", async ({ data: siteId }) => {
  const siteUserConfig = await extStorage.getItem("site");
  const storedSiteUserConfig = siteUserConfig?.sites?.[siteId] ?? { id: siteId };
  storedSiteUserConfig.isOffline ??= false;
  storedSiteUserConfig.sortIndex ??= 100;
  storedSiteUserConfig.merge ??= {};

  log(`getSiteUserConfig for ${siteId}: `, storedSiteUserConfig);
  return storedSiteUserConfig;
});

onMessage("setSiteLastUserInfo", async ({ data: userData }) => {
  console.log("setSiteLastUserInfo", userData);
  const site = userData.site;

  // 存储用户信息到 site 中
  const siteStore = (await extStorage.getItem("site")) ?? {};
  (siteStore as ISitePiniaStorageSchema).lastUserInfo ??= {};
  (siteStore as ISitePiniaStorageSchema).lastUserInfo[site] = userData;
  await extStorage.setItem("site", siteStore as ISitePiniaStorageSchema);

  // 存储用户信息到 userInfo 中
  const userInfoStore = (await extStorage.getItem("userInfo")) ?? {};
  userInfoStore[site] ??= {};
  const dateTime = format(userData.updateAt, "yyyy-MM-dd");
  userInfoStore[site][dateTime] = userData;
  await extStorage.setItem("userInfo", userInfoStore);
});

onMessage("downloadFile", async ({ data: downloadOptions }) => {
  return await chrome.downloads.download(downloadOptions);
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
