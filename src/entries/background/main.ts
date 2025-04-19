import { onMessage } from "@/messages.ts";
import { extStorage } from "@/storage.ts";
import { log } from "~/helper.ts";

// 监听 点击图标 事件
chrome.action.onClicked.addListener(async () => {
  await chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  log("Installed!");
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

// create offscreen for DOM_PARSER and other reason ( f**k google )
chrome.offscreen?.hasDocument((has) => {
  !has &&
    chrome.offscreen.createDocument({
      url: "src/entries/offscreen/offscreen.html",
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: "Allow DOM_PARSER, CLIPBOARD, BLOBS in background.",
    });
});
