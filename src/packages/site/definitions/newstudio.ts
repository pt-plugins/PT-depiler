/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/newstudio.yml
 */
import { type ISiteMetadata } from "../types";

/** NewStudio 结果页日期为 `13-Sep-24, 18:20`（也可能是 Jackett 记录的 Today/Сегодня 写法），统一成可被 Date 解析的墙上时间 */
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

const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad2 = (n: number) => String(n).padStart(2, "0");

const normalizeNewStudioDate = (query: string): string => {
  const s = String(query ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/Янв|Фев|Мар|Апр|Май|Июн|Июл|Авг|Сен|Окт|Ноя|Дек/g, (m) => ruMonths[m]);

  // Jackett 中记录过 "Today 01:34" / "Сегодня 12:34" 这类相对时间（本次抓取未出现，属未验证分支）
  const relative = s.match(/^(Today|Сегодня|Yesterday|Вчера)\s+(\d{1,2}):(\d{2})$/);
  if (relative) {
    const date = new Date();
    if (relative[1] === "Yesterday" || relative[1] === "Вчера") {
      date.setDate(date.getDate() - 1);
    }
    return `${pad2(date.getDate())} ${enMonths[date.getMonth()]} ${pad2(date.getFullYear() % 100)} ${relative[2]}:${relative[3]}:00`;
  }

  // "13-Sep-24, 18:20" → "13 Sep 24 18:20:00"
  const parts = s.replace(/[,-]/g, " ").replace(/\s+/g, " ").trim().split(" ");
  if (parts.length !== 4) {
    return s;
  }
  const [day, month, year, time] = parts;
  return `${day} ${month} ${year} ${time.length === 5 ? `${time}:00` : time}`;
};

/** 详情页的注册时间形如 `2024-01-17 22:55`（站点墙上时间 = MSK）。
 *  transformDetailPage 不会套用 metadata.timezoneOffset，所以这里显式按 +03:00 换算成时间戳。 */
const parseNewStudioDetailDate = (query: string): number | string => {
  const matched = String(query ?? "").match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!matched) {
    return query;
  }
  const [, year, month, day, hour, minute, second = "00"] = matched;
  return +new Date(`${year}-${month}-${day}T${hour.padStart(2, "0")}:${minute}:${second}+03:00`);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "newstudio",
  name: "NewStudio",
  aka: ["NewStudio", "НьюСтудио"],
  description: "NewStudio 是俄语公开影视站，主要提供俄语配音的剧集资源，无需注册",
  tags: ["TV"],

  type: "public",
  urls: ["https://newstudio.tv/"],
  legacyUrls: ["http://newstudio.tv/"],

  timezoneOffset: "+0300", // MSK
  requestDelay: 2000, // Jackett 定义中为 requestDelay: 2（秒），本站对请求频率较敏感

  search: {
    keywordPath: "params.nm",
    requestConfig: {
      url: "/tracker.php",
      responseType: "document",
      params: { o: 1, s: 2 }, // Jackett 默认排序：created / desc
    },
    selectors: {
      // 站点返回的 HTML 里 <tr> 直接挂在 <table> 下（无 tbody），用后代选择器在浏览器与 linkedom 下都能命中
      rows: { selector: 'table.well tr:has(a[href^="./viewtopic.php?t="])' },
      id: {
        selector: 'a[href^="./viewtopic.php?t="]',
        attr: "href",
        filters: [(q: string) => q.match(/[?&]t=(\d+)/)?.[1]],
      },
      title: { selector: 'a[href^="./viewtopic.php?t="] > b' },
      url: { selector: 'a[href^="./viewtopic.php?t="]', attr: "href" },
      link: { selector: 'a[href^="./download.php?id="]', attr: "href" },
      size: { selector: "td:nth-child(5) > a", filters: [{ name: "parseSize" }] },
      time: { selector: "td:nth-child(6)", filters: [normalizeNewStudioDate] },
    },
  },

  list: [
    {
      urlPattern: ["/tracker.php"],
      selectors: {
        keywords: { selector: 'input[name="nm"]', attr: "value" },
      },
    },
  ],

  // 详情页 `viewtopic.php?t=<id>`（实测 https://newstudio.tv/viewtopic.php?t=47090 与 ?t=46571）：
  // - 标题在 `<h5 class="accordion-toggle"><a href="viewtopic.php?t=...">`，与列表页的 `<b>` 同一段文本
  //   （列表页 `<wbr>` 之外的部分）；
  // - 下载链接是 `download.php?id=<附件id>`（详情页不带 `./` 前缀，与列表页不同）；
  // - 体积、注册时间在种子信息面板里：`<span class="add-on">Size:</span> ... <span class="add-on"><b>3.83 GB</b></span>`
  //   与 `<span class="add-on">Registered [ <span title="2 years 8 months">2024-01-17 22:55</span> ]`；
  //   注意同一面板里还有一个 `19 KB`（.torrent 文件本身的大小），所以体积必须限定在 Size: 那一行里取；
  // - 站点不在详情页展示做种/下载数（也没有分类），故这些字段留空。
  detail: {
    urlPattern: ["viewtopic\\.php\\?t="],
    selectors: {
      title: { selector: 'h5.accordion-toggle > a[href^="viewtopic.php?t="]' },
      id: {
        selector: 'h5.accordion-toggle > a[href^="viewtopic.php?t="]',
        attr: "href",
        filters: [(q: string) => q.match(/[?&]t=(\d+)/)?.[1]],
      },
      link: { selector: 'a[href^="download.php?id="]', attr: "href" },
      size: {
        selector: "div.input-prepend:has(span.add-on:contains('Size:')) span.add-on > b",
        filters: [{ name: "parseSize" }],
      },
      time: { selector: "span.add-on:contains('Registered') span[title]", filters: [parseNewStudioDetailDate] },
    },
  },
};
