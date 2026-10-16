/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/dirtybytes-api.yml
 */
import type { ISiteMetadata, ITorrent } from "../types";
import Rartracker, { SchemaMetadata } from "../schemas/Rartracker";
import { buildCategoryOptionsFromDict } from "../utils";

const categoryMap: Record<number, string> = {
  1: "Movies/SD",
  2: "Movies/720p",
  3: "Movies/1080p",
  4: "Movies/1440p",
  5: "Movies/2160p",
  6: "Movies/4320p",
  7: "Scene/SD",
  8: "Scene/720p",
  9: "Scene/1080p",
  10: "Scene/1440p",
  11: "Scene/2160p",
  12: "Scene/4320p",
  13: "Movies/VR180/1080p",
  14: "Movies/VR180/1440p",
  15: "Movies/VR180/2160p",
  16: "Movies/VR180/2880p",
  17: "Movies/VR180/3600p",
  18: "Movies/VR180/4320p",
  19: "Scene/VR180/1080p",
  20: "Scene/VR180/1440p",
  21: "Scene/VR180/2160p",
  22: "Scene/VR180/2880p",
  23: "Scene/VR180/3600p",
  24: "Scene/VR180/4320p",
  25: "Photo Sets",
  26: "Packs",
  27: "Movies/VR180/3456p",
  28: "Movies/VR180/3840p",
  29: "Scene/VR180/3456p",
  30: "Scene/VR180/3840p",
};

const levelIdMap: Record<number, string> = {
  0: "Peeker",
  10: "Flirt",
  20: "Tease",
  29: "Developer",
  30: "Heartbreaker",
  31: "Afterdark Elite",
  32: "Afterdark Legend",
  50: "Uploader",
  51: "Titan",
  70: "VIP",
  75: "FLS",
  80: "Moderator",
  90: "Administrator",
};

const torrentSelector = 'a[href^="/torrent/"][title]';
const downloadSelector = 'a[href*="/api/v1/torrents/download/"]';

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "dirtybytes",
  version: 2,
  name: "DirtyBytes",
  description: "Your after dark community.",
  tags: ["成人"],
  timezoneOffset: "+0200",
  type: "private",
  schema: "Rartracker",
  urls: ["uggcf://qveglolgrf.arg/"],

  category: [
    {
      name: "类别",
      key: "categories",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" },
    },
    {
      name: "促销状态",
      key: "freeleech",
      options: [{ name: "免费", value: "true" }],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    advanceKeywordParams: { imdb: false },
    requestConfig: {
      ...SchemaMetadata.search.requestConfig,
      params: {
        ...SchemaMetadata.search.requestConfig!.params,
        page: "search",
        sort: "d",
        order: "desc",
        dead: true,
      },
    },
    selectors: {
      ...SchemaMetadata.search.selectors,
      url: { selector: "id", filters: [(id: number) => `/torrent/${id}`] },
      completed: { selector: "times_completed" },
      category: { selector: "category", filters: [(id: number) => categoryMap[id]] },
      tags: [
        { name: "Free", selector: "frileech", color: "blue" },
        { name: "Pack", selector: "pack", color: "blue" },
        { name: "3D", selector: "3d", color: "red" },
      ],
    },
  },

  list: [
    {
      urlPattern: [
        /\/(alltorrents|torrents|xxx|search|bookmarks|watch|watcher\/torrents|toplists\/torrents)\/?([?#].*)?$/,
      ],
      mergeSearchSelectors: false,
      selectors: {
        rows: {
          selector: [".dc-torrent-table > tbody > tr:has(a.torrent-name)", ".torrent-mobile-card", ".poster-card"],
        },
        id: { selector: torrentSelector, attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
        url: { selector: torrentSelector, attr: "href" },
        title: { selector: torrentSelector, attr: "title" },
        size: {
          selector: [".torrent-size", ".torrent-mobile-metrics > span:nth-child(1)"],
          filters: [{ name: "parseSize" }],
        },
        completed: {
          selector: [".torrent-downloads", ".torrent-mobile-metrics > span:nth-child(2)"],
          filters: [{ name: "parseNumber" }],
        },
        seeders: {
          selector: [".seeders-col", ".torrent-mobile-metrics > .is-up", ".poster-stats > span:nth-child(1)"],
          filters: [{ name: "parseNumber" }],
        },
        leechers: {
          selector: [".leechers-col", ".torrent-mobile-metrics > .is-down", ".poster-stats > span:nth-child(2)"],
          filters: [{ name: "parseNumber" }],
        },
        category: {
          selector: ["img.categoryImage", ".torrent-details .torrent-name"],
          elementProcess: (element: HTMLElement) => element.getAttribute("title") ?? element.textContent,
        },
        tags: [{ name: "Free", selector: ".freeleech-badge", color: "blue" }],
      },
    },
  ],

  detail: {
    urlPattern: [/\/torrent\/\d+(\/(?!edit([/?#]|$))[^/?#]+)?\/?([?#].*)?$/],
    selectors: {
      id: { selector: downloadSelector, attr: "href", filters: [{ name: "split", args: ["/", 5] }] },
      title: { selector: "h1.torrent-release-title" },
      link: { selector: downloadSelector, attr: "href" },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    process: [
      SchemaMetadata.userInfo.process![0],
      {
        ...SchemaMetadata.userInfo.process![1],
        selectors: {
          ...SchemaMetadata.userInfo.process![1].selectors,
          trueUploaded: { selector: "uploaded_real" },
          uploads: { selector: "torrents" },
          seeding: { selector: "peersSeeder" },
          leeching: { selector: "peersLeecher" },
          // 由基类按名称匹配 levelRequirements 中的内部 ID。
          levelName: { selector: "class", filters: [(id: number) => levelIdMap[id]] },
        },
      },
    ],
  },

  // https://dirtybytes.net/faq#29、#30、#32：特殊身份不参与自动晋升，流量门槛以 GiB 为准。
  levelRequirements: [
    { id: 0, name: levelIdMap[0], privilege: "新用户默认等级。" },
    { id: 10, name: levelIdMap[10], interval: "P14D", uploaded: "50GiB", ratio: 1.05 },
    {
      id: 20,
      name: levelIdMap[20],
      interval: "P105D",
      uploaded: "300GiB",
      ratio: 1.1,
      privilege: "可查看排行榜和扩展统计，晋升时清除已保存的 IP 记录。",
    },
    {
      id: 30,
      name: levelIdMap[30],
      interval: "P210D",
      uploaded: "1200GiB",
      ratio: 1.1,
      privilege: "晋升时增加邀请和请求名额。",
    },
    {
      id: 31,
      name: levelIdMap[31],
      interval: "P500D",
      uploaded: "5000GiB",
      ratio: 20,
      privilege: "晋升时增加邀请和请求名额。",
    },
    {
      id: 32,
      name: levelIdMap[32],
      interval: "P730D",
      uploaded: "20000GiB",
      ratio: 20,
      privilege: "晋升时增加邀请和请求名额。",
    },
    { id: 170, name: levelIdMap[70], groupType: "vip" },
    { id: 200, name: levelIdMap[29], groupType: "manager" },
    { id: 250, name: levelIdMap[50], groupType: "manager" },
    { id: 251, name: levelIdMap[51], groupType: "manager" },
    { id: 275, name: levelIdMap[75], groupType: "manager" },
    { id: 280, name: levelIdMap[80], groupType: "manager" },
    { id: 290, name: levelIdMap[90], groupType: "manager" },
  ],
};

export default class DirtyBytes extends Rartracker {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 新版页面的下载按钮仅含种子 ID，复制和远程下载时补上 passkey。
    await this.parseTorrentRowForLink(torrent);
    torrent.link = this.fixLink(torrent.link!, { baseURL: this.url });
    return super.getTorrentDownloadLink(torrent);
  }
}
