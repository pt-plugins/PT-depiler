/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/rintornet.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * RinTor.NeT 是俄语成人（XXX）Tracker，站内全部内容都属于成人分区，
 * 所以这里按仓库惯例打上「成人 / XXX」标签，并对 `urls` / `legacyUrls` 做 rot13。
 *
 * 站点时间实测形如 `8-10-2026, 11:56`（俄语站惯例为 MSK / UTC+3），列表页无时区标注，
 * 这里按 Jackett YAML 的 `+03:00` 折算。
 */

/**
 * 列表页与详情页的地址都形如 `…/<id>-<slug>.html`，id 是**末段开头的数字**。
 *
 * 注意不要用 `/-(\d+)-/` 这种「任意位置的 -数字-」：slug 里还夹着 `…-love-8-…-2026-hd-1080p.html`，
 * 左起第一个匹配会取到 `8` / `2026`，导致不同种子拿到同一个错误 id。必须锚定末段开头。
 */
const idFromUrl = (href: string): string | number => {
  const slug = String(href).split(/[?#]/)[0].split("/").filter(Boolean).pop() ?? "";
  const matched = /^(\d+)-/.exec(slug)?.[1];
  return matched ? Number(matched) : href;
};

/** 详情页的 `span.entry__date` 只有日期（`08.10.2026`），按站点 MSK 的当日 00:00 折算 */
const parseDetailDate = (element: HTMLElement): number | undefined => {
  const matched = /(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(element.textContent ?? "");
  if (!matched) return undefined;
  return Date.UTC(Number(matched[3]), Number(matched[2]) - 1, Number(matched[1]), -3);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "rintornet",
  name: "RinTor.NeT",
  description: "RinTor.NeT 是一个俄语成人（XXX）公共 Tracker。",
  tags: ["成人", "XXX"],

  type: "public",

  urls: ["uggcf://jjj.evagbe.arg/", "uggcf://evagbe.arg/"],

  timezoneOffset: "+0300",

  search: {
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: {
        do: "search",
        subaction: "search",
        titleonly: 3,
        sortby: "date",
        resorder: "desc",
        showposts: 0,
      },
    },
    keywordPath: "params.story",
    selectors: {
      rows: { selector: "div.entry:has(div.entry__title)" },
      title: { selector: "div.entry__title > h3 > a" },
      url: { selector: "div.entry__title > h3 > a", attr: "href" },
      id: {
        selector: "div.entry__title > h3 > a",
        attr: "href",
        // 末段形如 `21971-rough-love-8-….html` -> 21971
        filters: [idFromUrl],
      },
      time: {
        selector: "span.entry__date",
        elementProcess: (element: HTMLElement) => {
          // `8-10-2026, 11:56` —— 日-月-年 时:分，MSK(UTC+3)
          const m = /(\d{1,2})-(\d{1,2})-(\d{4}),\s*(\d{1,2}):(\d{2})/.exec(element.textContent ?? "");
          if (!m) return undefined;
          return Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]) - 3, Number(m[5]));
        },
      },
      // 列表页不显示体积、做种数、下载数 —— 一律留空。
      // （Jackett 的 `size: "1 GB"` / `seeders: 1` / `leechers: 1` 是硬编码占位值，
      //   照抄会让每一行都显示「1 GB / 1 做种」，属于假数据，不采纳。）
    },
  },

  list: [{ urlPattern: ["/index.php", "/$"] }],

  detail: {
    urlPattern: ["-\\d+-[^/]+\\.html$"],
    selectors: {
      // 列表页只给详情页（`…-<id>-<slug>.html`），magnet 只有详情页里才有
      title: { selector: "h1.inner-entry__title" },
      // 与列表页共用同一套 id 规则，保证同一颗种子从两个入口进来是同一个 id
      id: { selector: ":self", elementProcess: (el: any) => el.URL || "", filters: [idFromUrl] },
      link: { selector: 'a[href^="magnet:"]', attr: "href" },
      // 详情页写的是 `8.87 Gb`，`parseSize` 只认 `GB` 形式，先归一化
      size: {
        selector: "b:contains('Размер') + font",
        filters: [
          (text: string) => (/^([\d.]+)\s*Gb$/i.test(text) ? `${text.replace(/Gb$/i, "")} GB` : text),
          { name: "parseSize" },
        ],
      },
      // 详情页只有日期（`08.10.2026`），解析成 MSK 当日 00:00；列表页才有 `8-10-2026, 11:56`
      time: { selector: "span.entry__date", elementProcess: parseDetailDate },
    },
  },
};
