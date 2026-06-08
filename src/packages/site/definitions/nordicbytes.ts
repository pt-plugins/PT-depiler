import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
  3: "Apps",
  4: "Games",
  5: "Sound",
  6: "Books",
  7: "AudioBooks",
  8: "Podcasts",
  9: "XXX",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 2,
  id: "nordicbytes",
  name: "NordicBytes",
  aka: ["NBy", "DanishBytes"],
  description: "NordicBytes is a Private Torrent Tracker for NORDIC content",
  tags: ["北欧"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://abeqvpolgrf.bet/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "Full Disc", value: 1 },
        { name: "Remux", value: 2 },
        { name: "Encode", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "FLAC", value: 7 },
        { name: "ALAC", value: 8 },
        { name: "AC3", value: 9 },
        { name: "AAC", value: 10 },
        { name: "MP3", value: 11 },
        { name: "Mac", value: 12 },
        { name: "Windows", value: 13 },
        { name: "BluRay", value: 14 },
        { name: "Andet", value: 15 },
        { name: "Xvid", value: 16 },
        { name: "MP4", value: 17 },
        { name: "DVD-Rip", value: 18 },
        { name: "UHD", value: 19 },
        { name: "M4A", value: 20 },
        { name: "WAV", value: 21 },
        { name: "WMA", value: 22 },
        { name: "3D", value: 23 },
        { name: "Android", value: 24 },
        { name: "iOS", value: 25 },
        { name: "H.264", value: 26 },
        { name: "x264", value: 27 },
        { name: "PDF", value: 28 },
        { name: "ePub", value: 29 },
        { name: "Boxset", value: 30 },
        { name: "Cam/TS", value: 31 },
        { name: "Console", value: 32 },
        { name: "4K", value: 33 },
        { name: "VR", value: 34 },
        { name: "Podcast", value: 35 },
        { name: "X265 / H.265", value: 36 },
        { name: "VC1", value: 37 },
        { name: "Subs", value: 38 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "4320p", value: 1 },
        { name: "2160p", value: 2 },
        { name: "1080p", value: 3 },
        { name: "1080i", value: 4 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
        { name: "Ikke specificeret", value: 11 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "100% Freeleech", value: 100 },
        { name: "Double Upload", value: "doubleup" },
        { name: "Featured", value: "featured" },
        { name: "Refundable", value: "refundable" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
            params[value] = 1;
          } else {
            params.free.push(value);
          }
        });
        return { requestConfig: { params } };
      },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      url: "/torrents",
      responseType: "document",
      params: {
        perPage: 25,
      },
    },
    selectors: {
      // NordicBytes（DanishBytes fork）使用 Livewire 渲染的卡片式列表，单个种子为 div.__torrents-item
      rows: {
        selector: "div.__torrents-item",
      },
      id: {
        selector: "div.torrent--info a[href*='/torrents/']",
        attr: "href",
        filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
      },
      title: {
        selector: "div.torrent--info a[href*='/torrents/'] h2",
      },
      url: {
        selector: "div.torrent--info a[href*='/torrents/']",
        attr: "href",
      },
      link: {
        selector: "a[href*='/torrents/download/']",
        attr: "href",
      },
      time: {
        selector: "div.torrent--info time",
        attr: "datetime",
        filters: [{ name: "parseTime" }],
      },
      // 种子数据位于 ul.__torrent-stats，依靠图标区分：fa-arrow-up=做种、fa-arrow-down=下载、fa-hdd=大小
      size: {
        selector: "ul.__torrent-stats li:has(i.fa-hdd) div.badge-group-content",
      },
      seeders: {
        selector: "ul.__torrent-stats a:has(i.fa-arrow-up) div.badge-group-content",
      },
      leechers: {
        selector: "ul.__torrent-stats a:has(i.fa-arrow-down) div.badge-group-content",
      },
    },
  },

  userInfo: {
    pickLast: ["name"],
    process: [
      {
        requestConfig: {
          url: "/",
          responseType: "document",
        },
        selectors: {
          name: {
            selector: "nav.__navbar-subnav a[href*='/u/'] strong",
          },
          uploaded: {
            selector: "ul.__navbar-stats a:has(i.fa-arrow-up) span",
            filters: [
              (query: string) => {
                const match = query.match(/([\d.,]+\s*[A-Za-z]+)/);
                return match ? match[1] : query;
              },
              { name: "parseSize" },
            ],
          },
          downloaded: {
            selector: "ul.__navbar-stats a:has(i.fa-arrow-down) span",
            filters: [
              (query: string) => {
                const match = query.match(/([\d.,]+\s*[A-Za-z]+)/);
                return match ? match[1] : query;
              },
              { name: "parseSize" },
            ],
          },
          ratio: {
            selector: "ul.__navbar-stats a:has(i.fa-percent) span",
            filters: [{ name: "parseNumber" }],
          },
          seeding: {
            selector: "ul.__navbar-stats a:has(i.fa-arrow-up) span",
            filters: [
              (query: string) => {
                const match = query.match(/\((\d+)\)/);
                return match ? parseInt(match[1]) : 0;
              },
            ],
          },
          leeching: {
            selector: "ul.__navbar-stats a:has(i.fa-arrow-down) span",
            filters: [
              (query: string) => {
                const match = query.match(/\((\d+)\)/);
                return match ? parseInt(match[1]) : 0;
              },
            ],
          },
        },
      },
      {
        requestConfig: {
          url: "/u/$name$",
          responseType: "document",
        },
        assertion: { name: "url" },
        selectors: {
          // 资料页头部徽章区 .__profile-badges 与统计区 ul.__profile-stats
          levelName: {
            selector: ".__profile-badges span.badge:has(i.fa-user)",
          },
          joinTime: {
            selector: ".__profile-badges time[datetime]",
            attr: "datetime",
            filters: [{ name: "parseTime" }],
          },
          bonus: {
            selector: ".__profile-badges span.__bon",
            filters: [(query: string) => query.replace(/[^\d.]/g, ""), { name: "parseNumber" }],
          },
          seedingSize: {
            selector: "ul.__profile-stats li[data-template='user-seedsize'] strong",
            filters: [{ name: "parseSize" }],
          },
          uploads: {
            selector: "ul.__profile-stats li[data-template='user-upload'] span",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "Noob", privilege: "受限用户，无法访问论坛、聊天和评论。" },
    { id: 2, name: "Beginner", uploaded: "50GiB", privilege: "发送邀请" },
    { id: 3, name: "Explorer", uploaded: "500GiB", interval: "P30D", privilege: "发送邀请" },
    { id: 4, name: "Contributor", uploaded: "1TiB", interval: "P60D", privilege: "发送邀请" },
    { id: 5, name: "Pirate", uploaded: "5TiB", interval: "P90D", privilege: "发送邀请" },
    { id: 6, name: "Veteran", uploaded: "10TiB", interval: "P180D", privilege: "发送邀请" },
    { id: 7, name: "Guru", uploaded: "50TiB", interval: "P365D", privilege: "发送邀请" },
    { id: 8, name: "Legend", uploaded: "100TiB", interval: "P730D", privilege: "发送邀请" },
    {
      id: 9,
      name: "Archivist",
      groupType: "user",
      averageSeedingTime: "P60D",
      seedingSize: "10TiB",
      interval: "P90D",
      privilege: "发送邀请 免疫HR 全局免费",
    },
  ],
};
