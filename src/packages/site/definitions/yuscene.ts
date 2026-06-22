import type { ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict, parseValidTimeString } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
  7: "Game",
  8: "Music",
  9: "Application",
  10: "Music Video",
  11: "Sport",
  12: "eBook",
  13: "Audiobook",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "yuscene",
  version: 1,
  name: "YUSCENE",
  aka: ["YS"],
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://yu-scene.net/"],
  favicon: "https://yu-scene.net/favicon.ico",

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" },
    },
    CategoryFree,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: {
        selector: ":self",
        data: "categoryId",
        filters: [(query: string) => categoryMap[Number(query)]],
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      levelName: {
        selector: [
          "span.user-tag.profile-hero__username a.user-tag__link[title]",
          "main article section:first-of-type div div:nth-child(2) > span > a.user-tag__link[title]",
          ...(SchemaMetadata.userInfo!.selectors!.levelName?.selector ?? []),
        ],
        elementProcess: (el: Element) => el.getAttribute("title") || el.textContent,
      },
      joinTime: {
        selector: [
          "time.profile-hero__meta-item--registration",
          "time.profile-hero__meta-item--registration strong.profile-hero__meta-value",
          "main article section:first-of-type div div:nth-child(2) div time strong.profile-hero__meta-value",
          ...(SchemaMetadata.userInfo!.selectors!.joinTime?.selector ?? []),
        ],
        elementProcess: (el: Element) => {
          const timeEl = el.closest("time") ?? el;
          return parseValidTimeString(
            timeEl.getAttribute("title") || timeEl.getAttribute("datetime") || el.textContent || "",
          );
        },
      },
      lastAccessAt: {
        selector: [
          "span.profile-hero__meta-item time[datetime]",
          "main article section:first-of-type div div:nth-child(2) div span:first-of-type time[datetime]",
          ...(SchemaMetadata.userInfo!.selectors!.lastAccessAt?.selector ?? []),
        ],
        elementProcess: (el: Element) => {
          return parseValidTimeString(el.getAttribute("title") || el.getAttribute("datetime") || el.textContent || "");
        },
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Leech",
      privilege: "0下载槽 上传种子",
    },
    {
      id: 1,
      name: "User",
      ratio: 0,
      privilege: "20下载槽 上传种子",
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      ratio: 0.4,
      interval: "P1M",
      privilege: "无限下载槽 上传种子 发送邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      ratio: 0.4,
      interval: "P2M",
      privilege: "无限下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      ratio: 0.4,
      interval: "P3M",
      privilege: "无限下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      ratio: 0.4,
      interval: "P6M",
      privilege: "无限下载槽 上传种子 发送邀请",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      ratio: 0.4,
      interval: "P1Y",
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 免疫自动 HnR 警告 免审核发布",
    },
    {
      id: 7,
      name: "Seeder",
      ratio: 0.4,
      interval: "P1M",
      seedingSize: "4TiB",
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 免审核发布",
    },
    {
      id: 8,
      name: "Curator",
      ratio: 0.4,
      interval: "P2M",
      averageSeedingTime: "P1M",
      seedingSize: "10TiB",
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 免疫自动 HnR 警告 免审核发布",
    },
    {
      id: 9,
      name: "Archivist",
      ratio: 0.4,
      interval: "P3M",
      averageSeedingTime: "P2M",
      seedingSize: "20TiB",
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 2x上传 免疫自动 HnR 警告 免审核发布",
    },
    {
      id: 10,
      name: "Titan",
      ratio: 0.4,
      interval: "P3M",
      averageSeedingTime: "P3M",
      seedingSize: "40TiB",
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 2x上传 免疫自动 HnR 警告 免审核发布",
    },
  ],
};
