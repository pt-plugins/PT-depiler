import { computedAsync } from "@vueuse/core";
import { definitionList, type ISiteUserConfig, TSiteID } from "@ptd/site";
import {
  siteMetadataIndex,
  type ISiteMetadataIndexEntry,
  type TSiteMetadataIndexEntryWithId,
} from "@ptd/site/metadataIndex";

import { useMetadataStore } from "@/options/stores/metadata.ts";

/**
 * 尚未添加的站点（按 definitionList 顺序）。
 *
 * 这里原来是逐个 `getSiteMetadata()` 解析完整站点定义：363 个独立 chunk / 约 1.4 MB，
 * 实测顺序加载 828~884 ms，而并发加载实测 934 ms **没有收益**（瓶颈是解析这些 chunk 的 CPU，
 * 不是 I/O）。改用构建期轻量索引后只有约 110 KB，一次 import 即可同步得到整张列表，
 * 「一键导入」与「添加站点」两个对话框因此都不再需要渐进加载。
 *
 * 索引条目本身不存 id（key 就是它），这里是唯一需要「带 id 的 value 数组」的地方，
 * 所以在取值时用 key 补上 —— 也顺便让 id 的唯一来源就是 key。
 */
export function getCanAddedSiteIndexEntries(): TSiteMetadataIndexEntryWithId[] {
  const metadataStore = useMetadataStore();
  const addedSiteIds = new Set(metadataStore.getAddedSiteIds);
  return definitionList
    .filter((siteId) => !addedSiteIds.has(siteId))
    .map((siteId) => ({ id: siteId, ...siteMetadataIndex[siteId] }));
}

export interface ISiteTableItem {
  id: TSiteID;
  /** 只放构建期轻量索引条目：站点表格只读固定属性，需要完整定义的地方（编辑器）自行按 id 取 */
  metadata: ISiteMetadataIndexEntry;
  userConfig: ISiteUserConfig;
}

export const allAddedSiteInfo = computedAsync<ISiteTableItem[]>(async () => {
  const metadataStore = useMetadataStore();
  // noinspection BadExpressionStatementJS
  Object.values(metadataStore.sites).map((x) => x);

  const sitesReturn = [];
  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    const indexEntry = siteMetadataIndex[siteId];
    if (indexEntry) {
      sitesReturn.push({ id: siteId, metadata: indexEntry, userConfig: siteUserConfig });
    }
  }

  return sitesReturn;
});
