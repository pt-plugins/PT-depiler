import type { IFetchSocialSiteInformationConfig, IPtgenApiResponse, ISocialInformation } from "../types";

export function build(id: string): string {
  return `https://movie.douban.com/subject/${id}/`;
}

export function parse(query: string): string {
  const doubanUrlMatch = query.match(/(?:https?:\/\/)?(?:(?:movie|www)\.)?douban\.com\/(?:subject|movie)\/(\d+)\/?/);
  if (doubanUrlMatch) {
    return doubanUrlMatch[1] as string;
  }

  return query;
}

// 这里只列出了我们需要的部分
interface IDoubanPtGen extends IPtgenApiResponse {
  aka: string[];
  this_title: string[];
  chinese_title: string;
  foreign_title: string;
  poster: string;
  douban_votes: string;
  douban_rating_average: string | number;
}

export function transformPtGen(data: IDoubanPtGen): ISocialInformation {
  const uniqueTitles = new Set([
    data.chinese_title ?? "",
    data.foreign_title ?? "",
    ...(data.this_title ?? []),
    ...(data.aka ?? []),
  ]);
  const titles = Array.from(uniqueTitles).filter(Boolean);

  return {
    site: "douban",
    id: data.sid,
    title: titles.join(" / "),
    poster: data.poster ?? "",
    ratingScore: Number(data.douban_rating_average ?? 0),
    ratingCount: Number(data.douban_votes ?? 0),
    createAt: data.update_at ? new Date(data.update_at).getTime() : +Date.now(),
  };
}

// TODO 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  return {
    site: "douban",
    id,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;
}
