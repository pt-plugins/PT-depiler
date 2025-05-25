import { computedAsync } from "@vueuse/core";
import { definitionList, ISiteMetadata, type ISiteUserConfig, TSiteID } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";

export async function getCanAddedSiteMetadata() {
  const canAddedSiteMetadata: Record<TSiteID, ISiteMetadata> = {};
  const metadataStore = useMetadataStore();
  const canAddedSiteList = definitionList.filter((x) => !metadataStore.getAddedSiteIds.includes(x));
  for (const siteId of canAddedSiteList) {
    const siteMetadata = await metadataStore.getSiteMetadata(siteId);
    if (!siteMetadata.isDead) {
      canAddedSiteMetadata[siteId] = siteMetadata;
    }
  }
  return canAddedSiteMetadata;
}

export interface ISiteTableItem {
  id: TSiteID;
  metadata: ISiteMetadata;
  userConfig: ISiteUserConfig;
}

export const allAddedSiteInfo = computedAsync<ISiteTableItem[]>(async () => {
  const metadataStore = useMetadataStore();
  // noinspection BadExpressionStatementJS
  Object.values(metadataStore.sites).map((x) => x);

  const sitesReturn = [];
  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    sitesReturn.push({
      id: siteId,
      metadata: await metadataStore.getSiteMetadata(siteId),
      userConfig: siteUserConfig,
    });
  }

  return sitesReturn;
});
