/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/agsvpt.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/14946
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";
import { extractContent } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "agsvpt",
  name: "AGSVPT",
  aka: ["末日种子库"],
  description: "Arctic Global Seed Vault", // 站点说明
  tags: ["综合", "短剧", "影视"],
  timezoneOffset: "+0800",
  collaborator: ["0X0000005"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cg.ntficg.pa/", "uggcf://jjj.ntficg.pbz/", "uggcf://arj.ntficg.pa/"],

  officialGroupPattern: [/AGSV(PT|E|WEB|REMUX|Rip|TV|DIY|MUS)?$/i],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movie(电影)", value: 401 },
        { name: "MV(演唱)", value: 406 },
        { name: "TV Series(电视剧)", value: 402 },
        { name: "TV Shows(综艺)", value: 403 },
        { name: "Documentaries(纪录片)", value: 404 },
        { name: "Anime(动漫)", value: 405 },
        { name: "Playlet（短剧）", value: 419 },
        { name: "Music(音乐)", value: 411 },
        { name: "Audio(音频)", value: 408 },
        { name: "Sports(体育)", value: 407 },
        { name: "Game(游戏)", value: 413 },
        { name: "E-Book(电子书/有声书)", value: 415 },
      ],
      cross: { mode: "append" },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        selector: ["div.torrent_title_desc"],
        elementProcess: (element: HTMLDivElement) => {
          const e = element.cloneNode(true) as HTMLDivElement;
          e.querySelectorAll("span").forEach((el) => el.remove());
          return extractContent(e.innerHTML).trim();
        },
      },
    },
  },
  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["td.rowhead:contains('冰晶') + td, td.rowhead:contains('Karma Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 1,
      name: "Power User",
      nameAka: ["北冰珍珠熊"],
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege: "可以进入银行贷款",
    },
    {
      id: 2,
      name: "Elite User",
      nameAka: ["深渊蔚蓝熊"],
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "可以得到一个邀请名额；Elite User及以上用户封存账号后不会被删除。  ",
    },
    {
      id: 3,
      name: "Crazy User",
      nameAka: ["翡翠森林熊"],
      interval: "P12W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      nameAka: ["神秘紫晶熊"],
      interval: "P20W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 400000,
      privilege: "查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      nameAka: ["寒冰白金熊"],
      interval: "P28W",
      downloaded: "750GB",
      ratio: 4.05,
      seedingBonus: 800000,
      isKept: true,
      privilege: "永远保留账号；查看其它用户的评论、帖子历史",
    },
    {
      id: 6,
      name: "Extreme User",
      nameAka: ["皇家金辉熊"],
      interval: "P40W",
      downloaded: "1TB",
      ratio: 5.05,
      seedingBonus: 1400000,
      isKept: true,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。  ",
    },
    {
      id: 7,
      name: "Ultimate User",
      nameAka: ["永恒铂金熊"],
      interval: "P52W",
      downloaded: "1.5TB",
      ratio: 6.05,
      seedingBonus: 2200000,
      isKept: true,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      nameAka: ["钻石之冠北极熊"],
      interval: "P70W",
      downloaded: "3TB",
      ratio: 7.05,
      seedingBonus: 3200000,
      isKept: true,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
  ],
};
