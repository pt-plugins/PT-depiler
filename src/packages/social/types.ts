export const supportSocialSite = ["imdb", "tmdb", "douban", "bangumi", "anidb", "tvdb"] as const;
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
  preferPtGen?: boolean;
  ptGenEndpoint?: string; // 只是最优先而已，如果失败，则会从默认的 buildInPtGenApi 中依次尝试
  timeout?: number; // 请求超时时间
}

export interface IPtgenApiResponse {
  site: TSupportSocialSite;
  sid: string;

  [key: string]: any;
}
