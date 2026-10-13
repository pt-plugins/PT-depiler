/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/mactorrentsdownload.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * 站点时间：WordPress REST API（/wp-json/wp/v2/posts）返回的 `date` 与 `date_gmt` **完全相同**，
 * 说明站点时区就是 UTC；列表页的 `<time datetime="2026-09-30">` 也精确到日。
 * Jackett 里硬编码的 ` -07:00 (PDT)` 与实测不符，未采用；timezoneOffset 用 public 站默认的 +0000。
 */
function parseDate(text: string): number {
  const match = /(\d{4})-(\d{2})-(\d{2})/.exec(String(text));
  return match ? Date.UTC(+match[1], +match[2] - 1, +match[3]) : 0;
}

/** 文章元素 id 形如 post-127744，去掉前缀就是文章 id（列表页与详情页都用它） */
const postId = (value: string) => /^post-(\d+)$/.exec(String(value))?.[1] ?? String(value);

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "mactorrentsdownload",
  name: "Mac Torrents Download",
  description: "Mac Torrents Download（torrentmac.net）是公开的 macOS 软件/游戏资源站，种子文件在文章页给出",
  tags: ["软件"],

  type: "public",
  urls: ["https://www.torrentmac.net/"],

  search: {
    keywordPath: "params.s",
    requestConfig: {
      url: "/",
      responseType: "document",
      params: {},
    },
    selectors: {
      rows: { selector: 'article[id^="post-"][class*="type-post"]' },
      id: { selector: ":self", attr: "id", filters: [postId] },
      title: { selector: "h2.post-title a" },
      url: { selector: "h2.post-title a", attr: "href" },
      // 第一个分类链接是大类（Application / Games / Design Assets / …），第二个是子类
      category: { selector: 'a[href*="/category/"]' },
      time: { selector: "time", attr: "datetime", filters: [parseDate] },
      // 列表页不显示体积，站上也没有做种/下载/完成人数，留空
    },
  },

  list: [
    {
      urlPattern: ["\\?s=", "/category/"],
      selectors: {
        keywords: { selector: "input#s", attr: "value" },
      },
    },
  ],

  // 详情页就是文章页 /<slug>/，列表页给不出种子链接，真正下载链接只在文章页的 a.download-btn 上
  detail: {
    urlPattern: ["/[^/]+/$"],
    selectors: {
      id: { selector: 'article[id^="post-"]', attr: "id", filters: [postId] },
      title: { selector: "h1.post-title" },
      // 文章页有两个 a.download-btn：一个是真实的 .torrent（/wp-content/uploads/…），
      // 另一个是 JS 兜底的 /download-fallback/，用后缀把它们区分开
      link: { selector: 'a.download-btn[href$=".torrent"]', attr: "href" },
      time: { selector: 'article[id^="post-"] header time[datetime]', attr: "datetime", filters: [parseDate] },
      category: { selector: 'article[id^="post-"] header a[href*="/category/"]' },
    },
  },
};
