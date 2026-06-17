import { SchemaMetadata as e, CategoryFree as n, userInfoTrans as i } from "../schemas/Unit3D-ChxolkI5.js";
import "../index-COeZNva1.js";
import { b as l } from "../utils/helper-OCngMtkv.js";
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
const s = { 1: "Movie", 9: "Sport", 2: "TV" },
  t = (a) =>
    a.map((r) => `span.user-profile-card__meta-item-title:contains('${r}') + span.user-profile-card__meta-item-value`),
  C = {
    ...e,
    version: 1,
    id: "aither",
    name: "Aither",
    aka: ["ATH"],
    tags: ["影视"],
    timezoneOffset: "+0000",
    collaborator: ["akina"],
    type: "private",
    schema: "Unit3D",
    urls: ["uggcf://nvgure.pp/"],
    category: [
      { name: "类别", key: "categoryIds", options: l(s), cross: { mode: "brackets" } },
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
          { name: "Other", value: 7 },
          { name: "Movie Pack", value: 10 },
          { name: "Music - General", value: 20 },
          { name: "Blues", value: 29 },
          { name: "Classical", value: 30 },
          { name: "Electronic", value: 31 },
          { name: "Hip-Hop / Rap", value: 32 },
          { name: "Jazz &amp; Funk", value: 33 },
          { name: "Latin", value: 34 },
          { name: "Pop", value: 35 },
          { name: "Rock", value: 36 },
          { name: "Test", value: 16 },
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
        ],
        cross: { mode: "brackets" },
      },
      n,
    ],
    search: {
      ...e.search,
      skipNonLatinCharacters: !0,
      selectors: {
        ...e.search.selectors,
        category: { selector: ":self", data: "categoryId", filters: [(a) => s[Number(a)]] },
        tags: [...e.search.selectors.tags, { name: "H&R", selector: "*", color: "red" }],
      },
    },
    userInfo: {
      ...e.userInfo,
      selectors: {
        ...e.userInfo.selectors,
        id: { ...e.userInfo.selectors.id, selector: t(i.id) },
        seedingSize: { ...e.userInfo.selectors.seedingSize, selector: t(i.seedingSize) },
        joinTime: { ...e.userInfo.selectors.joinTime, selector: i.joinTime.map((a) => `span[title='${a}'] span`) },
        averageSeedingTime: { ...e.userInfo.selectors.averageSeedingTime, selector: t(i.averageSeedingTime) },
        lastAccessAt: { selector: t(i.lastAccessAt), filters: [{ name: "parseTTL" }] },
        invites: { ...e.userInfo.selectors.invites, selector: ".ratio-bar__invites" },
        ratio: { selector: "li.ratio-bar__ratio a:has( > i.fa-sync-alt)", filters: [{ name: "parseNumber" }] },
        uploads: {
          selector: ".user-profile-card__meta-item a[href*='/uploads']",
          elementProcess: (a) => {
            const r = a.textContent || "",
              o = r.match(/\((\d+)\)/) ?? r.match(/\d+/);
            return o ? parseInt(o[o.length - 1]) : void 0;
          },
        },
      },
    },
    levelRequirements: [
      { id: 1, name: "Phobos", privilege: "4下载槽" },
      {
        id: 2,
        name: "Harmonia",
        ratio: 0.6,
        interval: "P1M",
        alternative: [{ uploaded: "500GiB" }, { seedingSize: "1TiB" }],
        privilege: "10下载槽",
      },
      {
        id: 3,
        name: "Zeus",
        ratio: 0.6,
        interval: "P3M",
        averageSeedingTime: "P10D",
        alternative: [{ uploaded: "2TiB" }, { seedingSize: "2TiB" }],
        privilege: "25下载槽",
      },
      {
        id: 4,
        name: "Helios",
        ratio: 0.8,
        interval: "P6M",
        averageSeedingTime: "P20D",
        uploads: 1,
        alternative: [{ uploaded: "5TiB" }, { seedingSize: "5TiB" }],
        privilege: "50下载槽 发送邀请",
      },
      {
        id: 5,
        name: "Prometheus",
        ratio: 1,
        interval: "P8M",
        averageSeedingTime: "P45D",
        uploads: 5,
        alternative: [{ uploaded: "10TiB" }, { seedingSize: "10TiB" }],
        privilege: "访问邀请区 50下载槽 发送邀请",
      },
      {
        id: 6,
        name: "Oceanus",
        ratio: 1.5,
        interval: "P12M",
        averageSeedingTime: "P2M",
        uploads: 10,
        alternative: [{ uploaded: "20TiB" }, { seedingSize: "20TiB" }],
        privilege: "自动通过候选 访问邀请区  50下载槽 发送邀请",
      },
      {
        id: 7,
        name: "Gigantes",
        ratio: 1.5,
        interval: "P15M",
        averageSeedingTime: "P3M",
        uploads: 15,
        alternative: [{ uploaded: "40TiB" }, { seedingSize: "40TiB" }],
        privilege: "自动通过候选 访问邀请区 不计算下载量 50下载槽 发送邀请",
      },
      {
        id: 8,
        name: "Titan",
        ratio: 2,
        interval: "P24M",
        averageSeedingTime: "P6M",
        uploads: 20,
        alternative: [{ uploaded: "100TiB" }, { seedingSize: "65TiB" }],
        privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 50下载槽 发送邀请",
      },
    ],
  };
export { C as siteMetadata };
