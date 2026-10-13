/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/noname-club.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * NoNaMe Club（NNM-Club），TorrentPier 系 phpBB 站点。
 * 结果行共 10 个 td：1 图标 / 2 版块 / 3 标题 / 4 发布者 / 5 下载 / 6 体积 / 7 S / 8 L / 9 浏览 / 10 发布时间。
 * 注意：站点以 windows-1251 返回 HTML，选择器不受影响，但标题文本需要调用方按该编码解码。
 */

/** 俄语月份缩写（`25 Сен 2026 22:44:19`）→ 两位月份数字 */
const ruMonths: Record<string, string> = {
  Янв: "01",
  Фев: "02",
  Мар: "03",
  Апр: "04",
  Май: "05",
  Июн: "06",
  Июл: "07",
  Авг: "08",
  Сен: "09",
  Окт: "10",
  Ноя: "11",
  Дек: "12",
};

/** 详情页「Зарегистрирован」形如 `25 Сен 2026 22:44:19`：站点墙上时间是 MSK（UTC+3）。
 *  transformDetailPage 不会套用 metadata.timezoneOffset，所以这里显式按 +03:00 换算成时间戳。 */
const parseNoNaMeDetailDate = (query: string): number | string => {
  const matched = String(query ?? "").match(
    /(\d{1,2})\s+([А-Яа-яЁё]{3})[А-Яа-яЁё]*\s+(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/,
  );
  if (!matched) {
    return query;
  }
  const [, day, monthName, year, hour, minute, second = "00"] = matched;
  const month = ruMonths[`${monthName[0].toUpperCase()}${monthName.slice(1).toLowerCase()}`];
  if (!month) {
    return query;
  }
  return +new Date(`${year}-${month}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:${second}+03:00`);
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "nonameclub",
  name: "NoNaMe Club",
  aka: ["NNM-Club", "NoNaMe Club", "nnmclub"],
  description: "NoNaMe Club (NNM-Club) 是俄语公开 BT 站点，提供电影 / 剧集 / 音乐等综合资源，无需注册",
  tags: ["Movies", "TV", "Music"],

  type: "public",
  urls: ["https://nnmclub.to/"],
  legacyUrls: ["https://nnm-club.name/", "https://nnm-club.me/", "http://nnmclub.to/"],

  timezoneOffset: "+0300", // MSK

  search: {
    keywordPath: "params.nm",
    requestConfig: {
      url: "/forum/tracker.php", // 站点根目录下的 /tracker.php 为 404
      responseType: "document",
      params: { o: 1, s: 2 }, // Jackett 默认排序：created / desc
    },
    selectors: {
      rows: {
        selector: 'table.forumline.tablesorter tr:has(a[href^="viewtopic.php?t="]):has(a[href^="download.php?id="])',
      },
      id: {
        selector: 'a[href^="viewtopic.php?t="]',
        attr: "href",
        filters: [(q: string) => q.match(/[?&]t=(\d+)/)?.[1]],
      },
      title: { selector: 'a[href^="viewtopic.php?t="] > b' },
      url: { selector: 'a[href^="viewtopic.php?t="]', attr: "href" },
      link: { selector: 'a[href^="download.php?id="]', attr: "href" },
      // td6 内的 <u> 是精确字节数（Jackett 的 size 字段同样取它）
      size: { selector: "td:nth-child(6) > u", filters: [{ name: "parseNumber" }] },
      time: { selector: "td:last-child > u" }, // unix 秒级时间戳，与页面显示的 MSK 时间一致
      seeders: { selector: "td.seedmed > b" },
      leechers: { selector: "td.leechmed > b" },
    },
  },

  list: [
    {
      urlPattern: ["/forum/tracker.php"],
      selectors: {
        keywords: { selector: "input#nm", attr: "value" },
      },
    },
  ],

  // 详情页 `viewtopic.php?t=<id>`（实测 https://nnmclub.to/forum/viewtopic.php?t=1892054 等 5 个主题）：
  // - 标题在 `<h1><a class="maintitle" href="viewtopic.php?t=...">`，与列表页 `<b>` 里的文本一致；
  // - 下载链接是 `download.php?id=<附件id>`（与列表页同一形态，详情页不带 `./` 前缀），页面里另有 magnet；
  // - 体积与发布时间在 `table.btTbl`（种子信息表）里，取值为 `<td>标签</td><td>值</td>` 结构，
  //   故按俄文标签定位：`Зарегистрирован:`（该表固定行序：1 文件名 / 2 Торрент / 3 注册时间 / 4 体积 /
  //   5 评分 / 6 致谢 / 7 审核 / 8 广告 / 9 帮助，实测 5 个主题一致）；
  //   体积单元格形如 `24.4 GB ( )`，括号里的 S/L 是空的 —— 站点不在详情页展示做种/下载数，这两个字段留空。
  detail: {
    urlPattern: ["viewtopic\\.php\\?t="],
    selectors: {
      title: { selector: "a.maintitle" },
      id: {
        selector: "a.maintitle",
        attr: "href",
        filters: [(q: string) => q.match(/[?&]t=(\d+)/)?.[1]],
      },
      link: { selector: 'a[href^="download.php?id="]', attr: "href" },
      size: {
        selector: 'table.btTbl tr:has(td:contains("Размер:")) > td:nth-child(2)',
        filters: [{ name: "parseSize" }],
      },
      time: {
        selector: 'table.btTbl tr:has(td:contains("Зарегистрирован:")) > td:nth-child(2)',
        filters: [parseNoNaMeDetailDate],
      },
    },
  },
};
