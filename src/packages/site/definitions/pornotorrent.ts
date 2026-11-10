/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pornotorrent.yml
 *
 * 整站成人站（tags 含「成人 / XXX」）：`urls` / `legacyUrls` 全部写 rot13，文件里不出现本站域名明文。
 *
 * ⚠️ 截至 2026-10-13 该站被 Cloudflare 拦截：3 次根域 + `torznab?t=caps`、
 * `torznab?t=search&q=…`、`torznab/api?t=caps&apikey=` 全部 403（响应 5.7~5.9KB，
 * 标题 "Just a moment..."，CF JS 挑战页）。**没有拿到任何 XML 样本**，因此下面几点
 * 依据 Jackett 定义、**未经真机验证**：
 *   - 是否真的不需要 apikey（Jackett 定义里没有 apikey 设置，故本文件不声明）；
 *   - 响应是 `channel > item` 还是 `rss > channel > item`（按 Jackett 的 `channel > item` 写）；
 *   - 分类到底是 `<torznab:attr name="category" value="6000"/>` 还是 `<category>` 文本
 *     （按 Jackett 的 `[name=category]` + `attribute: value` 写）。
 *
 * 2026-11-10 起走 `schemas/Torznab.ts` 引擎（schema: "Torznab"）：title / link / pubDate /
 * seeders 等选择器骨架来自引擎默认值（feed 若真实携带 `[name=seeders]` 等 attr 会取真值；
 * Jackett 的 1/0 是写死占位，不照抄），本文件只保留与默认不同的部分。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata, torznabCategoryName } from "../schemas/Torznab.ts";

/** torznab 分类 id → 名称，来自 Jackett categorymappings（注释写明取自 torznab?t=caps） */
const CATEGORIES = [
  { name: "XXX", value: 6000 },
  { name: "XXX/SD", value: 6080 },
  { name: "XXX/WEB-DL", value: 6090 },
];

/** pubDate 形如 `Sat, 01 Aug 2026 01:00:00 GMT`（Jackett 把 GMT 换成 +00:00 后用 dateparse） */
function parseRfc822(raw: string): number {
  const parsed = Date.parse(String(raw ?? "").trim());
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "pornotorrent",
  name: "PornoTorrent",
  description: "PornoTorrent is a BRAZILIAN Public Torrent Tracker for 3X",
  tags: ["成人", "XXX"],

  type: "public",
  schema: "Torznab",
  urls: ["uggcf://cbeabgbeerag.pbz.oe/"],
  // Jackett legacylinks，同样 rot13 保存
  legacyUrls: ["uggcf://jjj.cbeabgbeerag.rh/", "uggcf://cbeabgbeerag.arg.oe/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [{ name: "全部", value: "" }, ...CATEGORIES],
      cross: false,
      generateRequestConfig: (selected) => {
        const value = String(selected ?? "");
        return { requestConfig: { params: value ? { cat: value } : {} } };
      },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      ...SchemaMetadata.search.requestConfig,
      url: "/torznab/",
    },
    selectors: {
      ...SchemaMetadata.search.selectors,
      rows: { selector: "channel > item" },
      // Jackett 的 details = guid；该站 torznab 的 guid 就是 magnet，故 url / link 都落在磁力上
      url: { selector: "guid" },
      // id 兜底取整条 magnet（url），把其中的 infohash 显式落到 torrent.infoHash
      infoHash: { selector: "guid", filters: [{ name: "magnetToInfoHash" }] },
      category: {
        // Jackett：feed 里细分类在前、父类 6000 在后，所以取最后一个
        selector: "[name='category']:last",
        attr: "value",
        filters: [torznabCategoryName(CATEGORIES, "XXX")],
      },
      size: { selector: "size", filters: [{ name: "parseSize" }] }, // <size> 元素（非 attr）
      time: { selector: "pubDate", filters: [parseRfc822] },
      // seeders / leechers：见文件头注释
    },
  },

  // 未声明 detail：torznab 的 guid 就是 magnet，详情页没有任何额外信息可补
  // （且被 CF 拦截，无法抓到详情页样本）。
};
