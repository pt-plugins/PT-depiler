import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptions } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "fearnopeer",
  version: 1,
  name: "FearNoPeer",
  aka: ["FNP"],
  tags: ["综合"],
  timezoneOffset: "-0500",
  collaborator: ["hyuan280"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://srneabcrre.pbz/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movie", value: 1 },
        { name: "TV", value: 2 },
        { name: "Music", value: 3 },
        { name: "Anime", value: 6 },
        { name: "Games", value: 4 },
        { name: "Apps", value: 5 },
        { name: "Sport", value: 9 },
        { name: "Assorted", value: 11 },
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
        { name: "SDTV", value: 18 },
        { name: "FLAC", value: 7 },
        { name: "MP3", value: 11 },
        { name: "Mac", value: 12 },
        { name: "Windows", value: 13 },
        { name: "Console", value: 17 },
        { name: "Books", value: 15 },
        { name: "AudioBooks", value: 14 },
        { name: "Misc", value: 16 },
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
        { name: "1080i", value: 11 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 15 },
        { name: "480p", value: 8 },
        { name: "480i", value: 14 },
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
        { name: "Musical", value: 22 },
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
      options: buildCategoryOptions([
        ["ab", "af", "am", "ar", "as", "az", "bg", "bn", "bo", "bs", "ca", "cn", "cr", "cs", "cy", "da", "de", "dz"],
        ["el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fr", "ga", "gl", "gu", "he", "hi", "hr", "ht", "hu"],
        ["hy", "id", "ig", "is", "it", "iu", "ja", "ka", "kk", "kl", "km", "kn", "ko", "ku", "ky", "la", "lt", "lv"],
        ["mi", "mk", "ml", "mn", "mo", "mr", "ms", "mt", "nb", "ne", "nl", "no", "or", "pa", "pl", "ps", "pt", "ro"],
        ["ru", "rw", "se", "sh", "sk", "sl", "so", "sq", "sr", "st", "sv", "sw", "ta", "te", "tg", "th", "tl", "tn"],
        ["tr", "uk", "ur", "vi", "wo", "xh", "xx", "yo", "zh", "zu"],
      ]),
      cross: { mode: "brackets" },
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户默认等级；下载队列10个，可以发布种子",
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "下载队列20个，可以发布种子，可以寄出邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "下载队列30个，直接发布种子，可以寄出邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "下载队列40个，直接发布种子，可以寄出邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "下载队列50个，直接发布种子，可以寄出邀请",
    },
    {
      id: 6,
      name: "Seeder",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 7,
      name: "Curator",
      seedingSize: "10TiB",
      interval: "P2M",
      averageSeedingTime: "P60D",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 8,
      name: "Veteran",
      uploaded: "100TiB",
      seedingSize: "5TiB",
      averageSeedingTime: "P30D",
      interval: "P12M",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 9,
      name: "Archivist",
      seedingSize: "20TiB",
      interval: "P3M",
      averageSeedingTime: "P90D",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R，双倍上传",
    },
  ],
};
