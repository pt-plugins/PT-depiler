/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/nicept.net/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "nicept",
  name: "NicePT",
  description: "老师站，又称小馒头",
  tags: ["成人"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["DXV5"],

  urls: ["https://www.nicept.net/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 40000,
      privilege:
        '得到一個邀請名額；可以直接發布種子；可以檢視NFO文件；可以檢視用戶清單；可以要求續種； 可以傳送邀請； 可以檢視排行榜；可以檢視其他用戶的種子曆史(如果用戶隱私等級未設定為"強")； 可以移除自己上傳的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
      privilege: "Elite User及以上用戶封存賬號后不會被移除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 150000,
      privilege: "得到兩個邀請名額；可以在做種/下載/發布的時候選取匿名型態。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "可以檢視普通日誌。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingPoints: 400000,
      privilege: "得到三個邀請名額；可以檢視其他用戶的評論、帖子曆史。Veteran User及以上用戶會永遠保留賬號。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "可以更新過期的外部資訊；可以檢視Extreme User論壇。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 800000,
      privilege: "得到五個邀請名額。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingPoints: 1000000,
      privilege: "得到十個邀請名額。",
    },
  ],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "无码（限制级）",
          value: 401,
        },

        {
          name: "有码（限制级）",
          value: 500,
        },

        {
          name: "三级情色（限制级）",
          value: 402,
        },

        {
          name: "其他（限制级）",
          value: 501,
        },

        {
          name: "动漫（限制级）",
          value: 403,
        },

        {
          name: "真人秀，自拍（限制级）",
          value: 503,
        },

        {
          name: "套图（限制级）",
          value: 404,
        },

        {
          name: "SM调教（限制级）",
          value: 504,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
