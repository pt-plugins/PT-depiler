import type { IFetchSocialSiteInformationConfig, IPtgenApiResponse, ISocialInformation } from "../types";

export function build(id: string): string {
  return `https://bgm.tv/subject/${id}`;
}

export function parse(query: string): string {
  const bgmUrlMatch = query.match(/^(?:https?:\/\/)?(?:bgm\.tv|bangumi\.tv|chii\.in)\/subject\/(\d+)\/?/);
  if (bgmUrlMatch) {
    return bgmUrlMatch[1] as string;
  }
  return query;
}

interface IBangumiPtGen extends IPtgenApiResponse {
  cover: string;
  name: string;
  name_cn: string;
  rating: { score: number; total: number };
}

export function transformPtGen(data: IBangumiPtGen): ISocialInformation {
  return {
    site: "bangumi",
    id: String(data.sid),
    title: [data.name_cn ?? "", data.name ?? ""].filter(Boolean).join(" / "),
    poster: data.cover ?? "",
    ratingScore: data?.rating?.score ?? 0,
    ratingCount: data?.rating?.total ?? 0,
    createAt: data.update_at ? new Date(data.update_at).getTime() : +Date.now(),
  };
}

// TODO 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  return {
    site: "bangumi",
    id,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;
}
