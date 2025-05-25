import { uniq } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import {
  getDefinedSiteMetadata,
  getFavicon,
  getFaviconMetadata,
  getSite as createSiteInstance,
  ISiteUserConfig,
  NO_IMAGE,
  type TSiteID,
} from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";
import { logger } from "./logger.ts";
import { ptdIndexDb } from "../adapter/indexdb.ts";

export async function getSiteUserConfig(siteId: TSiteID, flush = false) {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  const storedSiteUserConfig = metadataStore?.sites?.[siteId] ?? {};

  const siteMetaData = await getDefinedSiteMetadata(siteId);

  if (flush || isEmpty(storedSiteUserConfig)) {
    storedSiteUserConfig.isOffline ??= false;
    storedSiteUserConfig.sortIndex ??= 100;
    storedSiteUserConfig.allowSearch ??= Object.hasOwn(siteMetaData, "search");
    storedSiteUserConfig.allowQueryUserInfo ??= Object.hasOwn(siteMetaData, "userInfo");
    storedSiteUserConfig.timeout ??= 30e3;
    storedSiteUserConfig.inputSetting ??= {};
    storedSiteUserConfig.groups ??= siteMetaData.tags ?? [];
    storedSiteUserConfig.downloadInterval ??= siteMetaData?.download?.interval ?? 0;
    storedSiteUserConfig.merge ??= {};
  }

  logger({ msg: `getSiteUserConfig for ${siteId}`, data: storedSiteUserConfig });
  return storedSiteUserConfig;
}

onMessage("getSiteUserConfig", async ({ data: { siteId, flush } }) => await getSiteUserConfig(siteId, flush));

export async function getSiteInstance<TYPE extends "private" | "public">(
  siteId: TSiteID,
  options: { mergeUserConfig?: boolean } = {},
) {
  const { mergeUserConfig = true } = options;
  let storedSiteUserConfig: ISiteUserConfig = {};
  if (mergeUserConfig) {
    storedSiteUserConfig = await getSiteUserConfig(siteId);
  }

  logger({ msg: `getSiteInstance for ${siteId}`, data: storedSiteUserConfig });
  return await createSiteInstance<TYPE>(siteId, storedSiteUserConfig);
}

export async function getSiteFavicon(site: TSiteID | getFaviconMetadata, flush: boolean = false): Promise<string> {
  const siteId = typeof site === "string" ? site : site.id;
  let siteFavicon = (await (await ptdIndexDb).get("favicon", siteId)) ?? false;
  if (flush || !siteFavicon) {
    const siteInstance = await getSiteInstance(siteId);
    if (siteInstance) {
      siteFavicon = await getFavicon({
        id: siteId,
        urls: uniq([siteInstance.url, ...siteInstance.metadata.urls].filter(Boolean)),
        favicon: siteInstance.metadata.favicon,
      });

      await (await ptdIndexDb).put("favicon", siteFavicon, siteId);
    }
  }

  if (!siteFavicon) {
    siteFavicon = NO_IMAGE;
    logger({ msg: `getSiteFavicon for ${siteId} failed, use default NO_IMAGE.`, level: "warn" });
  }

  return siteFavicon;
}

onMessage("getSiteFavicon", async ({ data: { site, flush } }) => (await getSiteFavicon(site, flush))!);

export async function clearSiteFaviconCache() {
  logger({ msg: `clearSiteFaviconCache` });
  return await (await ptdIndexDb).clear("favicon");
}

onMessage("clearSiteFaviconCache", async () => await clearSiteFaviconCache());
