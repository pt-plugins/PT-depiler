import { onMessage } from "@/messages.ts";
import { fixAllStoredUserInfo } from "./utils/userInfoFixer.ts";

import "./utils/base.ts";
import "./utils/cookies.ts";
import "./utils/offscreen.ts";
import "./utils/contextMenus.ts";
import "./utils/omnibox.ts";
import "./utils/alarms.ts";
import "./utils/webRequest.ts";

// 监听 点击图标 事件
chrome.action.onClicked.addListener(async () => {
  await chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(async () => {
  console.debug("[PTD] Installed!");

  // 修复存储中的坏数据
  await fixAllStoredUserInfo();
});

onMessage("ping", async ({ data }) => {
  console.log("ping", data);
  return data ?? "pong";
});
