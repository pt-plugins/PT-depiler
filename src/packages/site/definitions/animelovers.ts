import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptions } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "animelovers",
  version: 1,
  name: "ANIMELOVERS",
  aka: ["动漫爱好者"],
  tags: ["动漫"],
  collaborator: ["hyuan280"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://navzrybiref.pyho/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Anime Movies", value: 1 },
        { name: "Anime Series", value: 2 },
        { name: "Anime OVA", value: 3 },
        { name: "Donghua Anime", value: 11 },
        { name: "Doujinshi", value: 9 },
        { name: "Manhua/Manhwa", value: 4 },
        { name: "Manga", value: 8 },
        { name: "Hentai", value: 7 },
        { name: "Lossless Music", value: 10 },
        { name: "Live Action (series)", value: 12 },
        { name: "Live Action (Movies)", value: 13 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "BDMV", value: 1 },
        { name: "Remux", value: 2 },
        { name: "BDRip", value: 10 },
        { name: "Encode", value: 3 },
        { name: "Encode RAW", value: 15 },
        { name: "DVDISO", value: 7 },
        { name: "DVDRip", value: 8 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "TS (Raw)", value: 9 },
        { name: "Color", value: 11 },
        { name: "Mono (Black & White)", value: 12 },
        { name: "FLAC", value: 13 },
        { name: "MP3", value: 14 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "4320p 10bit", value: 1 },
        { name: "4320p", value: 14 },
        { name: "2160p 10bit", value: 2 },
        { name: "2160p", value: 13 },
        { name: "1080p 10bit", value: 3 },
        { name: "1080p", value: 12 },
        { name: "1080i", value: 4 },
        { name: "816p 10bit", value: 11 },
        { name: "816p", value: 16 },
        { name: "720p 10bit", value: 5 },
        { name: "720p", value: 15 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
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
    {
      name: "标签",
      key: "tags",
      options: [
        { name: "内部组", value: "internal" },
        { name: "个人发布", value: "personalRelease" },
        { name: "Trumpable", value: "trumpable" },
        { name: "高速", value: "highspeed" },
        { name: "收藏", value: "bookmarked" },
        { name: "想要", value: "wished" },
      ],
      cross: { mode: "append", key: "" }, //  站点构造为  &exclusive=true ，但实际上与  &exclusive=1 相同
    },
    {
      name: "活跃度",
      key: "health",
      options: [
        { name: "存活", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "坟场", value: "graveyard" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "记录",
      key: "record",
      options: [
        { name: "Not Downloaded", value: "notDownloaded" },
        { name: "Downloaded", value: "downloaded" },
        { name: "Seeding", value: "seeding" },
        { name: "Leeching", value: "leeching" },
        { name: "Incomplete", value: "incomplete" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Primary Language",
      key: "primaryLanguageNames",
      options: buildCategoryOptions([["en", "ja", "kn", "ko", "ru", "te", "zh"]]),
      cross: { mode: "brackets" },
    },
  ],

  // TODO userInfo 中的 averageSeedingTime, hnrUnsatisfied 等其他字段

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户默认等级；可以发布种子",
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      interval: "P1M",
      ratio: 1.55,
      privilege: "直接发布种子，可以寄出邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      interval: "P2M",
      ratio: 2.5,
      privilege: "直接发布种子，可以寄出邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      interval: "P3M",
      ratio: 3.0,
      privilege: "直接发布种子，可以寄出邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      interval: "P6M",
      ratio: 4.15,
      privilege: "直接发布种子，可以寄出邀请",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      interval: "P12M",
      ratio: 5.2,
      privilege: "直接发布种子，可以寄出邀请，全局免费",
    },
    {
      id: 7,
      name: "Seeder",
      seedingSize: "5TiB",
      interval: "P1M",
      ratio: 0.4,
      averageSeedingTime: "P1M",
      privilege: "直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 8,
      name: "Archivist",
      seedingSize: "10TiB",
      interval: "P3M",
      ratio: 0.4,
      averageSeedingTime: "P2M",
      privilege: "直接发布种子，可以寄出邀请，可以无视H&R，全局免费，双倍上传",
    },
  ],
};
