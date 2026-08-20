import type { ISiteMetadata } from "../types";
import { parseSectionedHitAndRunElement, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "piggo",
  name: "Piggo",
  description: "猪猪网",
  tags: ["影视", "综合", "少儿"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cvttb.zr/"],

  /**
   * 站点已部署雷池（SafeLine）WAF：torrents.php 对浏览器 JS 环境以外的客户端
   * （如插件后台的 fetch）一律返回 468 质询页，导致扩展搜索无结果（refs #1394）。
   * search.php 为站方提供的全站搜索入口（覆盖大众区与儿童区），不受该 WAF 规则限制，
   * 但仅支持关键字与 search_area 参数，不支持分类等过滤参数，故不再声明 category。
   */
  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      ...SchemaMetadata.search!.requestConfig!,
      url: "/search.php",
    },
  },

  officialGroupPattern: [/PigoHD|PigoWeb|PiGoNF/i],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      messageCount: {
        text: 0,
        selector: "div.message-alerts-container",
        elementProcess: (e: HTMLElement) => {
          let total = 0;
          const alertDivs = e.querySelectorAll("div.message-alert");
          for (const div of alertDivs) {
            const numberMatch = div.textContent?.match(/(\d+)/);
            total += numberMatch && numberMatch.length >= 2 ? parseInt(numberMatch[1], 10) : 0;
          }
          return total;
        },
      },
      hnrPreWarning: {
        text: 0,
        selector: ["#info_block a[href*='myhr.php']:last"],
        elementProcess: (element: HTMLElement) => {
          return parseSectionedHitAndRunElement(element)?.hnrPreWarning ?? 0;
        },
      },
      hnrUnsatisfied: {
        text: 0,
        selector: ["#info_block a[href*='myhr.php']:last"],
        elementProcess: (element: HTMLElement) => {
          return parseSectionedHitAndRunElement(element)?.hnrUnsatisfied ?? 0;
        },
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "乳猪",
      privilege: "新用户的默认级别。无法直接发布种子，需添加候选后等待审核。",
    },
    {
      id: 2,
      name: "烤乳猪",
      downgrade:
        "下载≥20GB且分享率≤0.4，下载≥100GB且分享率≤0.5，下载≥200GB且分享率≤0.6，下载≥400GB且分享率≤0.7，下载≥800GB且分享率≤0.8时自动降级本级。",
      privilege: "限制功能，如发表、申请链接、上传字幕等。",
    },
    {
      id: 3,
      name: "猪仔",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 2,
      seedingBonus: 40000,
      privilege:
        "可直接发布种子，可查看NFO文档、用户列表，请求续种，查看排行榜，查看他人种子历史（未设强隐私时），可删除自己上传的字幕。",
    },
    {
      id: 4,
      name: "香猪",
      interval: "P8W",
      downloaded: "300GB",
      ratio: 2.5,
      seedingBonus: 80000,
      privilege: "香猪及以上封存账号后不会被删除。",
    },
    {
      id: 5,
      name: "野猪",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 3,
      seedingBonus: 150000,
      privilege: "得到一个永久邀请名额；可做种/下载/发布时选择匿名模式。",
    },
    {
      id: 6,
      name: "猪王",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 3.5,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 7,
      name: "猪妖",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 4,
      seedingBonus: 400000,
      privilege: "得到两个永久邀请名额；可以查看其他用户评论、帖子历史。",
    },
    {
      id: 8,
      name: "二师兄",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 4.5,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息，可以查看二师兄论坛。",
    },
    {
      id: 9,
      name: "净坛使者",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 5,
      seedingBonus: 800000,
      privilege: "得到三个邀请名额。",
    },
    {
      id: 10,
      name: "天蓬元帅",
      interval: "P100W",
      downloaded: "6TB",
      ratio: 6,
      seedingBonus: 1000000,
      isKept: true,
      privilege: "得到五个邀请名额，天蓬元帅及以上账号永久保留。",
    },
  ],
};
