// This file is the entry point for the content script
//
// 此入口应保持轻量（仅做"当前页面是否需要挂载"的判断），
// 重资源（Vue/Vuetify/站点包）都在多页构建的 assets/cs-app.js 中按需加载；
// social 匹配判断经消息由 offscreen 代查，避免把 social 包打进引导（见 issue #1467）。

import { getHostFromUrl } from "@ptd/site/utils/html.ts";

import { sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types/storages/metadata.ts";
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

    sendMessage("getExtStorage", "metadata").then(async (data) => {
      const metadataStore = data as IMetadataPiniaStorageSchema; // 假设 metadataStore 的类型是 any

      const host = getHostFromUrl(window.location.href); // 获取当前页面的 host

      if (metadataStore.siteHostMap[host]) {
        // 如果当前页面的 host 在 metadataStore 中有对应的 siteId，加载 app
        const siteId = metadataStore.siteHostMap[host];

        if (
          configStore?.contentScript?.allowExceptionSites === true &&
          metadataStore.sites[siteId]?.allowContentScript === false
        ) {
          console.debug(`[PTD] Content script is disabled for site: ${siteId}`);
          return; // 如果允许排除站点，且站点配置中禁用了 contentScript，则不加载应用
        }

        console.debug(`[PTD] host found for site: ${siteId}, loading app...`);
        await loadApp({ siteId });
      }
    });
  }
});
