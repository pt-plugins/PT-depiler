import { isEmpty } from "es-toolkit/compat";
import {
  BittorrentSite,
  getDefinedSiteMetadata,
  getFavicon,
  getFaviconMetadata,
  getSite as createSiteInstance,
  ISiteUserConfig,
  NO_IMAGE,
  PrivateSite,
  type TSiteID,
} from "@ptd/site";

import { log } from "~/helper.ts";

import { onMessage, sendMessage } from "@/messages.ts";
import { ptdIndexDb } from "../adapter/indexdb.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";

export async function getSiteUserConfig(siteId: TSiteID, flush = false) {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  const storedSiteUserConfig = metadataStore?.sites?.[siteId] ?? {};

  if (flush || isEmpty(storedSiteUserConfig)) {
    const siteMetaData = await getDefinedSiteMetadata(siteId);
    storedSiteUserConfig.isOffline ??= false;
    storedSiteUserConfig.sortIndex ??= 100;
    storedSiteUserConfig.allowSearch ??= Object.hasOwn(siteMetaData, "search");
    storedSiteUserConfig.allowQueryUserInfo ??= Object.hasOwn(siteMetaData, "userInfo");
    storedSiteUserConfig.timeout ??= 30e3;
    storedSiteUserConfig.inputSetting ??= {};
    storedSiteUserConfig.groups ??= siteMetaData.tags ?? [];
    storedSiteUserConfig.merge ??= {};
  }

  log(`getSiteUserConfig for ${siteId}: `, storedSiteUserConfig);
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

  log(`siteInstance ${siteId} created with userConfig:`, storedSiteUserConfig);
  return (await createSiteInstance<TYPE>(siteId, storedSiteUserConfig)) as TYPE extends "private"
    ? PrivateSite
    : BittorrentSite;
}

export async function getSiteFavicon(site: TSiteID | getFaviconMetadata, flush: boolean = false): Promise<string> {
  const siteId = typeof site === "string" ? site : site.id;
  let siteFavicon = (await (await ptdIndexDb).get("favicon", siteId)) ?? false;
  if (flush || !siteFavicon) {
    const siteInstance = await getSiteInstance(siteId);
    if (siteInstance) {
      siteFavicon = await getFavicon({
        id: siteId,
        urls: siteInstance.metadata.urls,
        favicon: siteInstance.metadata.favicon,
      });

      await (await ptdIndexDb).put("favicon", siteFavicon, siteId);
    }
  }

  if (!siteFavicon) {
    siteFavicon = NO_IMAGE;
  }

  return siteFavicon;
}

onMessage("getSiteFavicon", async ({ data: { site, flush } }) => (await getSiteFavicon(site, flush))!);
