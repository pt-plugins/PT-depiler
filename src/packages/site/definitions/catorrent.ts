/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/catorrent.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "catorrent",
  name: "Catorrent",
  description: "Catorrent 是一个俄语公开游戏 BT 站（DataLife Engine），提供 PC 与主机游戏资源，无需登录",

  type: "public",
  urls: ["https://catorrent.net/"],
  legacyUrls: ["https://catorrent.org/"],

  search: {
    keywordPath: "params.story",
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: { do: "search", subaction: "search", story: "" },
    },
    selectors: {
      rows: { selector: "div.short_game_search" },
      // 卡片整块就是一个 <a href="…/<分类>/<id>-<slug>.html">，详情页同源，故两处用同一条 id 规则
      // （`[^/]*` 保证匹配不会跨过路径分隔符，取到的必定是最后一段里的发布 id）
      id: {
        selector: 'a[href$=".html"]',
        attr: "href",
        filters: [(q: string) => q.match(/(\d+)-[^/]*\.html$/)?.[1] ?? ""],
      },
      // Jackett 取的是 div.short_game_title（把年份 / 版本 / 类型一起拼进标题），
      // 这里只取站点自己的标题行；取不到时回落到整个 title 块
      title: { selector: ["div.short_game_title > div.short_game_h1", "div.short_game_title"] },
      url: { selector: 'a[href$=".html"]', attr: "href" },
      // 平台的 id（PC / PS2 / PS3 / PSP / SWITCH / XBOX …）就是 Jackett categorymappings 的 id；
      // 卡片上没有平台时 Jackett 用 default: PS1 兜底，这里不编造，留空
      category: { selector: "div.icon_default" },
      // 列表页不显示体积 / 时间 / 做种数（Jackett 的 size/seeders/leechers/date 都是 text: 占位值），一律留空
      // 下载链接也不在列表页，交给 detail.selectors.link 在需要下载时补取
    },
  },

  // 详情页 …/<分类>/<id>-<slug>.html，静态 HTML
  detail: {
    urlPattern: ["/[^/]+/\\d+-[^/]+\\.html$"],
    selectors: {
      title: { selector: ["h1[itemprop='name']", "div.full_game_top_title h1"] },
      // 页面上 <link itemprop="url" href="…/<id>-<slug>.html"> 与列表页同源，保证两个入口拿到同一个 id
      id: {
        selector: "link[itemprop='url']",
        attr: "href",
        filters: [(q: string) => q.match(/(\d+)-[^/]*\.html$/)?.[1] ?? ""],
      },
      url: { selector: "link[itemprop='url']", attr: "href" },
      // 站内没有 magnet / .torrent 直链，下载走 DLE 的 index.php?do=download&id=<发布 id>
      // ⚠️ 有些文章页会同时列出多个版本（实测一页最多 6 个 .izdan_file 块），这里只能取第一个
      link: { selector: "div.izdan_down a", attr: "href" },
      size: {
        selector: ["div.izdan_down a span", "div.izdan_down a"],
        filters: [(q: string) => q.replace(/^\s*Скачать\s*:\s*/i, "").trim(), { name: "parseSize" }],
      },
      category: { selector: "span.full_icon_platform a" },
      // 详情页只有「Дата выхода」（游戏发行日，如 itemprop=datePublished content=2026-08-14），
      // 不是种子发布时间；站上也看不到做种数 / 完成数，一律留空
    },
  },
};
