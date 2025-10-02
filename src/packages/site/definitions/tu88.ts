import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "tu88",
  name: "TU88",
  description: "僅分享圖片,適合手機平板PT客戶端直接下載",
  tags: ["漫画", "图集", "绘本", "成人"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.tu88.men/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "种子区", value: "/torrents.php" },
        { name: "特别区", value: "/special.php" },
      ],
    },
    {
      name: "分类（种子区）",
      key: "cat_normal",
      notes: "请先设置搜索入口为“种子区”！",
      options: [
        { name: "CG(图集)", value: 417 },
        { name: "绘本", value: 413 },
        { name: "绘本", value: 413 },
        { name: "Other(其它，确认上边分类无)", value: 414 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类（特别区）",
      key: "cat_special",
      options: [
        { name: "H漫(成人漫画)", value: 410 },
        { name: "H游(成人游戏)", value: 411 },
        { name: "CG(成人图集)", value: 416 },
        { name: "RealLife", value: 418 },
        { name: "Other(成人其它)", value: 415 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_normal: { name: "种子", requestConfig: { url: "/torrents.php" } },
    area_9kg: { name: "特别", enabled: false, requestConfig: { url: "/special.php" } },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用戶的預設級別。",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P5W",
      downloaded: "20GB",
      ratio: 1.5,
      privilege:
        "得到一個邀請名額；可以直接發布種子；可以檢視NFO文件；可以檢視用戶清單；可以要求續種； 可以傳送邀請； " +
        '可以檢視排行榜；可以檢視其他用戶的種子曆史(如果用戶隱私等級未設定為"強")； 可以移除自己上傳的字幕。',
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P10W",
      downloaded: "60GB",
      ratio: 2,
      privilege: "得到一個邀請名額；Elite User及以上用戶封存賬號后不會被移除。",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "200GB",
      ratio: 2.5,
      privilege: "得到一個邀請名額；可以在做種/下載/發布的時候選取匿名型態。",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P20W",
      downloaded: "400GB",
      ratio: 3,
      privilege: "得到一個邀請名額；可以檢視普通日誌。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "600GB",
      ratio: 3.5,
      privilege: "得到兩個邀請名額；可以檢視其他用戶的評論、帖子曆史。Veteran User及以上用戶會永遠保留賬號。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P25W",
      downloaded: "1024GB",
      ratio: 4,
      privilege: "得到一個邀請名額；可以更新過期的外部資訊；可以檢視Extreme User論壇。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P30W",
      downloaded: "2048GB",
      ratio: 4.5,
      privilege: "得到三個邀請名額。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P30W",
      downloaded: "3072GB",
      ratio: 5,
      privilege: "得到五個邀請名額。",
    },
  ],
};
