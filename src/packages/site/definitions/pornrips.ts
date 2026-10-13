/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pornrips.yml
 */
import { type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";

/** 列表页 article[id="post-<数字>"]、详情页同款属性，两处取出的 id 完全一致 */
const parsePostId = (raw: string): string | undefined => /^post-(\d+)$/.exec(String(raw).trim())?.[1];

/**
 * 体积写在 `File Size: 265 MB` 这样的正文里（详情页那一行还带着 Release/Duration）。
 * Jackett 用 `regexp` + `(\d+ [M|G]i?B)`；PT-depiler 没有名为 `regexp` 的 filter
 * （拼错会被静默忽略），故直接用函数 filter 取单位再交给 parseSizeString。
 */
const parseFileSize = (raw: string): number => {
  const matched = /(\d+(?:\.\d+)?\s*[KMGT]i?B)/i.exec(String(raw));
  return matched ? parseSizeString(matched[1]) : 0;
};

/**
 * `<time class="entry-date" datetime="2026-10-13T14:31:48+00:00">`。
 * 这个 datetime 自带偏移，直接交给 `Date.parse` 就是绝对时间，与运行主机时区无关；
 * 不要先剥掉偏移再丢给 `parseTimeWithZone`（那样反而依赖主机时区）。
 */
const parseEntryDate = (raw: string): number => Date.parse(String(raw).trim()) || 0;

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "pornrips",
  name: "PornRips",
  description: "PornRips is a Public site for 3X（WordPress 架构的公开成人向 BT 站）",
  tags: ["成人", "XXX"],

  type: "public",
  urls: ["uggcf://cbeaevcf.gb/"],

  search: {
    // WordPress 原生搜索：/?s=<关键词>（站点自己的搜索框 action 就是 / ，input name=s）
    keywordPath: "params.s",
    requestConfig: { url: "/", responseType: "document", params: { s: "" } },
    selectors: {
      rows: { selector: "article:has(a)" },
      // 文章容器自己带 id="post-<数字>"，详情页同源，保证两个入口拿到同一个 id
      id: { selector: ":self", attr: "id", filters: [parsePostId] },
      title: { selector: ".entry-title" },
      url: { selector: ".entry-title > a", attr: "href" },
      // 列表页没有 .torrent / magnet，只有文章链接；下载链接交给 detail.selectors.link 去详情页取
      author: { selector: ".author.vcard .fn" },
      time: { selector: "time.entry-date", attr: "datetime", filters: [parseEntryDate] },
      size: { selector: "p", filters: [parseFileSize] },
      category: { text: "XXX" }, // 站点没有内容分类，WP 的 category 只是画质标签（720p/1080p），统一归 XXX
      // 站点不提供做种 / 下载 / 完成人数（Jackett 硬编码 1/1），留空
    },
  },

  list: [
    {
      // 首页 /、?s= 搜索结果页、/page/<n>/ 分页都是同一套 article 模板
      urlPattern: ["^https?://[^/]+/(?:[?#].*)?$", "^https?://[^/]+/page/\\d+/"],
      // 不声明 keywords：搜索框的 value 由 WP 模板填充，这里交给框架按 keywordPath（params.s）
      // 从 URL 查询串回落更稳
    },
  ],

  // 详情页 /<slug>/，服务端渲染、每页一颗种子。transformDetailPage 不做类型转换，
  // 体积与时间必须在 filters 里自己转。
  detail: {
    // 站点是 WordPress，文章 slug 全是顶层一段式；这里把已知的其它顶层路由用负向先行断言排除，
    // 避免 /page/2/、/category/720p/、/tag/xxx/、/requests/ 之类被当成详情页
    urlPattern: [
      "^https?://[^/]+/(?!(?:page|category|tag|author|feed|comments|contact|requests|dmca|torrents|k2s|static|wp-content|wp-json)(?:/|$))[\\w.-]+/(?:[?#].*)?$",
    ],
    selectors: {
      title: { selector: ".entry-title" },
      id: { selector: "article[id^='post-']", attr: "id", filters: [parsePostId] },
      // 正文里的下载按钮指向 /torrents/<发布名>.torrent（页脚 RSS 是 /feed/torrents，不含 "/torrents/"）
      link: { selector: "a[href*='/torrents/']", attr: "href" },
      author: { selector: ".author.vcard .fn" },
      time: { selector: "time.entry-date", attr: "datetime", filters: [parseEntryDate] },
      size: { selector: "p:contains('File Size')", filters: [parseFileSize] },
      category: { text: "XXX" },
    },
  },
};
