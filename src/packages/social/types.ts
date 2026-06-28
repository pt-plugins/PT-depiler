export const supportSocialSite = ["imdb", "douban", "bangumi", "anidb", "tvmaze", "tmdb"] as const;
export type TSupportSocialSite = (typeof supportSocialSite)[number];

export type TUrlPattern = string | RegExp;

export interface ISocialSitePageInformation {
  site: TSupportSocialSite;
  id: string;
  titles: string[];
  mediaType?: "movie" | "tv";
  external_ids?: Partial<Record<TSupportSocialSite | "tvdb", string>>; // 外部 ID
  pageCategory?: "season_list" | "season_detail";
  seriesTitle?: string;
  entryTitle?: string;
}

export type TSupportSocialSitePageParser = (
  doc: Document,
) =>
  | ISocialSitePageInformation
  | ISocialSitePageInformation[]
  | Promise<ISocialSitePageInformation | ISocialSitePageInformation[]>;
export type TSupportSocialSitePageParserMatches = Array<[TUrlPattern, TSupportSocialSitePageParser]>;

export type TSupportSocialSiteUrlPattern = Record<TSupportSocialSite, TSupportSocialSitePageParserMatches>;

export interface ISocialSiteMetadata {
  site: TSupportSocialSite;
}

export interface ISocialInformation extends Omit<ISocialSitePageInformation, "titles"> {
  title: string;
  poster?: string; // 海报图
  summary?: string; // 简介
  releaseYear?: string; // 发行年份
  region?: string; // 地区
  genres?: string[]; // 类型
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
