import { computedAsync } from "@vueuse/core";
import { definitionList, ISiteMetadata, type ISiteUserConfig, TSiteID } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";

export async function getCanAddedSiteMetadata() {
  const metadataStore = useMetadataStore();
  const canAddedSiteList = definitionList.filter((x) => !metadataStore.getAddedSiteIds.includes(x));

  // 并行获取所有可添加站点的元数据
  const metadataEntries = await Promise.all(
    canAddedSiteList.map(async (siteId) => [siteId, await metadataStore.getSiteMetadata(siteId)] as const),
  );

  return Object.fromEntries(metadataEntries) as Record<TSiteID, ISiteMetadata>;
}

export interface ISiteTableItem {
  id: TSiteID;
  metadata: ISiteMetadata;
  userConfig: ISiteUserConfig;
  name: string; // 计算出的站点名称，用于排序
}

export const allAddedSiteInfo = computedAsync<ISiteTableItem[]>(async () => {
  const metadataStore = useMetadataStore();

  // 使用 Promise.all 并行获取所有站点元数据，提高性能
  const siteEntries = Object.entries(metadataStore.sites);
  const sitesData = await Promise.all(
    siteEntries.map(async ([siteId, siteUserConfig]) => {
      const metadata = await metadataStore.getSiteMetadata(siteId);
      return {
        id: siteId as TSiteID,
        metadata,
        userConfig: siteUserConfig,
        name: siteUserConfig?.merge?.name ?? metadata?.name ?? siteId,
      };
    }),
  );

  return sitesData;
});
