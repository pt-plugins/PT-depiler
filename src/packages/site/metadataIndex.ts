// noinspection ES6PreferShortImport

import { siteMetadataIndex } from "virtual:site-metadata-index";

export { siteMetadataIndex };
export type { ISiteMetadataIndexEntry, TSiteMetadataIndex, TSiteMetadataIndexEntryWithId } from "./types/metadataIndex";

/**
 * 站点定义「固定属性」的轻量索引（构建期生成，见 vite/plugin/generateSiteIndex.ts）。
 *
 * 用法：只读固定属性的地方改成查这里，不要再 `getDefinedSiteMetadata()` / `metadataStore.getSiteMetadata()`
 * ——后者会把整个站点定义 chunk（含 search selectors / userInfo 等大对象）拉起来解析。
 *
 * 注意这个模块**故意不从 `@ptd/site` 的 index.ts 里再导出**：索引本身约 106 KB，谁 import 谁就带上，
 * 不该让它跟着 `@ptd/site` 一起进 content-script 等不需要它的产物。
 */
