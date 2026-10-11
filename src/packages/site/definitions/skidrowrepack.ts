/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/skidrowrepack.yml
 */
import { type ISiteMetadata } from "../types";

/** 详情页/列表页的 URL 都形如 <host>/<id>-<slug>.html，两处共用同一套 id 规则 */
const slugFromUrl = (q: string) => (q.replace(/\/+$/, "").split("/").pop() ?? "").replace(/\.html?$/i, "");

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "skidrowrepack",
  name: "SkidrowRepack",
  description: "SkidrowRepack is a Public Torrent Tracker for GAMES",
  tags: ["Games"],

  type: "public",
  urls: ["https://skidrowrepack.com/"],

  search: {
    // 真机验证：GET /index.php?do=search... 会被 Cloudflare 挡成 403（"Just a moment..."），
    // 同样的参数改用 POST（application/x-www-form-urlencoded）即 200 并正确按关键词过滤。
    // Jackett 的 inputs 原样搬进 body，只把关键词换成 params.story（keywordPath 指向它）。
    keywordPath: "params.story",
    requestConfig: {
      url: "/index.php",
      method: "POST",
      responseType: "document",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        // DLE 搜索表单的固定参数（首页 <form> 里就是这些 input），关键词由 keywordPath 写入 story
        do: "search",
        subaction: "search",
        search_start: 0,
        full_search: 1,
        result_from: 1,
        showposts: 1,
        searchdate: 0,
        sortby: "date",
        resorder: "desc",
      },
    },
    selectors: {
      // 列表页 DLE 卡片 <div class="mov tcarusel-item">
      rows: { selector: "div.mov" },
      id: { selector: "a.mov-t", attr: "href", filters: [slugFromUrl] },
      title: { selector: "a.mov-t" },
      url: { selector: "a.mov-t", attr: "href" },
      // 列表页卡片不带日期/体积/做种数，全部留空
      // （Jackett 的 date: now / "4 GB" / 1 / 1 是硬编码占位，不照抄）
    },
  },

  detail: {
    // 详情页形如 https://skidrowrepack.com/28-hitman-2-gold-edition.html
    urlPattern: ["^https?://skidrowrepack\\.com/\\d+-[\\w-]+\\.html?$"],
    requestConfig: { responseType: "document" },
    selectors: {
      title: { selector: "h1" },
      // 与搜索页共用同一套 id 规则，保证两处进入详情时 id 一致
      id: { selector: ":self", elementProcess: (el: any) => el.URL || "", filters: [slugFromUrl] },
      // "Download .torrent" -> https://skidrowrepack.com/index.php?do=download&id=25（服务端下发 .torrent）
      link: { selector: "a.dwn-load", attr: "href" },
      // <time datetime="2020-07-27T17:31:25" itemprop="datePublished">：ISO 串**不带偏移**，
      // 站点也没声明 timezoneOffset，所以按仓库既有惯例交给 parseTime（原样走 Date 构造，
      // 即按**运行主机**本地时区解释）。这与 clearjav / rousipro 等既有定义的写法一致，
      // 但严格说结果会随用户时区平移 —— 属于平台级口径问题，此处不单独 hack。
      time: { selector: "time[datetime]", attr: "datetime", filters: [{ name: "parseTime" }] },
      // size / seeders / leechers / category：详情页没有，留空
    },
  },
};
