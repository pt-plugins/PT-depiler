/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/shanaproject.yml
 */
import { type ISiteMetadata } from "../types";

const monthMap: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/**
 * 站点发布日期（GMT）形如：
 *   "Oct. 8, 2026, 10:29 a.m." / "May 8, 2022, 6 a.m." / "Sept. 14, 2026, midnight" / "..., noon"
 * 直接返回时间戳，既避免依赖运行主机时区，也保证取不到日期时不会让整页解析抛错。
 */
function parseReleaseDate(raw: string): number {
  const matched = /^([A-Za-z]+)\.?\s+(\d{1,2}),\s*(\d{4}),\s*(.+)$/.exec(String(raw).trim());
  const month = matched ? monthMap[matched[1].slice(0, 3)] : undefined;
  if (!matched || month === undefined) {
    return 0;
  }

  const [, , day, year, rawTime] = matched;
  const time = rawTime.trim().toLowerCase().replace(/\./g, "");
  let hours = 0;
  let minutes = 0;

  if (time === "noon") {
    hours = 12;
  } else if (time !== "midnight") {
    const matchedTime = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/.exec(time);
    if (!matchedTime) {
      return 0;
    }
    hours = +matchedTime[1] % 12;
    minutes = +(matchedTime[2] ?? 0);
    if (matchedTime[3] === "pm") {
      hours += 12;
    }
  }

  return Date.UTC(+year, month, +day, hours, minutes);
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "shanaproject",
  name: "Shana Project",
  description: "Shana Project 是一个公开的动漫资源聚合站，收录各字幕组发布的新番剧集与合集",
  tags: ["Anime"],

  type: "public",
  urls: ["https://www.shanaproject.com/"],

  search: {
    keywordPath: "params.title",
    requestConfig: {
      url: "/search/",
      responseType: "document",
      params: { title: "", subber: "", sort: "date", dir: "Descending" },
    },
    selectors: {
      rows: { selector: 'div.grid_12 > div[id^="rel"]' },
      // 结果块自身的 id 形如 rel353073，即是该发布在站内的编号
      id: { selector: ":self", attr: "id", filters: [(q: string) => q.replace(/^rel/, "")] },
      // 完整发布名，如 "Kanojo Okarishimasu [56][WebRip][1080p][繁日內嵌]"
      title: {
        selector: "div.release_leftover > div.release_text_contents",
        filters: [
          (q: string) =>
            String(q)
              .replace(/^(\[.*\]) (.*)$/, "$2 $1")
              .replace(/\.mkv/gi, ""),
        ],
      },
      // 站点没有单条发布的详情页，Jackett 的 details 也取行内第一个链接（系列页）
      url: { selector: "a", attr: "href" },
      link: { selector: 'a[href^="/download/"]', attr: "href" },
      // 日期固定是第一个 release_row 的最后一格；取不到时回落到 0，避免空串进入 parseTimeWithZone
      time: { selector: "div.release_20.release_last", text: 0, filters: [parseReleaseDate] },
      size: { selector: "div.release_size", filters: [{ name: "parseSize" }] },
      // 站点不提供做种/下载人数（Jackett 在此硬编码 1/1），故留空
      category: { text: "Anime" },
    },
  },

  list: [
    {
      urlPattern: ["/search/"],
      selectors: {
        keywords: { selector: 'input[name="title"]', attr: "value" },
      },
    },
  ],
};
