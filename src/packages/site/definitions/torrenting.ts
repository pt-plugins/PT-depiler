/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/torrenting.yml
 * @JackettIssue https://github.com/Jackett/Jackett/pull/16904
 */
import Sizzle from "sizzle";

import type { ISiteMetadata } from "../types";
import { parseTimeToLiveToDate } from "../utils";

/**
 * 站点使用 phpBB 风格的模板，种子以 `?cat=id` 过滤，下载量系数（FreeLeech）通过文本判断。
 * 见 Jackett 定义中的 downloadvolumefactor。
 */
export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrenting",
  name: "Torrenting",
  aka: ["TT"],
  description: "Torrenting (TT) is a Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["综合"],
  // 站点以相对时间展示发布时间，time 字段已归一化为 UTC，故此处使用 +0000
  timezoneOffset: "+0000",

  type: "private",

  urls: ["https://torrenting.com/", "https://torrenting.me/"],
  favicon: "https://torrenting.com/favicon.ico",

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "Movies/480p", value: 25 },
        { name: "Movies/4K", value: 96 },
        { name: "Movies/Bluray", value: 11 },
        { name: "Movies/Bluray-Full", value: 5 },
        { name: "Movies/Cam", value: 103 },
        { name: "Movies/DVD-R", value: 3 },
        { name: "Movies/MP4", value: 21 },
        { name: "Movies/Non-English", value: 22 },
        { name: "Movies/Packs", value: 13 },
        { name: "Movies/SD/x264", value: 44 },
        { name: "Movies/x265", value: 48 },
        { name: "Movies/XviD", value: 1 },
        { name: "TV/480p", value: 24 },
        { name: "TV/4K", value: 104 },
        { name: "TV/Bluray", value: 32 },
        { name: "TV/DVD-R", value: 31 },
        { name: "TV/DVD-Rip", value: 33 },
        { name: "TV/Mobile", value: 46 },
        { name: "TV/Non-English", value: 82 },
        { name: "TV/Packs", value: 14 },
        { name: "TV/SD/x264", value: 26 },
        { name: "TV/x264", value: 7 },
        { name: "TV/x265", value: 34 },
        { name: "TV/XviD", value: 2 },
        { name: "Nintendo", value: 10 },
        { name: "PC/Games", value: 4 },
        { name: "PS", value: 18 },
        { name: "PSP", value: 8 },
        { name: "Xbox", value: 9 },
        { name: "Music/Audio", value: 17 },
        { name: "Music/Flac", value: 27 },
        { name: "Music/Non-English", value: 23 },
        { name: "Music/Packs", value: 41 },
        { name: "Music/Video", value: 16 },
        { name: "Anime", value: 29 },
        { name: "Audio Books", value: 42 },
        { name: "Audio Books/NE", value: 105 },
        { name: "Books", value: 20 },
        { name: "Books/Non-English", value: 102 },
        { name: "Documentary", value: 30 },
        { name: "Educational", value: 95 },
        { name: "Fonts", value: 47 },
        { name: "Mac", value: 43 },
        { name: "Podcast", value: 45 },
        { name: "Softwa/Packs", value: 28 },
        { name: "Software", value: 12 },
        { name: "XXX/0Day", value: 19 },
        { name: "XXX/Movies", value: 6 },
        { name: "XXX/Packs", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "仅免费种子",
      key: "free",
      options: [{ name: "免费", value: "on" }],
      cross: { mode: "append", key: "" },
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/t",
      // 站点默认按标题+描述全文检索，显式指定 qf=ti 限定为标题检索
      params: { qf: "ti" },
      responseType: "document",
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          // 站点的 adv 搜索框可同时接受 imdb / tmdb 的 id
          requestConfig!.params.q = keywords!;
          requestConfig!.params.qf = "adv";
          return requestConfig!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params.q = keywords!;
          requestConfig!.params.qf = "adv";
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: {
        selector: "table.t1 > tbody > tr",
        filter: (rows: HTMLElement[] | null): HTMLElement[] | null =>
          Array.isArray(rows) ? rows.filter((row) => Sizzle('a[href^="/t/"]', row).length > 0) : rows,
      },
      id: {
        selector: 'a[href^="/t/"]',
        attr: "href",
        filters: [(query: string) => query.replace(/^\/t\//, "")],
      },
      title: { selector: 'a[href^="/t/"]' },
      url: { selector: 'a[href^="/t/"]', attr: "href" },
      link: { selector: 'a[href^="/download.php/"]', attr: "href" },
      // 类别展示随用户配置而异：优先 td.i.p 的文本，回落到图片 alt
      category: {
        selector: ["td.i.p", "a[href^='?'] img"],
        elementProcess: (el: HTMLElement) => el.getAttribute("alt") ?? (el.textContent ?? "").trim(),
      },
      subTitle: { selector: "td.al div.sub" },
      time: {
        selector: "td.al div.sub",
        elementProcess: (el: HTMLElement) => {
          // 形如 `Genre | 3 minutes ago`，取竖线后的相对时间
          const rawText = (el.innerText ?? el.textContent ?? "").replace(/\s+/g, " ").trim();
          const matched = rawText.match(/\|\s*(.+)$/);
          if (!matched) {
            // 表头等非种子行没有该结构
            return undefined;
          }
          const parsed = parseTimeToLiveToDate(matched[1].trim());
          if (typeof parsed !== "number") {
            return undefined;
          }
          // 站点按相对时间展示，此处换算成 UTC 墙上时间，配合 timezoneOffset: "+0000" 往返一致
          return new Date(parsed).toISOString().replace("T", " ").slice(0, 19);
        },
      },
      size: { selector: "td:nth-last-child(3)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-last-child(2)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-last-child(1)", filters: [{ name: "parseNumber" }] },
      // Jackett 以 `span:contains("FreeLeech")` 判定免费种子，这里沿用同一规则
      tags: [
        {
          // 站点公告（rules）规定下载后需保持分享率 1 以上且做种 72 小时，即全站 H&R
          name: "H&R",
          selector: "*",
          color: "red",
        },
        { name: "Free", selector: 'span:contains("FreeLeech")', color: "blue" },
      ],
    },
  },

  detail: {
    urlPattern: [/\/t\/[^/?#]+/],
    selectors: {
      title: { selector: ["h1", "html > body > title"] },
      link: { selector: 'a[href^="/download.php/"]', attr: "href" },
    },
  },

  list: [{ urlPattern: [/\/t(?:\?|$)/] }],

  /**
   * 站点用户信息页为 phpBB 模板改装，且登录页带 Cloudflare Turnstile，暂未做 userInfo 适配。
   * 站点公告（rules）给出的 H&R 规则：下载后需保持分享率 1 以上且做种 72 小时。
   */
  userInfo: {},
};
