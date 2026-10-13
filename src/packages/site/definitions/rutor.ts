/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/rutor.yml
 */
import { type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils/filesize";

/** RuTor 结果页的日期是俄语月份缩写（如 `26 Сен 26`），date-fns 默认 en 语言无法解析，先归一化为英语 */
const ruMonths: Record<string, string> = {
  Янв: "Jan",
  Фев: "Feb",
  Мар: "Mar",
  Апр: "Apr",
  Май: "May",
  Июн: "Jun",
  Июл: "Jul",
  Авг: "Aug",
  Сен: "Sep",
  Окт: "Oct",
  Ноя: "Nov",
  Дек: "Dec",
};

/** 归一化 `26&nbsp;Сен&nbsp;26` → `26 Sep 26`，交由 parseTimeWithZone 按站点时区（MSK）换算 */
const normalizeRuDate = (query: string): string => {
  const [day, month, year] = String(query ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  return `${day ?? ""} ${ruMonths[month ?? ""] ?? month ?? ""} ${year ?? ""}`.trim();
};

/** 详情页「Размер」形如 `265.94 GB  (285546727791 Bytes)`：括号里是精确字节数。
 *  整串直接丢给 parseSize 会因正则贪婪匹配到 `Bytes` 的 B 而算错，所以优先取括号里的数字，
 *  取不到再退回解析前面的 `265.94 GB`。 */
const parseRuTorSize = (query: string): number => {
  const text = String(query ?? "");
  const bytes = text.match(/\((\d+)\s*Bytes?\)/i)?.[1];
  if (bytes) {
    return Number(bytes);
  }
  const humanReadable = text.match(/[\d.]+\s*[ZEPTGMK]i?B/i)?.[0];
  return humanReadable ? parseSizeString(humanReadable) : 0;
};

/** 详情页「Добавлен」形如 `09-07-2026 19:21:39  (3 месяца назад)`：站点墙上时间是 MSK（UTC+3）。
 *  transformDetailPage 不会套用 metadata.timezoneOffset，所以这里显式按 +03:00 换算成时间戳。 */
const parseRuTorDetailDate = (query: string): number | string => {
  const matched = String(query ?? "").match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (!matched) {
    return query;
  }
  const [, day, month, year, hour, minute, second] = matched;
  return +new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "rutor",
  name: "RuTor",
  aka: ["RuTor", "Рутор"],
  description: "RuTor 是俄语公开 BT 站点，提供电影 / 剧集 / 综合资源，免费下载无需注册",
  tags: ["Movies", "TV"],

  type: "public",
  urls: ["https://rutor.info/", "https://rutor.is/"],
  legacyUrls: ["http://6tor.org/", "http://rutor.info/", "http://rutor.is/"],

  timezoneOffset: "+0300", // MSK

  search: {
    // 关键词实际写进 URL 路径，见 requestConfigTransformer
    keywordPath: "params.keywords",
    requestConfig: {
      url: "/search/0/0/100/0/",
      responseType: "document",
      params: {},
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // 站点结构：/search/{section}/{sort}/{searchtype}/{sort}/{keywords}/
      // 100 = 按标题搜索；0 = 按创建时间倒序（Jackett 的 sort 默认值）
      delete requestConfig!.params?.keywords;
      requestConfig!.url = `/search/0/0/100/0/${encodeURIComponent(keywords ?? "")}/`;
      return requestConfig!;
    },

    selectors: {
      rows: { selector: 'tr:has(td:has(a[href^="magnet:?xt="]))' },
      id: {
        selector: 'td:nth-of-type(2) a[href^="/torrent/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/torrent\/(\d+)/)?.[1]],
      },
      title: { selector: 'td:nth-of-type(2) a[href^="/torrent/"]' },
      url: { selector: 'td:nth-of-type(2) a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      // 体积所在 td 的列号不固定（部分行有额外的评论列），故按内容定位
      size: {
        selector: [
          "td:contains(\u00a0TB)",
          "td:contains(\u00a0GB)",
          "td:contains(\u00a0MB)",
          "td:contains(\u00a0kB)",
          "td:contains(\u00a0B)",
        ],
        filters: [{ name: "parseSize" }],
      },
      time: { selector: "td:nth-of-type(1)", filters: [normalizeRuDate] },
      seeders: { selector: "td span.green" },
      leechers: { selector: "td span.red" },
    },
  },

  list: [
    {
      urlPattern: ["/search/"],
      selectors: {
        keywords: { selector: "input#inputtext_id", attr: "value" },
      },
    },
  ],

  // 详情页 `/torrent/<id>/<slug>/`（实测 https://rutor.info/torrent/1098254/... 与 /torrent/1085666/...）：
  // - <h1> 是完整标题；
  // - `#download` 块里同时有 magnet 和 `//d.rutor.info/download/<id>` 的 .torrent 直链，
  //   这里与列表页保持一致取 magnet（列表页 selectors.link 取的就是 magnet）；
  // - id 取 `#download` 里 .torrent 直链的 `<id>`，与列表页从 `/torrent/<id>/` 取的 id 相同；
  // - 其他字段都在 `<table id="details">` 的 `<tr><td class="header">标签</td><td>值</td></tr>` 行里：
  //   Раздают(做种) / Качают(下载) / Добавлен(发布时间) / Размер(体积)。
  //   注意这些行在页面上是固定的俄文标签，且详情页时间与列表页不同：这里是绝对时间而非 `26 Сен 26`。
  detail: {
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      title: { selector: "h1" },
      id: {
        selector: '#download a[href*="/download/"]',
        attr: "href",
        filters: [(q: string) => q.match(/\/download\/(\d+)/)?.[1]],
      },
      link: { selector: '#download a[href^="magnet:?xt="]', attr: "href" },
      time: {
        selector: 'table#details tr:has(td.header:contains("Добавлен")) > td:nth-child(2)',
        filters: [parseRuTorDetailDate],
      },
      size: {
        selector: 'table#details tr:has(td.header:contains("Размер")) > td:nth-child(2)',
        filters: [parseRuTorSize],
      },
      seeders: { selector: 'table#details tr:has(td.header:contains("Раздают")) > td:nth-child(2)' },
      leechers: { selector: 'table#details tr:has(td.header:contains("Качают")) > td:nth-child(2)' },
    },
  },
};
