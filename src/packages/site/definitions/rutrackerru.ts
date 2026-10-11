/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/rutracker-ru.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * 注意：本仓库已有的 `rutracker` 定义对应 rutracker.org，与本定义的 rutracker.ru 不是同一个站点。
 * 站点使用 TorrentPier II 引擎，结果页 `tr[id^="tor_"]` 共 10 个 td：
 * 1 图标 / 2 状态图标 / 3 版块 / 4 标题 / 5 发布者 / 6 体积 / 7 S / 8 L / 9 C(回复) / 10 发布时间
 */
/** 英文月份缩写（详情页日期 `03-Apr-2025 15:07`）→ 两位月份数字 */
const enMonths: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

/** 详情页首帖的发布时间形如 `03-Apr-2025 15:07`（MSK 墙上时间）。
 *  实测与列表页 `td:last-child > u` 的 Unix 时间戳完全一致（t=206839：`03-Apr-2025 15:07` == 1743682047）。
 *  transformDetailPage 不会套用 metadata.timezoneOffset，所以这里显式按 +03:00 换算成时间戳。 */
const parseRuTrackerDetailDate = (query: string): number | string => {
  const matched = String(query ?? "").match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (!matched) {
    return query;
  }
  const [, day, monthName, year, hour, minute] = matched;
  const month = enMonths[`${monthName[0].toUpperCase()}${monthName.slice(1).toLowerCase()}`];
  if (!month) {
    return query;
  }
  return +new Date(`${year}-${month}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:00+03:00`);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "rutrackerru",
  name: "RuTracker.RU",
  aka: ["RuTracker.RU", "RuTracker RU"],
  description: "RuTracker.RU 是俄语公开 BT 站点（TorrentPier II 引擎），提供电影 / 剧集 / 综合资源，无需注册",
  tags: ["Movies", "TV"],

  type: "public",
  urls: ["http://rutracker.ru/"], // 站点不支持 https

  timezoneOffset: "+0300", // MSK

  search: {
    keywordPath: "params.nm",
    requestConfig: {
      url: "/tracker.php",
      responseType: "document",
      params: {},
      // 站点对非浏览器 UA 直接返回 403（实测无 UA / axios UA 均为 403，Chrome UA 为 200）；
      // 浏览器扩展中该 header 会经 declarativeNetRequest 注入，不会被丢弃
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    },
    selectors: {
      rows: { selector: 'tr[id^="tor_"]:has(a[href^="magnet:?xt="])' },
      id: {
        selector: 'a[href^="./viewtopic.php?t="]',
        attr: "href",
        filters: [(q: string) => q.match(/[?&]t=(\d+)/)?.[1]],
      },
      title: { selector: 'a[href^="./viewtopic.php?t="]' },
      url: { selector: 'a[href^="./viewtopic.php?t="]', attr: "href" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      // td6 内的 <u> 是精确字节数，Jackett 的 size 字段同样取它
      size: { selector: "td:nth-child(6) > u", filters: [{ name: "parseNumber" }] },
      time: { selector: "td:last-child > u" }, // unix 秒级时间戳，由 parseTimeWithZone 直接换算
      seeders: { selector: "td.seedmed > b" },
      leechers: { selector: "td.leechmed > b" },
      // 第 9 列表头为 C、单元格 title 为 "Replies"，是回复数而非 Jackett 所称的 grabs
      comments: { selector: "td:nth-child(9)" },
    },
  },

  list: [
    {
      urlPattern: ["/tracker.php"],
      selectors: {
        keywords: { selector: "input#title_search", attr: "value" },
      },
    },
  ],

  // 详情页 `viewtopic.php?t=<id>`（实测 t=206839 / 168020 / 169567）：
  // - 标题在 `<h1 class="maintitle"><a class="tt-text" href="viewtopic.php?t=...">`，与列表页同一个标题串；
  // - id 就取这个链接的 `t=`（与列表页从 `./viewtopic.php?t=` 取的 id 相同）；
  // - 发布时间取首帖 `.post_head` 里的 `a.small`（`03-Apr-2025 15:07`，已核对与列表页的 Unix 时间戳一致）。
  // - 站点对游客不展示种子下载：viewtopic 页里既没有 magnet 也没有 .torrent 直链，
  //   页脚只有「You cannot download files in this forum」（三个页面实测 magnet/btih 均为 0），
  //   因此 link 留空 —— 下载链接只能在 tracker.php 列表页拿到（那里的 selectors.link 已配有 magnet）。
  detail: {
    urlPattern: ["viewtopic\\.php\\?t="],
    selectors: {
      title: { selector: "h1.maintitle a.tt-text" },
      id: {
        selector: "h1.maintitle a.tt-text",
        attr: "href",
        filters: [(q: string) => q.match(/[?&]t=(\d+)/)?.[1]],
      },
      time: { selector: "div.post_head a.small", filters: [parseRuTrackerDetailDate] },
    },
  },
};
