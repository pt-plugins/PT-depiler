import axios from "axios";
import {
  IFetchSocialSiteInformationConfig,
  IPtgenApiResponse,
  ISocialInformation,
  ISocialSitePageInformation,
} from "../types";

const imdbUrlPattern = /^(?:https?:\/\/)?(?:www\.)?imdb\.com\/title\/(tt\d+)\/?/;

export function build(id: string): string {
  return `https://www.imdb.com/title/${id}/`;
}

export function parse(query: string | number | undefined): string {
  if (typeof query !== "undefined") {
    query = String(query).trim();
    // Extract the IMDb ID from the URL.
    const imdbUrlMatch = query.match(imdbUrlPattern);
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
  }

  return query as unknown as string;
}

export const pageParserMatches = [
  [
    imdbUrlPattern,
    (doc: Document): ISocialSitePageInformation => {
      const titles = [] as string[];
      try {
        const page_json = JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}");
        if (page_json && page_json.name) {
          titles.push(page_json.name);
        }
      } catch (e) {}

      return {
        site: "imdb",
        id: parse(doc.URL),
        titles,
      };
    },
  ],
];

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
    createAt: +Date.now(),
  };
}

interface IIMDbApiResp {
  "@meta": any;
  resource: {
    "@type": "imdb.api.title.ratings";
    id: string;
    title: string;
    titleType: "movie";
    year: number;
    otherRanks: any[];
    rating: number;
    ratingCount: number;
  };
}

export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  const realId = parse(String(id));
  const resDict = {
    site: "imdb",
    id: realId,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;

  /**
   * 使用浏览器直接请求 imdb 页面会遇到 waf 问题，暂时没能力解决。。
   * 此处走 https://p.media-imdb.com/static-content/documents/v1/title/{id}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json 接口
   * 获取除 poster 外的 title, ratingScore, ratingCount 信息
   */
  try {
    const { data } = await axios.get(
      `https://p.media-imdb.com/static-content/documents/v1/title/${realId}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`,
      {
        timeout: config.timeout ?? 10e3,
        responseType: "text",
      },
    );
    const jsonDataText = data.replace(/\n/gi, "").match(/[^(]+\((.+)\)/)[1];
    const imdbRatingData = JSON.parse(jsonDataText) as IIMDbApiResp;
    if (imdbRatingData.resource) {
      resDict.title = imdbRatingData.resource.title ?? "";
      resDict.ratingScore = imdbRatingData.resource.rating ?? 0;
      resDict.ratingCount = imdbRatingData.resource.ratingCount ?? 0;
    }
  } catch (error) {
    console.warn(error);
  } finally {
    resDict.createAt = +Date.now();
  }

  return resDict;
}
