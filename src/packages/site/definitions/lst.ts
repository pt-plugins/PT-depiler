import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "lst",
  name: "LST",
  description: "Something cool",
  tags: ["综合", "影视"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://yfg.tt/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movie", value: 1 },
        { name: "TV", value: 2 },
        { name: "Music", value: 3 },
        { name: "Game", value: 4 },
        { name: "Application", value: 5 },
        { name: "XXX", value: 8 },
        { name: "Ebook/Manga", value: 9 },
        { name: "Education", value: 10 },
        { name: "FANRES", value: 11 },
      ],
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
        { name: "Linux", value: 14 },
        { name: "Other", value: 15 },
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
        { name: "Extras", value: 11 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Buff",
      key: "free",
      options: [
        // 25% - 75% 没有实际使用
        { name: "Normal", value: 0 },
        { name: "Free", value: 100 },
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
    skipNonLatinCharacters: true,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: { selector: "span.torrent-search--list__uploader > div:nth-child(1)" },
      tags: [
        {
          name: "Free",
          selector: "div[title*='100%'], i.torrent-icons__featured",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "i.fa-chevron-double-up, i.torrent-icons__double-upload, i.torrent-icons__featured",
          color: "lime",
        },
        {
          name: "置顶",
          selector: "i.fa-thumbtack",
          color: "red",
        },
        {
          name: "可退款",
          selector: "i.fa-percentage, i[title*='Refundable']",
          color: "gray",
        },
        {
          name: "Internal",
          selector: "i.torrent-icons__internal",
          color: "purple",
        },
        {
          name: "个人发布",
          selector: "i.torrent-icons__personal-release",
          color: "purple",
        },
        {
          name: "Highspeed",
          selector: "i.torrent-icons__highspeed",
          color: "red",
        },
        {
          name: "Trump",
          selector: "i.fa-skull.torrent-icons__bumped",
          color: "red",
        },
        {
          name: "H&R",
          selector: "*",
          color: "red",
        },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      uploads: {
        selector: "div.profile-mini-stat__label:contains('Total uploads') + div",
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        ...SchemaMetadata.userInfo!.selectors!.joinTime!,
        selector: "span.profile-hero__meta-item:contains('Registration date')",
      },
      seedingSize: {
        selector: "div.profile-mini-stat__label:contains('Seeding size') + div",
        filters: [{ name: "parseSize" }],
      },
      averageSeedingTime: {
        selector: "div.profile-mini-stat__label:contains('Average seedtime') + div",
        filters: [{ name: "parseDuration" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Leech",
    },
    {
      id: 1,
      name: "Crab",
      ratio: 0.4,
      privilege: "5下载槽 上传种子",
    },
    {
      id: 2,
      name: "Goldfish",
      interval: "P1M",
      ratio: 0.6,
      alternative: [{ uploaded: "1TiB" }, { seedingSize: "100GiB" }],
      averageSeedingTime: "P1W",
      privilege: "10下载槽 上传种子",
    },
    {
      id: 3,
      name: "Lobster",
      interval: "P2M",
      ratio: 0.7,
      alternative: [{ uploaded: "5TiB" }, { seedingSize: "500GiB" }],
      averageSeedingTime: "P2W",
      privilege: "15下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "Sailboat",
      interval: "P6M",
      ratio: 1,
      seedingSize: "10TiB",
      averageSeedingTime: "P2M",
      privilege: "25下载槽 上传种子 发送邀请 站免",
    },
    {
      id: 5,
      name: "Ship",
      interval: "P1Y",
      ratio: 1.5,
      seedingSize: "20TiB",
      averageSeedingTime: "P3M",
      privilege: "50下载槽 上传种子 发送邀请 站免 免疫HR",
    },
    {
      id: 6,
      name: "Cargo Ship",
      interval: "P2Y",
      ratio: 2,
      seedingSize: "50TiB",
      averageSeedingTime: "P6M",
      privilege: "75下载槽 上传种子 发送邀请 站免 免疫HR",
    },
    {
      id: 7,
      name: "Dolphin",
      interval: "P3M",
      ratio: 1,
      alternative: [{ uploaded: "10TiB" }, { seedingSize: "2TiB" }],
      averageSeedingTime: "P2W6D",
      uploads: 5,
      privilege: "20下载槽 上传种子 发送邀请 站免 自动通过候选",
    },
    {
      id: 8,
      name: "Whale",
      interval: "P4M",
      ratio: 1,
      alternative: [{ uploaded: "25TiB" }, { seedingSize: "6TiB" }],
      averageSeedingTime: "P1M",
      uploads: 10,
      privilege: "25下载槽 上传种子 发送邀请 站免 免疫HR 自动通过候选",
    },
    {
      id: 9,
      name: "Leviathan",
      interval: "P1Y",
      ratio: 1.5,
      alternative: [{ uploaded: "50TiB" }, { seedingSize: "20TiB" }],
      averageSeedingTime: "P3M",
      uploads: 15,
      privilege: "50下载槽 上传种子 发送邀请 站免 免疫HR 自动通过候选",
    },
    {
      id: 10,
      name: "Cthulhu",
      interval: "P2Y",
      ratio: 2,
      alternative: [{ uploaded: "100TiB" }, { seedingSize: "50TiB" }],
      averageSeedingTime: "P6M",
      uploads: 20,
      privilege: "75下载槽 上传种子 发送邀请 站免 免疫HR 自动通过候选",
    },
  ],
};
