import { ETorrentStatus } from '@/shared/interfaces/enum'
import { ResponseType } from 'axios'

export interface SearchResultItemTag {
  color?: string;
  name?: string;
}

export interface Torrent {
  id: number | string;
  title: string; // 主标题
  subTitle?: string; // 次标题

  url: string; // detail 页面
  link: string; // 种子链接

  time?: number; // 发布时间戳
  size?: number; // 大小
  author?: number; // 发布人

  seeders?: number; // 上传数量
  leechers?: number; // 下载数量
  completed?: number; // 完成数量
  comments?: number; // 评论数量

  tags?: SearchResultItemTag[];

  // 进度（100表示完成）
  progress?: number;
  // 状态
  status?: ETorrentStatus;
  category?: string;
}

export interface searchCategories {
  name: string, // 搜索大类名称
  key: string, // 搜索大类
  options: {name: string, value: string}[],
  cross?: boolean // 该搜索大类是否允许内部交叉 （ 不声明，则默认不允许
}

export interface searchFilter {
  keywords: string,
  categories?: {key: string, value: string}[],

  [key: string]: any // 其他信息
}

export interface UserInfo {
  id: number | string; // 用户ID
  name: string; // 用户名
  levelName?: string; // 等级名称

  uploaded: number; // 上传量
  downloaded: number; // 下载量
  ratio?: number; // 分享率，Ratio并不是必须获得的，如果站点未提供，助手会使用 uploaded/downloaded 自动计算

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

export type SiteSchema = 'NexusPHP' | 'Unit3D' | 'Gazelle' | 'GazelleJSONAPI' | 'AvistaZ' | 'meanTorrent'
export type SiteFeature = 'queryUserInfo'

export interface SiteConfig {
  name: string; // 站点名
  description: string; // 站点说明

  schema?: SiteSchema;

  url: string; // 完整的网站地址，如果网站支持 `https` ，请优先考虑填写 `https` 的地址 ；

  /**
   * 和url相同作用和写法，唯一不同是将会覆写url的行为（因为url不允许用户编辑）
   * 即，当cdn存在时，助手测试顺序依次 [cdn[0], cdn[1], ..., url]
   */
  cdn?: string[];

  host?: string; // 站点域名，如果不存在，则从url中获取
  formerHosts?: string[]; // 站点过去曾经使用过的域名

  categories?: searchCategories[] // 站点对应搜索入口的种子分类信息，数组

  search: {
    type: ResponseType,
    defaultParams: {key: string, value: string}[],
  }

  feature?: { // 站点支持方法
    [key in SiteFeature]: boolean
  }
}
