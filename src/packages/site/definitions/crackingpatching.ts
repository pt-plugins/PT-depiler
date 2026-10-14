/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/crackingpatching.yml
 */
import { type ISiteMetadata } from "../types";
import { buildCategoryOptionsFromList } from "../utils/helper.ts";

/** 详情页/搜索页的 URL 都形如 <host>/<yyyy>/<mm>/<slug>.html，两处共用同一套 id 规则 */
const slugFromUrl = (q: string) => (q.replace(/\/+$/, "").split("/").pop() ?? "").replace(/\.html?$/i, "");

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "crackingpatching",
  name: "CrackingPatching",
  description: "CrackingPatching is a Public tracker for Software and Apps",

  type: "public",
  urls: ["https://crackingpatching.com/"],

  category: [
    {
      name: "Category",
      key: "cat",
      // Jackett categorymappings 的 id（即文章 class 里 category-<id> 的后缀），
      // 真机上作为 WordPress 分类别名走 /category/<slug>/ 路径：
      //   https://crackingpatching.com/category/idm/ -> 200，首条就是 IDM Crack；
      //   而 ?cat=idm 与 ?cat=5 都不生效（前者返回首页、后者 404）
      options: buildCategoryOptionsFromList([
        "adobe-software",
        "adobe-tools",
        "android",
        "animations-3d-graphics",
        "antivirus",
        "cd-dvd-burners",
        "compression-tools",
        "converters",
        "crack-serials",
        "downloader",
        "drivers-update",
        "games",
        "home",
        "idm",
        "idm-crack-patch",
        "ios-mac-os-x-2",
        "keygen-loader",
        "keygen-serial",
        "microsoft-office",
        "multimedia",
        "other",
        "pdf-tools",
        "photo-editing-tools",
        "recovery-software",
        "request-crack-patch",
        "screen-recorders",
        "security",
        "system-optimizers",
        "uncategorized",
        "vpn",
        "windows",
        "windows-app",
      ]),
      // 分类过滤走路径而不是查询串，所以必须自己生成 requestConfig
      generateRequestConfig: (selectedOptions) => ({
        requestConfig: { url: `/category/${selectedOptions.toString()}/` },
      }),
    },
  ],

  search: {
    // Jackett inputs: s={{ .Keywords }}，站点是 WordPress 首页搜索
    keywordPath: "params.s",
    requestConfig: { url: "/", responseType: "document" },
    selectors: {
      // 列表页 31 条 <article class="post-entry post-NNN ... hentry category-xxx category-yyy">
      rows: { selector: "article.post-entry" },
      id: { selector: "h2.entry-title > a", attr: "href", filters: [slugFromUrl] },
      title: { selector: "h2.entry-title" },
      url: { selector: "h2.entry-title > a", attr: "href" },
      // 列表页不显示任何日期，站点也不给体积/做种数，全部留空
      // （Jackett 的 date: now / "512 MB" / 1 / 1 是硬编码占位，不照抄）
    },
  },

  detail: {
    // 详情页形如 https://crackingpatching.com/2021/01/idm-crack-patch.html
    urlPattern: ["^https?://crackingpatching\\.com/\\d{4}/\\d{2}/[\\w-]+\\.html?$"],
    requestConfig: { responseType: "document" },
    selectors: {
      title: { selector: "h1.entry-title" },
      // 与搜索页共用同一套 slug 规则，保证两处进入详情时 id 一致
      id: { selector: ":self", elementProcess: (el: any) => el.URL || "", filters: [slugFromUrl] },
      // 详情页正文里的 <a href="magnet:?xt=urn:btih:...&dn=...">xxx.torrent</a>
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      // <time class="entry-date" datetime="2021-04-16T21:21:21+00:00">（列表页没有，只有详情页有）
      time: { selector: "time[datetime]", attr: "datetime", filters: [{ name: "parseTime" }] },
      // size / seeders / leechers：列表页与详情页都没有，留空
    },
  },
};
