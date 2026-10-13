/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/bigfangroup.yml
 */
import { type ISiteMetadata } from "../types";

const RU_MONTHS: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

/**
 * 站点的日期一律写作 `10 мая 2013 в 12:02:40`（俄语月份名，无偏移），显式用 Date.UTC 换算，
 * 不依赖运行主机时区。
 *
 * ⚠️ 时区取 **UTC（+0000）**，与 Jackett 不同：Jackett 的 date 字段是先拼上 ` +03:00`（注释 `# MSK`）
 * 再用 `d MMMM yyyy HH:mm:ss zzz` 解析的，但 2026-10-13 实测下来站点显示的墙上时间就是 UTC：
 *   · 抓取时刻的响应头 `date: Tue, 13 Oct 2026 14:52:46 GMT` 与本机 UTC 一致（服务器绝对时钟正确，
 *     且 `cf-cache-status: DYNAMIC` / `cache-control: no-cache` 说明响应不是 CDN 缓存）；
 *   · 当时全站最新一条是 `13 октября 2026 в 14:31:12`，即站点显示时间与 UTC 相同；
 *   · `browse.php?ajax=1&year=1` 第 1 页 30 条全是当天，时间 04:11→14:31 严格降序，相邻间隔最大 95 分钟。
 *     若按 MSK 理解，就意味着从 14:31 MSK（=11:31 UTC）起连续 3 小时 20 分以上没有任何上传，
 *     而当天其余时段的节奏是每小时 2~3 条；按 UTC 理解则最新一条只比抓取时刻早 21 分钟。
 * 若以后确认站点其实是 MSK，只需把下面的 `siteHour`（= 站点墙上时间减去与 UTC 的时差小时数）从 `+m[4]`
 * 改回 `+m[4] - 3`。
 */
const RU_DATETIME_TO_UTC = (q: string): number => {
  const m = /^(\d{1,2})\s+([а-яё]+)\s+(\d{4})\s+в\s+(\d{1,2}):(\d{2}):(\d{2})$/i.exec(String(q).trim());
  if (!m) return 0;
  const month = RU_MONTHS[m[2].toLowerCase()];
  if (typeof month !== "number") return 0;
  const siteHour = +m[4]; // 站点墙上时间的小时；若站点是 MSK 则为 `+m[4] - 3`
  return Date.UTC(+m[3], month, +m[1], siteHour, +m[5], +m[6]);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "bigfangroup",
  name: "BigFANGroup",
  description: "BigFANGroup 是一个俄语公开 BT 站（Kinokpk 引擎），以电影 / 剧集为主，无需登录即可浏览",

  type: "public",
  urls: ["https://bigfangroup.org/", "https://www.freebfg.org/"],

  // 站点显示的墙上时间实测就是 UTC（依据见文件顶部 RU_DATETIME_TO_UTC 的注释）；public 站默认也是 +0000
  timezoneOffset: "+0000",

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: { ajax: 1, cat: 0, incldead: 1, year: 0, format: 0, s: "added", d: "desc" },
    },
    // Jackett 在没有关键词时把参数换成只剩 `ajax=1&year=1`（= 全站最新列表，同一套表格结构）
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords) {
        requestConfig!.params = { ajax: 1, year: 1 };
      }
      return requestConfig!;
    },
    selectors: {
      // 表格的种子行都在 <tbody id="highlighted"> 里；`:has(a[href^="browse.php?cat="])` 是 Jackett 的过滤
      rows: { selector: 'table > tbody#highlighted > tr:has(a[href^="browse.php?cat="])' },
      // 列序（空浏览时）：1 类型 / 2 名称 / 3 空 / 4 时间 / 5 评论 / 6 体积 / 7 做种 / 8 下载 / 9 发布者
      id: {
        selector: 'a[href^="details.php?id="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      // 站点的标题在 <acronym title="完整名">被截断的短名…</acronym> 里，
      // Jackett 取的是被截断的文本；这里优先拿 acronym 的 title（完整名），取不到再回落到行文本
      title: {
        selector: 'a[href^="details.php?id="]',
        elementProcess: (el: HTMLElement) =>
          el.querySelector("acronym")?.getAttribute("title") || el.textContent?.trim() || undefined,
      },
      url: { selector: 'a[href^="details.php?id="]', attr: "href" },
      category: {
        selector: 'a[href^="browse.php?cat="]',
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }],
      },
      size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(7)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(8)", filters: [{ name: "parseNumber" }] },
      // 第 5 列是「Комментарии」（表头可证），对应 ITorrent 的 comments，不是 completed
      comments: { selector: "td:nth-child(5)", filters: [{ name: "parseNumber" }] },
      // 时间只挂在 <img src="pic/time.png" title="…"> 的 title 上
      time: { selector: 'img[src="pic/time.png"]', attr: "title", filters: [RU_DATETIME_TO_UTC] },
      author: { selector: "td:nth-child(9)" },
      // 列表页不显示完成数（站点本身也没有这个字段），留空；下载链接在详情页，交给 detail.selectors.link
    },
  },

  // 详情页 /details.php?id=<数字>，静态 HTML（未登录可访问）
  detail: {
    urlPattern: ["/details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: "h1" },
      // 与列表页同源：/download.php?id=<同一个数字>
      id: {
        selector: ["h1 a.index", 'a[href^="/download.php?id="]'],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      // 站内没有 magnet，下载走 /download.php?id=<id>（实测直接返回 application/x-bittorrent）
      link: { selector: ["h1 a.index", 'a[href^="/download.php?id="]'], attr: "href" },
      // 详情页是「标签 td.heading + 值 td」的两列表格，用相邻兄弟选择器取值
      time: {
        selector: 'td.heading:contains("Добавлен") + td',
        filters: [RU_DATETIME_TO_UTC],
      },
      // 「Размер」写成 `22.11 GB (23,744,037,044 байт)`，括号里是精确字节数，优先用它
      size: {
        selector: 'td.heading:contains("Размер") + td',
        filters: [
          (q: string) => {
            const exact = /\(([\d\s,]+)\s*байт\)/i.exec(q);
            if (exact) return Number(exact[1].replace(/[^\d]/g, ""));
            return q.replace(/\([^)]*\)/g, "");
          },
          { name: "parseSize" },
        ],
      },
      category: {
        selector: 'td.heading:contains("Тип") + td a',
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }],
      },
      // 详情页对游客不显示做种 / 下载数，留空
    },
  },
};
