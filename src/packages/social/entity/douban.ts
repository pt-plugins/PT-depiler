import axios from "axios";
import Sizzle from "sizzle";
import type { IFetchSocialSiteInformationConfig, IPtgenApiResponse, ISocialInformation } from "../types";
import { uniq } from "es-toolkit";

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
  const realId = parse(id);
  const resDict = {
    site: "douban",
    id: realId,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;

  try {
    const { data } = await axios.get<Document>(build(realId), {
      responseType: "document",
      timeout: config.timeout ?? 10e3,
    });
    let ld_json = JSON.parse(
      (data.querySelector('head > script[type="application/ld+json"]')?.textContent ?? "{}").replace(
        /(\r\n|\n|\r|\t)/gm,
        "",
      ),
    );

    const chinese_title = (data.querySelector("title")?.textContent ?? "").replace("(豆瓣)", "").trim();
    const foreign_title = (data.querySelector('span[property="v:itemreviewed"]')?.textContent ?? "")
      .replace(chinese_title, "")
      .trim();
    const aka_anchor = Sizzle('#info span.pl:contains("又名")', data);
    let aka_title: string[] = [];
    if (aka_anchor.length > 0) {
      aka_title = (aka_anchor[0].nextSibling?.nodeValue ?? "")
        .trim()
        .split(" / ")
        .sort((a, b) => a.localeCompare(b)); //首字(母)排序
    }
    resDict.title = uniq([chinese_title, foreign_title, ...aka_title])
      .filter(Boolean)
      .join(" / ");

    resDict.poster = (ld_json.image ?? "")
      .replace(/s(_ratio_poster|pic)/g, "l$1")
      .replace(/img\d(.doubanio.com)/g, "img1$1");

    resDict.ratingScore = ld_json?.aggregateRating?.ratingValue ?? 0;
    resDict.ratingCount = ld_json?.aggregateRating?.ratingCount ?? 0;
  } catch (e) {
    // pass
  } finally {
    resDict.createAt = +Date.now();
  }
  return resDict;
}
