// 种子当前状态
export enum ETorrentStatus {
  unknown, // 状态不明
  downloading, // 正在下载
  seeding, // 正在做种
  inactive, // 未活动（曾经下载过，但未完成）
  completed, // 已完成，未做种， 旧版值 255
}

// 一些比较基础的 Tag 及其对应颜色
export enum ETorrentBaseTagColor {
  "Free" = "blue", // 免费下载
  "2xFree" = "green", // 免费下载 + 2x 上传
  "2xUp" = "lime", // 2x 上传
  "2x50%" = "light-green", // 2x 上传 + 50% 下载
  "25%" = "purple", // 25% 下载
  "30%" = "indigo", // 30% 下载
  "35%" = "indigo darken-3", // 35% 下载
  "50%" = "orange", // 50% 下载
  "70%" = "blue-grey", // 70% 下载
  "75%" = "lime darken-3", // 75% 下载
  "VIP" = "orange darken-2", // 仅 VIP 可下载
  "Excl." = "deep-orange darken-1", // 禁止转载
}

// 定义种子中 tag 的展示形式
export interface ITorrentTag {
  color?: string; // 标签背景色，文字（前景色）一律为白色
  name?: keyof typeof ETorrentBaseTagColor | string; // tag说明
}

// 作为一个种子最基本应该有的属性
export interface ITorrent {
  site: string, // 所在站点id

  id: number | string;  // 该种子id
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

  // 对于PT种子才 获取以下部分
  progress?: number | null; // 进度（100表示完成）
  status?: ETorrentStatus; // 状态
}
