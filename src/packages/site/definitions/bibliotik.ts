/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/master/resource/sites/bibliotik.me/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/bibliotik.yml
 */

import Sizzle from "sizzle";
import { mergeWith } from "es-toolkit";

import PrivateSite from "../schemas/AbstractPrivateSite";
import { EResultParseStatus, type ISiteMetadata, type IUserInfo } from "../types";
import { parseSizeString } from "../utils";

const categoryMap: Record<string, number> = {
  Applications: 1,
  Audiobooks: 3,
  Comics: 4,
  Ebooks: 5,
  Magazines: 7,
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "bibliotik",
  name: "Bibliotik",
  aka: ["BiB"],
  description: "Bibliotik is a Private Torrent Tracker for EBOOKS and AUDIOBOOKS",
  tags: ["电子书", "有声书"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://ovoyvbgvx.zr/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "Applications", value: 1 },
        { name: "Audiobooks", value: 3 },
        { name: "Comics", value: 4 },
        { name: "eBooks", value: 5 },
        { name: "Magazines", value: 7 },
      ],
      cross: { mode: "brackets" },
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/torrents/",
      responseType: "document",
      params: { orderby: "added", order: "desc" },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    skipNonLatinCharacters: true,
    selectors: {
      rows: { selector: "table#torrents_table > tbody > tr:has(.title)" },
      id: {
        selector: ".title a",
        attr: "href",
        filters: [(href: string) => href.match(/\/torrents\/(\d+)/)?.[1] ?? ""],
      },
      title: { selector: ".title a" },
      subTitle: {
        selector: ":self",
        elementProcess: (row: HTMLElement) => {
          const parts: string[] = [];
          const author = row.querySelector(".authorLink, .editorLink")?.textContent?.trim();
          const year = row.querySelector(".torYear")?.textContent?.trim();
          const format = row.querySelector(".torFormat")?.textContent?.trim();
          const retail = row.querySelector(".torRetail")?.textContent?.trim();
          if (author) parts.push(author);
          if (year) parts.push(year);
          if (format) parts.push(format);
          if (retail) parts.push(retail);
          return parts.join(" ");
        },
      },
      url: { selector: ".title a", attr: "href" },
      link: {
        selector: ["a[title='Download']", "a[href*='/download']"],
        attr: "href",
      },
      time: {
        selector: ".t_files_size_added time",
        attr: "datetime",
        filters: [
          // 去除时区后缀（Z / ±hh:mm），避免 parseTimeWithZone 二次换算；本站时间统一按 +0000（UTC 墙钟）解释
          (datetime: string) => datetime.replace(/(?:Z|[+-]\d{2}:?\d{2})$/i, ""),
          { name: "parseTime" },
        ],
      },
      size: {
        selector: ":self",
        elementProcess: (row: HTMLElement) => {
          // 优先使用行内 data-bytecount 属性（字节数），失败则回落文本解析
          const byteCountSpan = row.querySelector(".t_files_size_added span[data-bytecount]");
          const byteCount = byteCountSpan?.getAttribute("data-bytecount");
          if (byteCount) return parseInt(byteCount, 10);
          const sizeText = row.querySelector(".t_files_size_added")?.textContent?.replace(/,/g, "");
          return sizeText?.match(/([\d.]+ ?[ZEPTGMK]?i?B)/)?.[1] ?? "0";
        },
      },
      seeders: { selector: ".seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: ".leechers", filters: [{ name: "parseNumber" }] },
      completed: { selector: ".snatches", filters: [{ name: "parseNumber" }] },
      category: {
        selector: "td:first-child div[title]",
        attr: "title",
        filters: [(title: string) => categoryMap[title] ?? title],
      },
      tags: [{ name: "Free", selector: "td:contains('[100% free!]')", color: "blue" }],
    },
  },

  list: [
    {
      // 种子浏览/搜索页
      urlPattern: [/\/torrents\/?$/],
    },
  ],

  detail: {
    urlPattern: [/\/torrents\/\d+(\?.*)?$/],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (doc: Document) => (doc.URL || location.href).match(/\/torrents\/(\d+)/)?.[1] ?? "",
      },
      link: { selector: "a[href*='/download']", attr: "href" },
    },
  },

  noLoginAssert: {
    matchSelectors: ["form#loginform", "#loginform"],
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        // 首页头部即可取到当前登录用户的 id / name
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: {
            selector: ["#pre_header_status a[href*='/users/']"],
            attr: "href",
            filters: [(href: string) => href.match(/\/users\/(\d+)/)?.[1] ?? ""],
          },
          name: { selector: ["#pre_header_status a[href*='/users/']"] },
        },
      },
      {
        requestConfig: { url: "/users/$id$", responseType: "document" },
        assertion: { id: "url" },
        selectors: {
          uploaded: {
            selector: ["#pre_header_status li:contains('Up: ')"],
            filters: [
              (query: string) => query.replace(/,/g, "").match(/([\d.]+ ?[ZEPTGMK]?i?B)/)?.[1] ?? "0",
              { name: "parseSize" },
            ],
          },
          downloaded: {
            selector: ["#pre_header_status li:contains('Down: ')"],
            filters: [
              (query: string) => query.replace(/,/g, "").match(/([\d.]+ ?[ZEPTGMK]?i?B)/)?.[1] ?? "0",
              { name: "parseSize" },
            ],
          },
          levelName: {
            selector: ["#detailsbox p:contains('Class: ')"],
            filters: [(query: string) => query.replace(/Class:\s*/g, "")],
          },
          uploads: {
            // <li><a href="/users/33387/uploads">Uploads</a> (100)</li>
            // 注意：该 li 位于侧栏 #sidebar，而非 #detailsbox；数量 "(100)" 是 li 的文本节点，故必须取 li 而非 a
            selector: ["#sidebar li:has(a[href*='/uploads'])", "#detailsbox li:has(a[href*='/uploads'])"],
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: ["#detailsbox p:contains('Joined ') time"],
            attr: "datetime",
            filters: [{ name: "parseTime" }],
          },
          bonus: { text: "N/A" },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "Default class for all new members",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P2W",
      ratio: 1.05,
      // 满足以下任一组：上传 10GiB 且发布 10 个种子 / 上传 1GiB 且发布 100 个种子
      uploaded: "10GiB",
      uploads: 10,
      alternative: [{ uploaded: "1GiB", uploads: 100 }],
      isKept: true,
      privilege:
        "Create collections; Add torrents to collections (unless protected); Access to the Power User and Invite forums; Exempt from inactivity disabling; Receives one invite on the 1st and 15th of every month (maximum of 2)",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P4W",
      ratio: 1.05,
      uploaded: "20GiB",
      uploads: 100,
      isKept: true,
      privilege:
        "Create and edit collections (unless protected); Add torrents to collections (unless protected); Edit torrent page descriptions and images; Moderate authors, creators, publishers, and tags; Access to the Elite, Power User, and Invite forums; Exempt from inactivity disabling; Receives one invite every Sunday (maximum of 4)",
    },
  ],
};

export default class Bibliotik extends PrivateSite {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);

    // 做种统计需要遍历 /users/<id>/seeding 的分页列表
    if (
      flushUserInfo.status === EResultParseStatus.success &&
      flushUserInfo.id &&
      (typeof flushUserInfo.seeding === "undefined" || typeof flushUserInfo.seedingSize === "undefined")
    ) {
      flushUserInfo = await this.parseUserInfoForSeedingStatus(flushUserInfo);
    }

    return flushUserInfo;
  }

  protected async parseUserInfoForSeedingStatus(flushUserInfo: Partial<IUserInfo>): Promise<IUserInfo> {
    const userId = flushUserInfo.id as number | string;
    const seedStatus = { seeding: 0, seedingSize: 0 };
    let currentPage = 1;
    let maxPage = 1;

    for (; currentPage <= maxPage; currentPage++) {
      await this.sleepAction(this.metadata.userInfo?.requestDelay);
      const { data: doc } = await this.request<Document>({
        url: `/users/${userId}/seeding`,
        params: currentPage > 1 ? { page: currentPage } : {},
        responseType: "document",
      });

      // 首页解析最大页码，来源：/users/<id>/seeding 分页栏的 `Last >>` 链接
      if (currentPage === 1) {
        const lastLink = Sizzle(".pagination a[href*='?page']:contains('Last >>'):first", doc)[0];
        const lastHref = lastLink?.getAttribute("href") ?? "";
        const pageMatch = lastHref.match(/[?&]page=(\d+)/);
        maxPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;
      }

      const rows = Sizzle("table#torrents_table > tbody > tr:has(.title)", doc);
      seedStatus.seeding += rows.length;
      rows.forEach((row) => {
        const sizeSpan = Sizzle(".t_files_size_added span[data-bytecount]", row as Element)[0];
        if (sizeSpan) {
          seedStatus.seedingSize += parseInt(sizeSpan.getAttribute("data-bytecount") ?? "0", 10);
        } else {
          const sizeText = Sizzle(".t_files_size_added", row as Element)[0]?.textContent?.replace(/,/g, "");
          seedStatus.seedingSize += parseSizeString(sizeText?.match(/([\d.]+ ?[ZEPTGMK]?i?B)/)?.[1] ?? "");
        }
      });
    }

    return mergeWith(flushUserInfo, seedStatus, (objValue, srcValue) =>
      typeof srcValue === "undefined" ? objValue : srcValue,
    ) as IUserInfo;
  }
}
