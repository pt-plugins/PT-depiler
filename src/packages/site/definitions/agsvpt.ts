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
    },
    {
      id: 3,
      name: "Crazy User",
      nameAka: ["翡翠森林熊"],
      interval: "P12W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
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
    },
    {
      id: 7,
      name: "Ultimate User",
      nameAka: ["永恒铂金熊"],
      interval: "P52W",
      downloaded: "1.5TB",
      ratio: 6.05,
      seedingBonus: 2200000,
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
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
  ],
};
