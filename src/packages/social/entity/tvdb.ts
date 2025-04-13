import type { IFetchSocialSiteInformationConfig, ISocialInformation } from "../types";

export function build(id: string): string {
  return `https://thetvdb.com/dereferrer/series/${id}`;
}

export function parse(query: string): string {
  return query;
}

// TODO 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  return { site: "tvdb", id, title: "", poster: "", ratingScore: 0, ratingCount: 0, createAt: 0 } as ISocialInformation;
}
