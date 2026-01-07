import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "oldtoonsworld",
  version: 1,
  name: "OldToonsWorld",
  aka: ["OTW"],
  description: "Old Toons World (OTW) is a Private Torrent Tracker for ANIMATED MOVIES / TV",
  tags: ["动画", "电视剧"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://byqgbbaf.jbeyq/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV", value: 2 },
        { name: "Books", value: 3 },
        { name: "Audio", value: 4 },
        { name: "Games", value: 5 },
        { name: "WOC", value: 6 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "Full Blu-Ray", value: 1 },
        { name: "Remux", value: 2 },
        { name: "Encode", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "Full DVD", value: 7 },
        { name: "DVDRip", value: 8 },
        { name: "VHSRip", value: 14 },
        { name: "Comics", value: 9 },
        { name: "Manga", value: 10 },
        { name: "SoundTrack", value: 11 },
        { name: "For Kids", value: 12 },
        { name: "Pack", value: 13 },
        { name: "Games", value: 15 },
        { name: "Upscale", value: 16 },
        { name: "TV Rip", value: 17 },
        { name: "WOC", value: 18 },
        { name: "LaserDisc", value: 19 },
        { name: "AudioBooks", value: 21 },
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
        { name: "640p", value: 11 },
        { name: "Undefined", value: 12 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "题材",
      key: "genreIds",
      options: [
        { name: "Action", value: 28 },
        { name: "Action & Adventure", value: 10759 },
        { name: "Adventure", value: 12 },
        { name: "Animation", value: 16 },
        { name: "Comedy", value: 35 },
        { name: "Crime", value: 80 },
        { name: "Documentary", value: 99 },
        { name: "Drama", value: 18 },
        { name: "Family", value: 10751 },
        { name: "Fantasy", value: 14 },
        { name: "History", value: 36 },
        { name: "Horror", value: 27 },
        { name: "Kids", value: 10762 },
        { name: "Music", value: 10402 },
        { name: "Mystery", value: 9648 },
        { name: "News", value: 10763 },
        { name: "Reality", value: 10764 },
        { name: "Romance", value: 10749 },
        { name: "Sci-Fi & Fantasy", value: 10765 },
        { name: "Science Fiction", value: 878 },
        { name: "Soap", value: 10766 },
        { name: "Talk", value: 10767 },
        { name: "Thriller", value: 53 },
        { name: "TV Movie", value: 10770 },
        { name: "War", value: 10752 },
        { name: "War & Politics", value: 10768 },
        { name: "Western", value: 37 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Freeleech", value: 0 },
        { name: "25% Freeleech", value: 25 },
        { name: "50% Freeleech", value: 50 },
        { name: "75% Freeleech", value: 75 },
        { name: "100% Freeleech", value: 100 },
        { name: "Double Upload", value: "doubleup" }, // 双倍上传
        { name: "Featured", value: "featured" }, // 精选
        { name: "Refundable", value: "refundable" }, //可退还的
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
            params[value] = 1; // 双倍上传和精选使用 1 来表示
          } else {
            params.free.push(value); // 其他优惠使用 free 数组
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
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        {
          name: "H&R",
          selector: "*",
          color: "red",
        },
      ],
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      ratio: 0.4,
      privilege: "无限下载槽 上传种子",
    },
    {
      id: 2,
      name: "PowerUser",
      ratio: 0.4,
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "无限下载槽 上传种子 发送邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      ratio: 0.4,
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "无限下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      ratio: 0.4,
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "无限下载槽 直接发布种子 发送邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      ratio: 0.4,
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "无限下载槽 直接发布种子 发送邀请",
    },
    {
      id: 6,
      name: "Veteran",
      ratio: 0.4,
      uploaded: "100TiB",
      interval: "P12M",
      privilege: "无限下载槽 直接发布种子 站免 发送邀请",
    },
    {
      id: 7,
      name: "Seeder",
      ratio: 0.4,
      seedingSize: "5TiB",
      averageSeedingTime: "P1M",
      interval: "P1M",
      privilege: "无限下载槽 直接发布种子 免疫HR 发送邀请",
    },
    {
      id: 8,
      name: "Archivist",
      ratio: 0.4,
      seedingSize: "10TiB",
      averageSeedingTime: "P2M",
      interval: "P3M",
      privilege: "无限下载槽 直接发布种子 站免 免疫HR 发送邀请",
    },
    {
      id: 9,
      name: "VIP",
      groupType: "vip",
      privilege: "无限下载槽 直接发布种子 站免 双倍上传 免疫HR 发送邀请",
    },
  ],
};
