import { EResultParseStatus, type ISiteMetadata, type IUserInfo } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "blutopia",
  name: "Blutopia",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",
  collaborator: ["haowenwu"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://oyhgbcvn.pp/"],

  userInfo: {
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      name: {
        selector: ["a[href*='/users/']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/users\/(.+)\//);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
          },
        ],
      },
      levelName: {
        selector: "div.panel__body a.user-tag__link",
        attr: "title",
      },
      uploads: {
        selector: ["li.top-nav__dropdown > a[href*='uploads']"],
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: ["time"],
        attr: "datetime",
        filters: [{ name: "parseTTL" }],
      },
    }
  },
  
  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "2下载槽",
    },
    {
      id: 2,
      name: "BluUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "5下载槽",
    },
    {
      id: 3,
      name: "BluMaster",
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "10下载槽 发送邀请",
    },
    {
      id: 4,
      name: "BluExtremist",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "自动通过候选 访问邀请区 15下载槽 发送邀请",
    },
    {
      id: 5,
      name: "BluLegend",
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "自动通过候选 访问邀请区 20下载槽 发送邀请",
    },
    {
      id: 6,
      name: "Blutopian",
      uploaded: "100TiB",
      interval: "P12M",
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 25下载槽 发送邀请",
    },
    {
      id: 7,
      name: "BluSeeder",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      privilege: "自动通过候选 访问邀请区 免疫HR 15下载槽 发送邀请",
    },
    {
      id: 8,
      name: "BluCollector",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P60D",
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 20下载槽 发送邀请",
    },
    {
      id: 9,
      name: "BluArchivist",
      seedingSize: "20TiB",
      interval: "P3M",
      averageSeedingTime: "P90D",
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 双倍计算上传量 25下载槽 发送邀请",
    },
  ],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movie", value: 1 },
        { name: "Other", value: 8 },
        { name: "TV Show", value: 2 },
        { name: "FANRES", value: 3 },
        { name: "Trailer", value: 5 },
        { name: "Live Concert", value: 9 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "Full Disc", value: 1 },
        { name: "Remux", value: 3 },
        { name: "Encode", value: 12 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "Other", value: 15 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "4320p", value: 11 },
        { name: "2160p", value: 1 },
        { name: "1080p", value: 2 },
        { name: "1080i", value: 3 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Buff",
      key: "free",
      options: [
        { name: "0% Freeleech", value: 0 },
        { name: "25% Free", value: 25 },
        { name: "50% Free", value: 50 },
        { name: "75% Free", value: 75 },
        { name: "100% Free", value: 100 },
        { name: "双倍上传", value: "doubleup" },
        { name: "精选", value: "featured" },
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
    },
    keywordPath: "params.name",
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.imdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      rows: { selector: "div.torrent-search--list__results > table:first > tbody > tr" },
      id: {
        selector: ["a.torrent-search--list__name"],
        attr: "href",
        filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
      },
      title: {
        selector: ["a.torrent-search--list__name"],
      },
      category: {
        selector: [
          'div.torrent-search--list__category img',
        ],
        attr: "alt",
      },
      size: {
        selector: ['td.torrent-search--list__size'],
      },
      seeders: {
        selector: ['td.torrent-search--list__seeders'],
      },
      leechers: {
        selector: ['td.torrent-search--list__leechers'],
      },
      completed: {
        selector: ['td.torrent-search--list__completed'],
      },
      comments: {
        selector: ['i.torrent-icons__comments'],
      },
    },
  },
};
