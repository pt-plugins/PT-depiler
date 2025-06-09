// This file is the entry point for the content script

import { sendMessage } from "@/messages.ts";
import { getHostFromUrl } from "@ptd/site";
import type { IMetadataPiniaStorageSchema } from "@/shared/types/storages/metadata.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/types/storages/config.ts";

// 检查该站点是否已经有 vuetify 的主题样式
const vuetifyThemePre = document.querySelector("#vuetify-theme-stylesheet");
const hasVuetifyThemePre = vuetifyThemePre !== null && vuetifyThemePre instanceof HTMLLinkElement;

sendMessage("getExtStorage", "config").then(async (data) => {
  const configStore = data as IConfigPiniaStorageSchema;

  if (configStore?.contentScript?.enabled ?? true) {
    sendMessage("getExtStorage", "metadata").then(async (data) => {
      const metadataStore = data as IMetadataPiniaStorageSchema; // 假设 metadataStore 的类型是 any

      const host = getHostFromUrl(window.location.href); // 获取当前页面的 host

      if (metadataStore.siteHostMap[host]) {
        // 如果当前页面的 host 在 metadataStore 中有对应的 siteId，动态加载 app
        const siteId = metadataStore.siteHostMap[host];
        console.debug(`[PTD] host found for site: ${siteId}, loading app...`);

        import("./app/init.ts").then(({ mountApp }) => {
          const { shadowRoot } = mountApp(document, { siteId });

          // 如果没有预先存在的 vuetify 主题样式，则说明此时的 vuetifyTheme 是我们引入的，需要移动到shadow Dom中以免影响网站样式
          const vuetifyTheme = document.querySelector("#vuetify-theme-stylesheet");
          if (vuetifyTheme) {
            const styleContent = vuetifyTheme.textContent || "";
            const vuetifyThemeStylesheet = document.createElement("style");
            vuetifyThemeStylesheet.id = "ptd-content-script-style-vuetify-theme-stylesheet"; // 设置 id 以便于后续查找
            vuetifyThemeStylesheet.textContent = styleContent.replace(":root", ":host");
            shadowRoot.appendChild(vuetifyThemeStylesheet); // 克隆并添加 Vuetify 的主题样式到 shadow DOM 中

            if (!hasVuetifyThemePre) {
              vuetifyTheme.remove(); // 如果没有预先存在的 vuetify 主题样式，则移除页面中的 vuetify 主题样式
            }
          }
        });
      }
    });
  }
});
