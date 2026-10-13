/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/vsthouse.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * 站点时间：详情页最新的评论写着 `13.10.2026 16:03`，而抓取时 UTC 才 14:47 —— 页面用的是 MSK(+0300)。
 * （评论时间晚于 UTC 当前时间，不可能是 UTC；俄语站 +0300 也符合 Jackett 的 ` +03:00` 注释。）
 */
const SITE_TZ_HOURS = 3;

/** 列表页 `div.eDetails` 结尾的 `2018-07-31 19:00:39`（面包屑后面那一截） */
function parseListTime(text: string): number {
  const match = /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/.exec(String(text));
  return match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4] - SITE_TZ_HOURS, +match[5], +match[6]) : 0;
}

/**
 * 详情页标题下方 `02.06.2018, 12:12`。
 * 注意这一栏是「收录时间」，而列表页给的 `2018-07-31 19:00:39` 是「最后修改时间」，两者本就不等。
 */
function parseDetailTime(text: string): number {
  const match = /(\d{2})\.(\d{2})\.(\d{4}),?\s+(\d{2}):(\d{2})/.exec(String(text));
  return match ? Date.UTC(+match[3], +match[2] - 1, +match[1], +match[4] - SITE_TZ_HOURS, +match[5]) : 0;
}

/** 详情页地址形如 `/load/<大类>/<子类>/<slug>/<catId>-1-0-<id>`，末尾数字就是条目 id */
const detailIdFromHref = (href: string) => /-(\d+)$/.exec(String(href))?.[1];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "vsthouse",
  name: "VSTHouse",
  description: "VSTHouse 是俄语公开站，分享音乐制作相关的 VST 插件、音源、采样与软件（uCoz 文件目录）",
  tags: ["软件"],

  type: "public",
  urls: ["https://vsthouse.ru/"],
  legacyUrls: ["http://vsthouse.ru/", "https://vsthouse.org/"],

  timezoneOffset: "+0300",

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/search/",
      responseType: "document",
      params: { m: "load", t: 0 },
      // uCoz 的站内搜索会校验 Referer：直接请求 /search/?q=… 会被 403
      // （错误页 "Search from the site's pages"，与 cookie 无关 —— 实测只要带上 Referer 就能 200）
      headers: { Referer: "https://vsthouse.ru/" },
    },
    selectors: {
      rows: { selector: 'table.eBlock:has(div.eDetails:contains(":"))' },
      id: { selector: "div.eTitle a", attr: "href", filters: [detailIdFromHref] },
      title: { selector: "div.eTitle a" },
      url: { selector: "div.eTitle a", attr: "href" },
      // 面包屑 "Каталог файлов » Сэмплы, пресеты » Пресеты" 的最后一级是叶子分类
      category: { selector: "div.eDetails a:last" },
      time: { selector: "div.eDetails", filters: [parseListTime] },
      // 列表页只有被截断的描述（"Размер: …" 也被截掉了），种子链接要进详情页取；
      // 站上没有做种/下载/完成人数，留空
    },
  },

  list: [
    {
      urlPattern: ["/search"],
      selectors: {
        keywords: { selector: 'input[name="q"]', attr: "value" },
      },
    },
  ],

  // 详情页 /load/<大类>/<子类>/<slug>/<catId>-1-0-<id>：列表页没有下载链接，它在详情页的「Скачать:」上
  detail: {
    urlPattern: ["/load/[^/]+/[^/]+/[^/]+/\\d+-\\d+-\\d+-\\d+"],
    selectors: {
      // 评分控件的 id 里嵌着条目 id（uStarRating22014），与列表页链接末尾的 id 一致
      id: {
        selector: 'ul[id^="uStarRating"]',
        attr: "id",
        filters: [(id: string) => /(\d+)/.exec(String(id))?.[1]],
      },
      title: { selector: "div.eTitle" },
      // 详情页的「Категория: Синтезаторы, сэмплеры」行（`span:contains('Категория:')` 命中的第一个）；
      // 搜索链路收尾时框架会对 category 跑 tryToNumber，把逗号与空格一并去掉，
      // 这里做同样的归一化，保证同一颗种子从两个入口拿到同一个分类值
      category: {
        selector: ["span:contains('Категория:')"],
        filters: [
          (q: string) =>
            String(q)
              .replace(/^.*Категория:\s*/, "")
              .trim(),
          (q: string) => q.replace(/[, ]/g, ""),
        ],
      },
      // 该链接会 302 到真实的 .torrent（/_ld/<n>/<id>_name.torrent）
      link: { selector: 'a[title^="Скачать:"]', attr: "href" },
      time: { selector: 'div.eTitle + table.eBlock td[align="right"]', filters: [parseDetailTime] },
    },
  },
};
