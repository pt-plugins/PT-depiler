/**
 * Samaritano（SAM）—— 私有综合站，**UNIT3D**（葡语界面）。
 *
 * 来源与证据：
 * - tracker-tracker registry 收录（`platform: unit3d`，`last_updated` 2026-11-15），本文件据此新增；
 *   Jackett 侧目前没有对应定义，故无 `@JackettDefinitions` 关联行。
 * - ✅ 2026-11-20 实测：`https://samaritano.cc/` → 302 到 `/login`，标题「Login - SAMARITANO」；
 *   `/api/user`、`/api/torrents`、`/api/torrents/filter` 未授权时均返回
 *   `401 {"message":"Unauthenticated."}` —— 与 UNIT3D 的 Bearer 鉴权 API 一致。
 *
 * ⚠️ 无账号，以下未实测，故**不覆写** `category` 与 `search`，沿用 Unit3D 引擎默认：
 * - 站点分类的 id 与名称（UNIT3D 各家自定义，猜错会导致筛选失效）；
 * - 列表页/详情页选择器（引擎默认选择器已覆盖 UNIT3D 标准模板）。
 * 待有账号后再补分类表与选择器覆写。
 *
 * 等级阶梯取自 tracker-tracker registry 的 `userClasses[].requirements`（结构化字段），
 * 仅收录「有晋升要求」的用户组；Uploader / Editor / Trustee / Moderador / Administrator /
 * Owner 等职务类或自由裁量组不收（与仓库既有约定一致）。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "samaritano",
  name: "Samaritano",
  aka: ["SAM"],
  description: "Samaritano is a Private Torrent Tracker (UNIT3D)",
  tags: ["综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://samaritano.cc/"],

  levelRequirements: [
    {
      id: 1,
      name: "Leech",
      privilege: "初始组；ratio 跌破 1.00 且 buffer 为负时会被降回该组",
    },
    {
      id: 2,
      name: "User",
      ratio: 0.4,
      privilege: "3 下载槽、可上传种子、可发邀请",
    },
    {
      id: 3,
      name: "Habitante",
      uploaded: "1TiB",
      ratio: 1.0,
      interval: "P1M",
      averageSeedingTime: "P7D",
      seedingSize: "1.5GiB",
      privilege: "15 下载槽",
    },
    {
      id: 4,
      name: "Benfeitor",
      uploaded: "5TiB",
      ratio: 1.0,
      interval: "P4M",
      averageSeedingTime: "P7D",
      seedingSize: "1.5GiB",
      privilege: "25 下载槽",
    },
    {
      id: 5,
      name: "Protetor",
      uploaded: "10TiB",
      ratio: 1.5,
      interval: "P5M",
      averageSeedingTime: "P1M",
      seedingSize: "1.5GiB",
      privilege: "25 下载槽",
    },
    {
      id: 6,
      name: "Sentinela",
      uploaded: "25TiB",
      ratio: 1.0,
      interval: "P6M",
      averageSeedingTime: "P1M",
      seedingSize: "1.5GiB",
      privilege: "30 下载槽",
    },
    {
      id: 7,
      name: "Bom-Samaritano",
      uploaded: "50TiB",
      ratio: 1.0,
      interval: "P1Y",
      averageSeedingTime: "P1M",
      seedingSize: "1.5GiB",
      privilege: "60 下载槽、Freeleech",
    },
    {
      id: 8,
      name: "Guardião",
      uploaded: "75TiB",
      ratio: 1.0,
      interval: "P12M",
      averageSeedingTime: "P1M2W1D",
      seedingSize: "1.5GiB",
      privilege: "80 下载槽、Freeleech、双倍上传、免 HnR 警告",
    },
    {
      id: 9,
      name: "Veterano",
      uploaded: "100TiB",
      ratio: 1.0,
      interval: "P1Y",
      averageSeedingTime: "P1M2W1D",
      privilege: "无限下载槽、Freeleech、双倍上传、免 HnR 警告、可绕过种子审核",
    },
    {
      id: 10,
      name: "Colaborador Junior",
      uploaded: "5TiB",
      ratio: 1.0,
      interval: "P1M",
      averageSeedingTime: "P7D",
      seedingSize: "1.5GiB",
      uploads: 50,
      privilege: "40 下载槽",
    },
    {
      id: 11,
      name: "Colaborador Pleno",
      uploaded: "10TiB",
      ratio: 1.0,
      interval: "P6M",
      averageSeedingTime: "P7D",
      seedingSize: "1.5GiB",
      uploads: 150,
      privilege: "50 下载槽、双倍上传",
    },
    {
      id: 12,
      name: "Colaborador Senior",
      uploaded: "25TiB",
      ratio: 1.0,
      interval: "P12M",
      averageSeedingTime: "P1M2W1D",
      seedingSize: "1.5GiB",
      uploads: 300,
      privilege: "60 下载槽、Freeleech、双倍上传",
    },
    {
      id: 13,
      name: "Cultivador",
      uploaded: "200TiB",
      ratio: 1.0,
      interval: "P1M",
      averageSeedingTime: "P1M",
      seedingSize: "5TiB",
      privilege: "无限下载槽、Freeleech、双倍上传、免 HnR 警告、可绕过种子审核",
    },
    {
      id: 14,
      name: "Arquivista",
      ratio: 1.0,
      interval: "P1M",
      averageSeedingTime: "P1M",
      seedingSize: "30TiB",
      privilege: "无限下载槽、Freeleech、双倍上传、免 HnR 警告、可绕过种子审核",
    },
  ],
};
