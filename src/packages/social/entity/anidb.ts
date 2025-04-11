import { IFetchSocialSiteInformationConfig, ISocialInformation } from "@ptd/social/types.ts";

export function build(id: string): string {
  return `https://anidb.net/anime/${id}`;
}

const anidbRegexList = [
  /(?:https?:\/\/)?(?:www\.)?anidb\.net\/anime\/(\d+)/,
  /(?:https?:\/\/)?(?:www\.)?anidb\.net\/a(\d+)/,
];

export function parse(query: string): string {
  for (const regExp of anidbRegexList) {
    const match = query.match(regExp);
    if (match) {
      return match[1] as string;
    }
  }

  return query;
}

// TODO 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  return {
    site: "anidb",
    id,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;
}
