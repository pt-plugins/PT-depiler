import { ETorrentStatus, type ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,

  id: "u2",
  name: "U2",
  schema: "NexusPHP",
  type: "private",
  urls: ["https://u2.dmhy.org/"],
  description: "动漫花园分享园",
  tags: ["影视", "动漫"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 9, name: "U2-Rip" },
        { value: 411, name: "U2-RBD" },
        { value: 10, name: "R3TRAW" },
        { value: 11, name: "R2JRAW" },
        { value: 12, name: "BDRip" },
        { value: 13, name: "DVDRip" },
        { value: 14, name: "HDTVRip" },
        { value: 15, name: "DVDISO" },
        { value: 16, name: "BDMV" },
        { value: 17, name: "LQRip" },
        { value: 410, name: "外挂结构" },
        { value: 412, name: "加流重灌" },
        { value: 21, name: "Raw Books" },
        { value: 22, name: "港译漫画" },
        { value: 23, name: "台译漫画" },
        { value: 30, name: "Lossless Music" },
        { value: 40, name: "Others" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    {
      name: "显示促销种子？",
      key: "spstate",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "免费", value: 2 },
        { name: "2X", value: 3 },
        { name: "2X免费", value: 4 },
        { name: "50%", value: 5 },
        { name: "2X 50%", value: 6 },
        { name: "30%", value: 7 },
        { name: "其他", value: 8 },
      ],
    },
    CategoryInclbookmarked,
  ],
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      title: {
        selector: ["a.tooltip[href*='hit']"],
      },
      subTitle: {
        selector: ["span.tooltip"],
      },
      progress: {
        selector: ["td[class*='seedhlc_'], td[class*='leechhlc_']"],
        elementProcess: (element: HTMLElement) => {
          switch (true) {
            case /seedhlc_/.test(element.className):
              return 100;
            case /leechhlc_/.test(element.className):
              return parseFloat((element.innerText.match(/[\d.]+%/)! || ["0"])[0]);
            default:
              return 0;
          }
        },
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: ":self",
        case: {
          "td[class*='seedhlc_ever']": ETorrentStatus.completed,
          ".seedhlc_current": ETorrentStatus.seeding,
          ".leechhlc_inactive": ETorrentStatus.inactive,
          ".leechhlc_current": ETorrentStatus.downloading,
        },
      },
      leechers: {
        elementProcess: (element: HTMLElement) => {
          return parseInt(element.firstChild!.textContent!);
        },
      },
    },
  },
  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      bonus: {
        selector: ["td.rowhead:contains('UCoin') + td > span"],
        attr: "title",
        filters: [(query: string) => parseFloat(query.replace(/,/gi, ""))],
      },
      seeding: {
        selector: [":self"],
        filters: [(query: string) => (query.match(/<b>(\d+)<\/b>条记录/) || ["0"])[1], { name: "parseNumber" }],
      },
      seedingSize: {
        selector: [":self"],
        filters: [
          (query: string) => (query.match(/大小.+?([\d.]+ [ZEPTGMK]?i?B)</) || ["0 B"])[1],
          { name: "parseSize" },
        ],
      },
    },
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id"],
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: ["name", "levelName", "uploaded", "downloaded", "bonus", "messageCount", "joinTime"],
      },
      {
        requestConfig: {
          url: "/getusertorrentlistajax.php",
          params: {
            type: "seeding",
          },
          responseType: "text",
        },
        assertion: { id: "params.userid" },
        fields: ["seeding", "seedingSize"],
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "御宅族",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege: "查看会员列表; 请求补种; 查看普通日志; 使用流量信息条",
    },
    {
      id: 2,
      name: "宅修士",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "无",
    },
    {
      id: 3,
      name: "宅教士",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.55,
      privilege: "无",
    },
    {
      id: 4,
      name: "宅传教士",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "无",
    },
    {
      id: 5,
      name: "宅护法",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "使用邀请名额; 无可用邀请时，购买邀请",
    },
    {
      id: 6,
      name: "宅贤者",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      privilege: "无",
    },
    {
      id: 7,
      name: "宅圣",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      privilege: "账号封存后永久保留.",
    },
    {
      id: 8,
      name: "宅神",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      privilege: "账号永久保留",
    },
  ],
};
