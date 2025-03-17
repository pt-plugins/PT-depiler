import type { ITorrent } from "./torrent";
import { TSiteID } from "@ptd/site";

export type ILevelId = number;
export type ILevelName = string;

export interface IUserInfo {
  site: TSiteID;
  id: number | string; // 用户ID
  name: string; // 用户名
  levelId?: ILevelId; // 等级ID
  levelName?: ILevelName; // 等级名称

  uploaded: number; // 上传量
  downloaded: number; // 下载量
  ratio?: number; // 分享率，Ratio并不是必须获得的，如果站点未提供，助手会使用 uploaded/downloaded 自动计算

  uploads?: number; // 发布种子数
  seeding?: number; // 当前做种数量
  seedingSize?: number; // 做种体积
  leeching?: number; // 当前下载数量

  bonus?: number; // 魔力值/积分
  messageCount?: number; // 消息数量
  invites?: number; // 邀请数量

  joinTime?: number; // 入站时间
  avatar?: string; // 头像

  updateAt: number; // 更新时间

  [key: string]: any; // 其他信息
}

export interface ILevelRequirement {
  id: ILevelId; // 等级序列，主要用来排序
  name: ILevelName;
  interval?: number; // 需要等待的周数需求
  downloaded?: number | string; // 下载量需求
  uploaded?: number | string; // 上传量需求
  ratio?: number; // 分享率需求
  seedingPoints?: number; // 做种积分需求
  privilege?: string; // 获得的特权
}

export type IUserSeedingTorrent = Pick<ITorrent, "id" | "size" | "progress" | "status">;

export interface IUserSeedingInfo {
  torrents: IUserSeedingTorrent[]; // 只有 id 和 size 的种子信息
  updateAt: number; // 更新时间
}
