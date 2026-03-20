// This file is the entry point for the content script

import { definitionList, getDefinedSiteMetadata, getHostFromUrl } from "@ptd/site";
import { socialPageParserMatchesMap } from "@ptd/social";

import { sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types/storages/metadata.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/types/storages/config.ts";

import { mountApp } from "./app/init.ts";

async function resolveSiteIdByHost(host: string, metadataStore: IMetadataPiniaStorageSchema) {
  if (metadataStore.siteHostMap[host]) {
    return metadataStore.siteHostMap[host];
  }

  const candidateSiteIds = Array.from(new Set([...Object.keys(metadataStore.sites ?? {}), ...definitionList]));

  for (const siteId of candidateSiteIds) {
    const candidateUrls = new Set<string>();
    const siteConfig = metadataStore.sites?.[siteId];

    if (siteConfig?.url) {
      candidateUrls.add(siteConfig.url);
    }

    try {
      const siteMetadata = await getDefinedSiteMetadata(siteId);
      for (const url of siteMetadata.urls ?? []) {
        candidateUrls.add(url);
      }
      for (const url of siteMetadata.legacyUrls ?? []) {
        candidateUrls.add(url);
      }
    } catch (error) {
      console.debug(`[PTD] Failed to load site metadata for host resolution: ${siteId}`, error);
    }

    for (const candidateUrl of candidateUrls) {
      if (getHostFromUrl(candidateUrl) === host) {
        return siteId;
      }
    }
  }
}

sendMessage("getExtStorage", "config").then(async (data) => {
  const configStore = data as IConfigPiniaStorageSchema;

  if (configStore?.contentScript?.enabled ?? true) {
    if (configStore?.contentScript?.enabledAtSocialSite ?? true) {
      for (const [socialSite, patternMatches] of Object.entries(socialPageParserMatchesMap)) {
        for (const [pattern, _] of patternMatches) {
          if (new RegExp(pattern, "i").test(window.location.href)) {
            console.debug(`[PTD] Social site detected: ${socialSite}, loading app...`);
            mountApp(document, { socialSite });
            return; // 找到匹配的 social site 后，直接加载应用并退出
          }
        }
      }
    }

    sendMessage("getExtStorage", "metadata").then(async (data) => {
      const metadataStore = data as IMetadataPiniaStorageSchema; // 假设 metadataStore 的类型是 any

      const host = getHostFromUrl(window.location.href); // 获取当前页面的 host

      const siteId = await resolveSiteIdByHost(host, metadataStore);

      if (siteId) {
        if (!metadataStore.siteHostMap[host]) {
          metadataStore.siteHostMap[host] = siteId;
          sendMessage("setExtStorage", { key: "metadata", value: metadataStore }).catch();
        }
        // 如果当前页面的 host 在 metadataStore 中有对应的 siteId，加载 app
        if (
          configStore?.contentScript?.allowExceptionSites === true &&
          metadataStore.sites[siteId]?.allowContentScript === false
        ) {
          console.debug(`[PTD] Content script is disabled for site: ${siteId}`);
          return; // 如果允许排除站点，且站点配置中禁用了 contentScript，则不加载应用
        }

        console.debug(`[PTD] host found for site: ${siteId}, loading app...`);
        mountApp(document, { siteId });
      }
    });
  }
});
