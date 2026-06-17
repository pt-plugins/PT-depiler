import { SchemaMetadata as r } from "../schemas/Unit3D-ChxolkI5.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../index-COeZNva1.js";
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
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const H = {
  ...r,
  id: "bitporn",
  version: 1,
  name: "BitPorn",
  tags: ["成人"],
  timezoneOffset: "+0200",
  collaborator: ["hyuan280"],
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://ovgcbea.rh/"],
  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Amateur", value: "4" },
        { name: "Anal", value: "5" },
        { name: "Asian", value: "6" },
        { name: "BBW", value: "7" },
        { name: "BDSM", value: "8" },
        { name: "Big Ass", value: "9" },
        { name: "Big Tits", value: "10" },
        { name: "Black", value: "11" },
        { name: "Cartoon", value: "12" },
        { name: "Casting", value: "13" },
        { name: "Classic", value: "14" },
        { name: "Collection", value: "15" },
        { name: "Creampie", value: "16" },
        { name: "Cumshot", value: "17" },
        { name: "Deepthroat", value: "18" },
        { name: "Extreme", value: "19" },
        { name: "Fansite", value: "20" },
        { name: "Family", value: "21" },
        { name: "Feature", value: "22" },
        { name: "Fetish", value: "23" },
        { name: "Fisting", value: "24" },
        { name: "Gangbang", value: "25" },
        { name: "Game", value: "26" },
        { name: "Gay / Bi", value: "27" },
        { name: "Hair", value: "28" },
        { name: "Hardcore", value: "29" },
        { name: "HiddenCam", value: "30" },
        { name: "Homemade", value: "31" },
        { name: "Interracial", value: "32" },
        { name: "Lesbian", value: "33" },
        { name: "Magyar", value: "34" },
        { name: "Masturbation", value: "35" },
        { name: "Mature", value: "36" },
        { name: "Milf", value: "37" },
        { name: "Old and Young", value: "38" },
        { name: "Parody", value: "39" },
        { name: "Pictures", value: "40" },
        { name: "Pissing", value: "41" },
        { name: "POV", value: "42" },
        { name: "Pregnant", value: "43" },
        { name: "Public", value: "44" },
        { name: "Shemale", value: "45" },
        { name: "Softcore", value: "46" },
        { name: "Squirt", value: "47" },
        { name: "Straight", value: "48" },
        { name: "Teen", value: "49" },
        { name: "Threesome", value: "50" },
        { name: "VR", value: "51" },
        { name: "Uncategorized", value: "52" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "Other", value: "11" },
        { name: "SD", value: "12" },
        { name: "720p", value: "17" },
        { name: "1080p", value: "13" },
        { name: "2048p (2K)", value: "14" },
        { name: "2160p (4K)", value: "18" },
        { name: "3160p (6K)", value: "15" },
        { name: "4320p (8K)", value: "16" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Freeleech", value: "0" },
        { name: "25% Freeleech", value: "25" },
        { name: "50% Freeleech", value: "50" },
        { name: "75% Freeleech", value: "75" },
        { name: "100% Freeleech", value: "100" },
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
  ],
  search: {
    ...r.search,
    selectors: {
      ...r.search.selectors,
      subTitle: {
        selector: ["div.torrent-keywords-container"],
        elementProcess: (n) => {
          if (!n) return 0;
          const a = n.querySelectorAll("a.torrent-keywords-badge");
          return Array.from(a)
            .map((m) => (m.textContent || m.innerText || "").trim())
            .filter((m) => m.length > 0)
            .join(", ");
        },
      },
    },
  },
  levelRequirements: [
    { id: 1, name: "User", privilege: "新用户默认等级；下载队列5个，可以发布种子" },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "下载队列10个，可以发布种子，可以寄出邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "下载队列20个，可以发布种子，可以寄出邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "下载队列30个，直接发布种子，可以寄出邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "下载队列40个，直接发布种子，可以寄出邀请",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      interval: "P12M",
      privilege: "下载队列50个，全局免费，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 7,
      name: "Seeder",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P1M",
      privilege: "下载队列80个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 8,
      name: "Archivist",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P2M",
      privilege: "下载队列无限，全局免费，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 9,
      name: "Wizard",
      seedingSize: "500TiB",
      ratio: 20,
      interval: "P3Y",
      averageSeedingTime: "P3M19DT12H",
      privilege: "下载队列无限，全局免费，直接发布种子，可以寄出邀请，可以无视H&R，双倍上传",
    },
  ],
};
export { H as siteMetadata };
