/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/sosulki.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * sosulki 是俄语成人（XXX）Tracker（DataLife Engine 模板），站内全部内容属于成人分区，
 * 因此按仓库惯例打「成人 / XXX」标签并对 `urls` / `legacyUrls` 做 rot13。
 *
 * 列表页时间实测形如 `10-10-2026 23:48:32`（俄语站惯例 MSK / UTC+3，页面无时区标注）。
 */
export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "sosulki",
  name: "sosulki",
  description: "sosulki 是一个俄语成人（XXX）公共 Tracker。",
  tags: ["成人", "XXX"],

  type: "public",

  urls: ["uggcf://fbfhyxv.obfx.pp/"],

  legacyUrls: ["uggc://fbfhyxv.arg/", "uggc://fbfhyxv.pbz/", "uggcf://fbfhyxv.pbz/", "uggcf://fbfhyxv.uybz.eh/"],

  timezoneOffset: "+0300",

  search: {
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: {
        do: "search",
        subaction: "search",
        search_start: 0,
        full_search: 1,
        result_from: 1,
        titleonly: 3,
        catlist: [0],
        searchdate: 0,
        resorder: "desc",
      },
    },
    keywordPath: "params.story",
    selectors: {
      rows: { selector: "tr.fr_viewn_in" },
      category: {
        selector: 'img[src^="/templates/freewhite/img/"]',
        attr: "src",
        // `/templates/freewhite/img/77.png` -> 77（站点分类图标编号）
        filters: [(src: string) => Number(/(\d+)\.\w+$/.exec(src)?.[1]) || src],
      },
      title: { selector: "td.titlelast a", attr: "title" },
      url: { selector: "td.titlelast a", attr: "href" },
      id: {
        selector: "td.titlelast a",
        attr: "href",
        // `…/474998-fragmenty-lyubvi-….html` -> 474998
        filters: [(href: string) => Number(/[/-](\d+)-[^/]*$/.exec(href)?.[1]) || href],
      },
      time: {
        selector: "td.titlelast i",
        elementProcess: (element: HTMLElement) => {
          // `10-10-2026 23:48:32` —— 日-月-年 时:分:秒，MSK(UTC+3)
          const m = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/.exec(element.textContent ?? "");
          if (!m) return undefined;
          return Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]) - 3, Number(m[5]), Number(m[6]));
        },
      },
      size: { selector: "td.frs" },
      seeders: { selector: "td.frsl_s" },
      leechers: { selector: "td.frsl_p" },
    },
  },

  list: [{ urlPattern: ["/index.php", "/lastnews", "/porno/"] }],

  detail: {
    urlPattern: ["-\\d+-[^/]+\\.html$", "/porno/"],
    selectors: {
      title: { selector: "h1" },
      // 与列表页共用同一套 id 规则（地址末段的 `<id>-<slug>`），
      // 否则详情页会回落到整条 URL，同一颗种子会有两个 id
      id: {
        selector: ":self",
        elementProcess: (el: any) => el.URL || "",
        filters: [(href: string) => Number(/[/-](\d+)-[^/]*$/.exec(href)?.[1]) || href],
      },
      // magnet 只在详情页（`.fr_download` 的“Магнет ссылка”）；同页另有一个 .torrent 下载链接。
      // 注意：实测该站 magnet 里的 infohash 已在上游损坏（含 U+FFFD），回落用 .torrent 链接
      link: { selector: ['a[href^="magnet:"]', 'a[href^="/engine/download.php"]'], attr: "href" },
    },
  },
};
