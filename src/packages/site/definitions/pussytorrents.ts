import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ISearchInput, ISiteMetadata, ITorrent, IUserInfo } from "../types";
import { EResultParseStatus } from "../types";
import { parseSizeString, createDocument } from "../utils";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

export const siteMetadata: ISiteMetadata = {
  id: "pussytorrents",
  version: 1,
  name: "Pussytorrents",
  aka: ["PT"],
  description: "PussyTorrents is a Semi-Private Torrent Tracker for 3X",
  tags: ["XXX"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: [
    "https://pussytorrents.org/",
  ],

  search: {
    requestConfig: {
      url: "/torrents/browse",
    },
    requestConfigTransformer: ({ keywords, searchEntry, requestConfig }) => {
      const baseUrl = requestConfig!.url || "";
      if (keywords) {
        delete requestConfig!.params?.keywords;
        keywords = keywords.replace(/(^|\s)-/, "");
        requestConfig!.url = baseUrl + "?query=" + keywords;
      }
      return requestConfig!;
    },
    selectors: {
      rows: {
        selector: 'table#torrenttable > tbody > tr:has(a[href^="/download/"])',
      },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [{ name: "parseNumber" }],
      },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href^="/download/"]', attr: "href" },
      time: {
        selector: "span.subnote",
        filters: [(query: string) => query.replace("Added on ", "")],
      },
      size: { selector: "td:nth-last-child(5)" },
      author: { selector: "td:nth-last-child(1)" },
      category: { text: "ALL" },
      seeders: { selector: "td:nth-last-child(3)" },
      leechers: { selector: "td:nth-last-child(2)" },
      completed: {
        selector: "td:nth-last-child(4)",
        filters: [{ name: "parseNumber" }],
      },
      comments: { selector: 'a[href*="#comments"]' },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: { selector: "#memberBar .span8 a[href*='/profile/']" },
          name: { selector: "#memberBar .span8 a[href*='/profile/']" },
          messageCount: {
            text: "0",
            selector: "a[href='/users/messages'] i.news-notify",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/profile/$name$", responseType: "document" },
        assertion: { name: "url" }, // 替换之前获取的用户名
        selectors: {
          uploaded: { selector: "#profile button:has(.icon-arrow-up)", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "#profile button:has(.icon-arrow-down)", filters: [{ name: "parseSize" }] },
          levelName: { selector: "#profileTable td:contains('Class') + td" },
          joinTime: {
            selector: "#profileTable td:contains('Join Date') + td",
            filters: [{ name: "parseTime", args: ["EEEE do MMMM yyyy" /* 'Saturday 6th May 2017' */] }],
          },
        },
      },// FIXME 暂未实现seeding/seedingSize
    ],
  },
  // FIXME 暂未实现levelRequirements
};
