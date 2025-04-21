import { definitionList, ISiteMetadata, TSiteID } from "@ptd/site";
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
