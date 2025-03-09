// 种子当前状态
import { TAdvanceSearchKeyword } from "@ptd/site";

export enum ETorrentStatus {
  unknown, // 状态不明
  downloading, // 正在下载
  seeding, // 正在做种
  inactive, // 未活动（曾经下载过，但未完成）
  completed, // 已完成，未做种， 旧版值 255
}

// 比较基础的种子 Tag
export type TBaseTorrentTagName =
  | "Free" // 免费下载 "blue",
  | "2xFree" // 免费下载 + 2x 上传 "green",
  | "2xUp" // 2x 上传   "lime",
  | "2x50%" // 2x 上传 + 50% 下载 "light-green",
  | "25%" // 25% 下载 "purple",
  | "30%" // 30% 下载 "indigo",
  | "35%" // 35% 下载 "indigo darken-3",
  | "50%" // 50% 下载 "orange",
  | "70%" // 70% 下载 "blue-grey",
  | "75%" // 75% 下载 "lime darken-3",
  | "VIP" // 仅 VIP 可下载 "orange darken-2",
  | "Excl." // 禁止转载 "deep-orange darken-1",
  | string;

export interface ITorrentTag {
  name: TBaseTorrentTagName;
  color?: string;
}

// 作为一个种子最基本应该有的属性
export interface ITorrent {
  site: string; // 所在站点id

  id: number | string; // 该种子id
  title: string; // 主标题
  subTitle?: string; // 次标题

  /**
   * 特别注意： link 和 url 两个的含义在旧版和目前版本中是完全相反的
   * url: detail 页面链接
   * link: 种子下载链接，特别的：
   *    - 对于 PT站点 应该是种子的链接
   *    - 对于 BT站点 应尽可能为种子链接，只有不存在种子链接或种子链接经过某些种子生成站时，才使用 magnet 链接
   */
  url: string;
  link: string;

  time?: number; // 发布时间戳（毫秒级）
  size?: number; // 大小
  author?: number | string; // 发布人

  seeders?: number; // 上传数量
  leechers?: number; // 下载数量
  completed?: number; // 完成数量
  comments?: number; // 评论数量

  category?: string | number;
  tags?: ITorrentTag[];

  [key: `ext_${TAdvanceSearchKeyword}`]: string | number | null; // 外部资源id

  // 对于PT种子才 获取以下部分
  progress?: number | null; // 进度（100表示完成）
  status?: ETorrentStatus; // 状态
}
