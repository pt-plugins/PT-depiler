// This file is the entry point for the content script
//
// 此入口应保持轻量（仅做"当前页面是否需要挂载"的判断），
// 重资源（Vue/Vuetify/站点包）都在多页构建的 assets/cs-app.js 中按需加载；
// social 匹配判断经消息由 offscreen 代查，避免把 social 包打进引导（见 issue #1467）。

import { sendMessage } from "@/messages.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/types/storages/config.ts";

async function loadApp(props: Parameters<(typeof import("./app/init.ts"))["mountApp"]>[1]) {
  // 运行时从扩展包内加载多页构建产出的 ESM 入口（assets/cs-app.js，固定文件名），
  // @vite-ignore 阻止本入口（IIFE 单文件构建）将 app 静态打进引导
  const appUrl = chrome.runtime.getURL("assets/cs-app.js");
  console.debug("[PTD] loading app from", appUrl);
  const { mountApp } = (await import(/* @vite-ignore */ appUrl)) as typeof import("./app/init.ts");
  console.debug("[PTD] app module loaded");
  await mountApp(document, props);
  console.debug("[PTD] app mounted");
}

sendMessage("getExtStorage", "config").then(async (data) => {
  const configStore = data as IConfigPiniaStorageSchema;

  if (configStore?.contentScript?.enabled ?? true) {
    if (configStore?.contentScript?.enabledAtSocialSite ?? true) {
      const socialSite = await sendMessage("matchSocialPage", window.location.href);
      if (socialSite) {
        console.debug(`[PTD] Social site detected: ${socialSite}, loading app...`);
        await loadApp({ socialSite });
        return; // 找到匹配的 social site 后，直接加载应用并退出
      }
    }

    // 这里不再把整份 metadata store 搬到页面上下文：只需要 host → siteId 一项判断，
    // 由 SW 侧完成（含 allowExceptionSites 的排除逻辑），回传一个极小的对象
    sendMessage("matchSitePage", window.location.href).then(async (siteMatch) => {
      if (!siteMatch) {
        return; // 当前页面不是已添加的站点
      }

      if (!siteMatch.allowContentScript) {
        console.debug(`[PTD] Content script is disabled for site: ${siteMatch.siteId}`);
        return; // 允许排除站点，且该站点配置里禁用了 contentScript
      }

      console.debug(`[PTD] host found for site: ${siteMatch.siteId}, loading app...`);
      await loadApp({ siteId: siteMatch.siteId });
    });
  }
});
