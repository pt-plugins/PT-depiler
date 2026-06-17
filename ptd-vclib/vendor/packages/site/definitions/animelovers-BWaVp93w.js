import { SchemaMetadata as m } from "../schemas/Unit3D-ChxolkI5.js";
import "../index-COeZNva1.js";
import { a as i } from "../utils/helper-OCngMtkv.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const B = {
  ...m,
  id: "animelovers",
  version: 1,
  name: "ANIMELOVERS",
  aka: ["动漫爱好者"],
  tags: ["动漫"],
  collaborator: ["hyuan280"],
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://navzrybiref.pyho/"],
  favicon: "./_default_unit3d.ico",
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
        { name: "Double Upload", value: "doubleup" },
        { name: "Featured", value: "featured" },
        { name: "Refundable", value: "refundable" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (n) => {
        const a = { free: [] };
        return (
          n.forEach((e) => {
            e === "doubleup" || e === "featured" || e === "refundable" ? (a[e] = 1) : a.free.push(e);
          }),
          { requestConfig: { params: a } }
        );
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
      cross: { mode: "append", key: "" },
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
      options: i([["en", "ja", "kn", "ko", "ru", "te", "zh"]]),
      cross: { mode: "brackets" },
    },
  ],
  levelRequirements: [
    { id: 1, name: "User", privilege: "新用户默认等级；可以发布种子" },
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
      ratio: 3,
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
export { B as siteMetadata };
