import { onMessage } from "@/messages.ts";
import { extStorage } from "@/storage.ts";
import { log } from "~/helper.ts";

import "./utils/cookies.ts";
import "./utils/omnibox.ts";
import "./utils/offscreen.ts";
import "./utils/alarms.ts";
import "./utils/webRequest.ts";

// 监听 点击图标 事件
chrome.action.onClicked.addListener(async () => {
  await chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  log("Installed!");
});

onMessage("ping", async ({ data }) => {
  return data ?? "pong";
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
