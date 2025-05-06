export const supportSocialSite = ["imdb", "douban", "bangumi", "anidb"] as const;
export type TSupportSocialSite = (typeof supportSocialSite)[number];

export interface ISocialSiteMetadata {
  site: TSupportSocialSite;
}

export interface ISocialInformation {
  site: TSupportSocialSite;
  id: string;
  title: string;
  poster?: string; // 海报图
  ratingScore?: number; // 按10分满分的评分
  ratingCount?: number; // 评分人数
  createAt: number; // 创建时间
}

export interface IFetchSocialSiteInformationConfig {
  // 是否优先使用 ptgen 接口获取信息
  preferPtGen?: boolean;
  // 只是最优先而已，如果失败，则会从默认的 buildInPtGenApi 中依次尝试
  ptGenEndpoint?: string;
  // 请求超时时间（毫秒）
  timeout?: number;
  // 缓存时间（天）
  cacheDay?: number;

  socialSite?: Record<TSupportSocialSite, Record<"apikey" | string, any>>;
}

export interface IPtgenApiResponse {
  site: TSupportSocialSite;
  sid: string;

  [key: string]: any;
}
