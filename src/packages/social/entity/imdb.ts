import { IFetchSocialSiteInformationConfig, IPtgenApiResponse, ISocialInformation } from "../types.ts";

export function build(id: string): string {
  return `https://www.imdb.com/title/${id}/`;
}

export function parse(query: string): string {
  // Extract the IMDb ID from the URL.
  const imdbUrlMatch = query.match(/(?:https?:\/\/)?(?:www\.)?imdb\.com\/title\/(tt\d+)\/?/);
  if (imdbUrlMatch) {
    return imdbUrlMatch[1] as string;
  }

  if (/tt(\d+)/.test(query)) {
    return query;
  }

  // 如果是纯数字的字符串，则补齐并返回
  if (/^\d+$/.test(query)) {
    return "tt" + (query.length < 7 ? query.padStart(7, "0") : query);
  }

  return query;
}

interface IImdbPtGen extends IPtgenApiResponse {
  name: string;
  aka: string[];
  poster: string;
  imdb_votes: number;
  imdb_rating_average: number;
  details?: {
    "Also known as": string[];
  };
}

export function transformPtGen(data: IImdbPtGen): ISocialInformation {
  const uniqueTitles = new Set([data.name ?? "", ...(data.aka ?? []), ...(data.details?.["Also known as"] ?? [])]);
  const titles = Array.from(uniqueTitles).filter(Boolean);

  return {
    site: "imdb",
    id: parse(data.sid),
    title: titles.join(" / "),
    poster: data.poster ?? "",
    ratingScore: data.imdb_rating_average ?? 0,
    ratingCount: data.imdb_votes ?? 0,
    createAt: data.update_at ? new Date(data.update_at).getTime() : +Date.now(),
  };
}

// TODO 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  return { site: "imdb", id, title: "", poster: "", ratingScore: 0, ratingCount: 0, createAt: 0 } as ISocialInformation;
}
