import { IFetchSocialSiteInformationConfig, ISocialInformation } from "@ptd/social/types.ts";

export function build(id: string): string {
  return `https://www.themoviedb.org/${id}`;
}

export function parse(query: string): string {
  return query;
}

// TODO 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  return { site: "tmdb", id, title: "", poster: "", ratingScore: 0, ratingCount: 0, createAt: 0 } as ISocialInformation;
}
