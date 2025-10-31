import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ISearchInput, ISiteMetadata, ITorrent, IUserInfo } from "../types";
import { EResultParseStatus } from "../types";
import { parseSizeString, createDocument } from "../utils";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

interface SnatchListResponseData {
  aaData: [
    string, // Torrent link HTML
    string, // Size
    string, // Snatched
    string, // Downloaded
    string, // Uploaded
    string, // Ratio
    number, // Announcements
    number, // Completed
    string, // Active
  ][];
  iTotalDisplayRecords: number;
  iTotalRecords: number;
  sEcho: number;
}

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
    pickLast: ["id", "name", "numericId"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["id", "name", "messageCount"],
      },
      {
        requestConfig: { url: "/profile/$name$", responseType: "document" },
        assertion: { name: "url" },
        fields: ["uploaded", "downloaded", "levelName", "joinTime", "numericId"],
      },
      {
        // seeding, seedingSize - 第一步：GET请求初始化页面
        requestConfig: { 
          url: "/user/account/snatchlist",
          responseType: "document",
          params: {
            userID: "PLACEHOLDER"
          }
        },
        requestConfigTransformer: (config: any, lastUserInfo: any) => {
          if (lastUserInfo && lastUserInfo.numericId) {
            config.params.userID = lastUserInfo.numericId;
          }
          return config;
        },
        assertion: { id: "userID" },
        fields: [],
      },
      {
        // seeding, seedingSize - 第二步：POST请求获取数据
        requestConfig: {
          url: "/user/account/snatchlist",
          method: "POST",
          responseType: "json",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Origin": "https://pussytorrents.org",
            "Referer": "https://pussytorrents.org/user/account/snatchlist"
          },
          data: {
            sEcho: 2,
            iColumns: 9,
            sColumns: "",
            iDisplayStart: 0,
            iDisplayLength: -1,
            sNames: ",,,,,,,,",
            sSearch: "",
            bRegex: false,
            sSearch_0: "", bRegex_0: false, bSearchable_0: true,
            sSearch_1: "", bRegex_1: false, bSearchable_1: true,
            sSearch_2: "", bRegex_2: false, bSearchable_2: true,
            sSearch_3: "", bRegex_3: false, bSearchable_3: true,
            sSearch_4: "", bRegex_4: false, bSearchable_4: true,
            sSearch_5: "", bRegex_5: false, bSearchable_5: true,
            sSearch_6: "", bRegex_6: false, bSearchable_6: true,
            sSearch_7: "", bRegex_7: false, bSearchable_7: true,
            sSearch_8: "", bRegex_8: false, bSearchable_8: true,
            iSortingCols: 1,
            iSortCol_0: 0,
            sSortDir_0: "desc",
            bSortable_0: true,
            bSortable_1: true,
            bSortable_2: true,
            bSortable_3: true,
            bSortable_4: true,
            bSortable_5: true,
            bSortable_6: true,
            bSortable_7: true,
            bSortable_8: true,
            userID: "PLACEHOLDER"
          }
        },
        requestConfigTransformer: (config: any, lastUserInfo: any) => {
          if (lastUserInfo && lastUserInfo.numericId) {
            config.data.userID = lastUserInfo.numericId;
          }
          return config;
        },
        assertion: { id: "userID" },
        fields: ["seeding", "seedingSize"],
      },
      {
        // uploads - 第一步：GET请求初始化页面
        requestConfig: { 
          url: "/user/account/uploadedtorrents",
          responseType: "document",
          params: {
            userID: "PLACEHOLDER"
          }
        },
        requestConfigTransformer: (config: any, lastUserInfo: any) => {
          if (lastUserInfo && lastUserInfo.numericId) {
            config.params.userID = lastUserInfo.numericId;
          }
          return config;
        },
        assertion: { id: "userID" },
        fields: [],
      },
      {
        // uploads - 第二步：POST请求获取数据
        requestConfig: {
          url: "/user/account/uploadedtorrents",
          method: "POST",
          responseType: "json",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Origin": "https://pussytorrents.org",
            "Referer": "https://pussytorrents.org/user/account/uploadedtorrents"
          },
          data: {
            sEcho: 1,
            iColumns: 5,
            sColumns: "name,size,completed,seeders,leechers",
            iDisplayStart: 0,
            iDisplayLength: 50,
            sNames: "name,size,completed,seeders,leechers",
            sSearch: "",
            bRegex: false,
            sSearch_0: "", bRegex_0: false, bSearchable_0: true,
            sSearch_1: "", bRegex_1: false, bSearchable_1: true,
            sSearch_2: "", bRegex_2: false, bSearchable_2: true,
            sSearch_3: "", bRegex_3: false, bSearchable_3: true,
            sSearch_4: "", bRegex_4: false, bSearchable_4: true,
            iSortingCols: 1,
            iSortCol_0: 0,
            sSortDir_0: "asc",
            bSortable_0: false,
            bSortable_1: true,
            bSortable_2: true,
            bSortable_3: true,
            bSortable_4: true,
            userID: "PLACEHOLDER"
          }
        },
        requestConfigTransformer: (config: any, lastUserInfo: any) => {
          if (lastUserInfo && lastUserInfo.numericId) {
            config.data.userID = lastUserInfo.numericId;
          }
          return config;
        },
        assertion: { id: "userID" },
        fields: ["uploads"],
      },
    ],
    selectors: {
      // 基本信息
      id: {
        selector: "#memberBar .span8 a[href*='/profile/']",
        attr: "href",
        filters: [(q: string) => {
          const match = q.match(/\/profile\/([^\/]+)/);
          return match ? match[1] : "";
        }]
      },
      name: { 
        selector: "#memberBar .span8 a[href*='/profile/']"
      },
      messageCount: {
        selector: "a[href='/users/messages'] i.news-notify",
        filters: [(q: string) => parseInt(q) || 0]
      },
      
      // 个人资料页面
      uploaded: {
        selector: "#profile button:has(.icon-arrow-up)",
        filters: [(q: string) => parseSizeString(q)]
      },
      downloaded: {
        selector: "#profile button:has(.icon-arrow-down)",
        filters: [(q: string) => parseSizeString(q)]
      },
      levelName: { 
        selector: "#profileTable td:contains('Class') + td" 
      },
      joinTime: {
        selector: "#profileTable td:contains('Join Date') + td",
        filters: [
          (q: string) => {
            const cleaned = q.replace(/(\d+)(st|nd|rd|th)/, '$1');
            return new Date(cleaned).getTime();
          }
        ]
      },
      // 从个人资料页面的 snatchlist 链接提取数字ID
      numericId: {
        selector: 'a[href="#snatchlist"][data-ajax="/user/account/snatchlist"]',
        attr: "data-userid"
      },
      
      // 做种信息
      seeding: {
        selector: "aaData",
        filters: [
          (aaData: any) => {
            if (!Array.isArray(aaData)) {
              return 0;
            }
            return aaData.filter((data: any) => data[7] === 1).length;
          }
        ]
      },
      seedingSize: {
        selector: "aaData",
        filters: [
          (aaData: any) => {
            if (!Array.isArray(aaData)) return 0;
            return aaData.reduce((total: number, data: any) => {
              return data[7] === 1 && data[1] ? total + parseSizeString(data[1]) : total;
            }, 0);
          }
        ]
      },
      
      // 上传种子数量
      uploads: {
        selector: "iTotalRecords",
        filters: [
          (totalRecords: number) => totalRecords
        ]
      },
    },
  },
};

export default class PussyTorrents extends PrivateSite {
  readonly siteMetadata = siteMetadata;
}
