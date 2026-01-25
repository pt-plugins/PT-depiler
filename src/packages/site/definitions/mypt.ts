import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "mypt",
  name: "MyPT",
  aka: ["我的PT"],
  description: "我的PT(CC) | 人類資源庫", // 站点说明
  tags: ["综合"],
  timezoneOffset: "+0800",
  collaborator: ["kveat"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://pp.zlcg.pp/"],
  favicon: "./mypt.ico",

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["td.rowhead:contains('魔力值') + td, td.rowhead:contains('Karma Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
      privilege:
        "被降級的用戶，他們有30天時間來提升分享率，否則他們會被踢。無法發表趣味盒內容；無法申請友情鏈結；無法上傳字幕。",
    },
    {
      id: 2,
      name: "User",
      privilege: "新用戶的預設級別。只能在每周六中午12點至每周日晚上11點59分發布種子。",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        '得到一個邀請名額；可以直接發布種子；可以檢視NFO文件；可以檢視用戶清單；可以要求續種； 可以傳送邀請； 可以檢視排行榜；可以檢視其他用戶的種子曆史(如果用戶隱私等級未設定為"強")； 可以移除自己上傳的字幕。',
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用戶封存賬號后不會被移除。",
    },
    {
      id: 5,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到兩個邀請名額；可以在做種/下載/發布的時候選取匿名型態。",
    },
    {
      id: 6,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以檢視普通日誌。",
    },
    {
      id: 7,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三個邀請名額；可以檢視其他用戶的評論、帖子曆史。Veteran User及以上用戶會永遠保留賬號。",
    },
    {
      id: 8,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新過期的外部資訊；可以檢視Extreme User論壇。",
    },
    {
      id: 9,
      name: "Ultimate User",
      interval: "P60W",
      downloaded: "1.5TB",
      ratio: 5.05,
      privilege: "得到五個邀請名額。",
    },
    {
      id: 10,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十個邀請名額。",
    },
    {
      id: 100,
      groupType: "vip",
      name: "貴賓(VIP)",
      privilege: "和Nexus Master擁有相同許可權并被認為是精英成員。免除自動降級。",
    },
    {
      id: 200,
      groupType: "manager",
      name: "養老族(Retiree)",
      privilege: "  退休后的管理組成員。",
    },
    {
      id: 201,
      groupType: "manager",
      name: "發布員(Uploader)",
      privilege: "專注的發布者。免除自動降級；可以檢視匿名用戶的真實身份。",
    },
    {
      id: 202,
      groupType: "manager",
      name: "總版主(Moderator)",
      privilege:
        "可以檢視管理組郵箱、舉報郵箱；管理趣味盒內容、投票內容；可以編輯或移除任何發布的種子；可以管理候選；可以管理論壇帖子、用戶評論；可以檢視機密日誌；可以移除任何字幕；可以管理日誌中的程式碼、史冊；可以檢視用戶的邀請記錄；可以管理用戶帳號的一般資訊。無法管理友情鏈結、最近訊息、論壇版塊；無法將種子設為置頂或促銷；無法檢視用戶IP或Email等機密資訊；無法移除賬號。",
    },
    {
      id: 203,
      groupType: "manager",
      name: "管理員(Administrator)",
      privilege: "除了無法改變網站設定、管理捐贈外，可以做任何事。",
    },
    {
      id: 204,
      groupType: "manager",
      name: "維護開發員(Sysop)",
      privilege: "網站開發/維護人員，可以改變網站設定，無法管理捐贈。",
    },
    {
      id: 205,
      groupType: "manager",
      name: "主管(Staff Leader)",
      privilege: "網站主管，可以做任何事。",
    },
  ],
};
