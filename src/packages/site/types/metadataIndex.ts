// noinspection ES6PreferShortImport

import type { TSiteID, TSiteUrl } from "./base";
import type { SiteSchema } from "./site";

/**
 * 站点定义里「固定属性」的轻量索引条目。
 *
 * 站点定义被 `import.meta.glob` 拆成一个个独立 chunk（2026-10 实测 363 个 / 约 1.4 MB），
 * 而全仓有十几处只为了读 `isDead` / `name` / `urls` 这类字段就把完整定义拉起来 —— 代价是
 * 几百毫秒的解析（详见 vite/plugin/generateSiteIndex.ts 的实测数字）。
 *
 * 这份索引由**构建期**生成（虚拟模块 `virtual:site-metadata-index`），值取自与 app 完全相同的
 * `getDefinedSiteMetadata`，所以不存在二次实现导致的漂移。
 *
 * ⚠️ 这里**只放固定属性**：`category` / `search.selectors` / `userInfo` 这类站点独有的大对象
 * 不进索引 —— 读它们的调用点本来就需要完整定义，硬塞进来只会让索引变成第二份全量定义。
 */
export interface ISiteMetadataIndexEntry {
  name: string;
  type: "private" | "public";
  schema?: SiteSchema;
  isDead?: true;
  /** 站点地址；`getDefinedSiteMetadata` 已还原过 rot13 */
  urls: TSiteUrl[];
  legacyUrls?: TSiteUrl[];
  trackerUrls?: TSiteUrl[];
  aka?: string[];
  tags?: string[];
  version?: number;
  description?: string | string[];
  /** 该站点有 `userInputSettingMeta`，即需要用户手动录入额外信息 */
  hasUserInputSettingMeta?: true;
  /** 口径同 `checkSiteMetadataAllow(metadata, "search")`：`search` 存在且非空 */
  hasSearch?: true;
  /** 口径同 `checkSiteMetadataAllow(metadata, "userInfo")`：`userInfo` 存在且非空 */
  hasUserInfo?: true;
  /** `searchEntry` 的 key → `{ name, enabled }`（只保留这两个标量；每个入口自己的搜索参数可能含函数，进不了索引） */
  searchEntries?: Record<string, { name: string; enabled?: boolean }>;
}

export type TSiteMetadataIndex = Record<TSiteID, ISiteMetadataIndexEntry>;

/**
 * 索引条目 + 它所属的 id。
 *
 * 条目本身**不存 id** —— key 就是它，重复存一份既占体积（实测 401 个站点约 6.2 KB / 5.3%），
 * 又多出一个「key 与 value 可能不一致」的错位来源。需要遍历 value 的消费方
 * （如 SetSite 的两个站点列表对话框）在取值时用 key 补上即可。
 */
export type TSiteMetadataIndexEntryWithId = ISiteMetadataIndexEntry & { id: TSiteID };
