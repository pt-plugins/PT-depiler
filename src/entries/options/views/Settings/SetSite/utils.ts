import { computedAsync } from "@vueuse/core";
import { definitionList, ISiteMetadata, type ISiteUserConfig, TSiteID } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";

/**
 * 逐个产出「尚未添加」的站点定义。
 *
 * 站点定义被 `import.meta.glob` 拆成一个个独立 chunk（2026-10 实测 363 个 / 约 1.4 MB），
 * 一次性 await 完再渲染会让调用方空白近 1 秒：实测顺序加载 828~884 ms，而改成并发
 * 加载实测 934 ms、**没有收益**——瓶颈是解析这些 chunk 的 CPU，不是 I/O。
 * 所以这里改成逐条产出，调用方可以边拿边渲染。
 */
export async function* iterateCanAddedSiteMetadata(): AsyncGenerator<ISiteMetadata> {
  const metadataStore = useMetadataStore();
  const addedSiteIds = new Set(metadataStore.getAddedSiteIds);
  for (const siteId of definitionList) {
    if (addedSiteIds.has(siteId)) continue;
    yield await metadataStore.getSiteMetadata(siteId);
  }
}

export async function getCanAddedSiteMetadata() {
  const canAddedSiteMetadata: Record<TSiteID, ISiteMetadata> = {};
  for await (const siteMetadata of iterateCanAddedSiteMetadata()) {
    canAddedSiteMetadata[siteMetadata.id] = siteMetadata;
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
