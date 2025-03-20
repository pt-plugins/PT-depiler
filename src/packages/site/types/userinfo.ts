import type { ITorrent } from "./torrent";
import { type EResultParseStatus, TSiteID } from "@ptd/site";

export type TLevelId = number;
export type TLevelName = string;
export type TLevelGroupType = "user" | "vip" | "manager";

export interface ILevelRequirement {
  id: TLevelId; // 等级序列，应该是一个递增的序列，不可重复
  name: TLevelName; // 需要与 IUserInfo中对应的 levelName 相同
  groupType?: TLevelGroupType; // 等级组别，不指定的话，默认为 user
  privilege?: string; // 获得的特权说明

  // 以下为对应等级需求，如果不指定的话，则表示不需要该需求
  interval?: `P${string}`; // 需要等待的日期需求（ISO 8601 - 时间段表示法）  如 P5W 代表等待五周，P2M 代表等待二个月

  /**
   * 对 涉及体积的 其 number 类型的需求，我们更建议使用 utils/filesize 提供的单位明确真实 Byte 数值
   * TODO 也可以考虑直接使用 string 类型，如 "1.5 TB"，会自动实现转换
   */

  totalTraffic?: number | string; // 总流量需求
  downloaded?: number | string; // 下载量需求
  trueDownloaded?: number | string; // 真实下载量需求
  uploaded?: number | string; // 上传量需求
  trueUploaded?: number | string; // 真实上传量需求
  ratio?: number; // 分享率需求
  trueRatio?: number; // 真实分享率需求

  seeding?: number; // 做种数量需求
  seedingSize?: number | string; // 做种体积需求
  seedingTime?: number; // 做种时间需求
  averageSeedingTime?: number; // 平均做种时间需求

  bonus?: number; // 魔力值/积分需求
  bonusPerHour?: number; // 魔力值/积分每小时需求
  seedingBonus?: number; // 做种积分需求

  uploads?: number; // 发布种子数需求
  leeching?: number; // 下载数量需求
  snatches?: number; // 完成种子数需求
}

export interface IUserInfo extends Omit<ILevelRequirement, "id" | "name" | "groupType" | "privilege" | "interval"> {
  status: EResultParseStatus;
  updateAt: number; // 更新时间
  site: TSiteID;

  id?: number | string; // 用户ID
  name?: string; // 用户名
  levelId?: TLevelId; // 等级ID
  levelName?: TLevelName; // 等级名称
  joinTime?: number; // 入站时间

  messageCount?: number; // 消息数量
  invites?: number; // 邀请数量
  avatar?: string; // 头像

  // 一些信息与 ILevelRequirement 重复，但是这里是实际的数据，而 ILevelRequirement 是需求
  // 此处仅对变化项进行覆写，其他项不再累述
  downloaded?: number; // 下载量需求
  trueDownloaded?: number; // 真实下载量需求
  uploaded?: number; // 上传量需求
  trueUploaded?: number; // 真实上传量需求
  seedingSize?: number; // 做种体积需求

  [key: string]: any; // 其他信息
}

export type IUserSeedingTorrent = Pick<ITorrent, "id" | "size" | "progress" | "status">;

export interface IUserSeedingInfo {
  torrents: IUserSeedingTorrent[]; // 只有 id 和 size 的种子信息
  updateAt: number; // 更新时间
}
