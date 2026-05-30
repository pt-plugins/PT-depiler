import axios from "axios";

import type { ISocialSitePageInformation, TSupportSocialSite } from "./types.ts";
import { socialPageParserMatchesMap } from "./index.ts";

export type TSocialRecommendationCategory = "movie" | "tv" | "anime";

export interface ISocialRecommendationItem {
  id: string;
  site: Extract<TSupportSocialSite, "douban" | "bangumi">;
  category: TSocialRecommendationCategory;
  title: string;
  titles: string[];
  sourceUrl: string;
  poster?: string;
  ratingScore?: number;
  ratingCount?: number;
}

export interface ISocialRecommendationsResult {
  items: ISocialRecommendationItem[];
  hasFailedSources: boolean;
}

interface ISocialRecommendationSource {
  site: ISocialRecommendationItem["site"];
  category: TSocialRecommendationCategory;
  url: string;
  limit: number;
}

export interface IGetSocialRecommendationsOptions {
  flush?: boolean;
}

const RECOMMENDATION_CACHE_TTL = 6 * 60 * 60 * 1000;

const recommendationSources: ISocialRecommendationSource[] = [
  { site: "douban", category: "movie", url: "https://movie.douban.com/chart", limit: 5 },
  { site: "douban", category: "tv", url: "https://movie.douban.com/tv", limit: 5 },
  { site: "bangumi", category: "anime", url: "https://bgm.tv/anime/browser", limit: 5 },
];

let recommendationCache:
  | {
      createAt: number;
      items: ISocialRecommendationItem[];
    }
  | undefined;

function normalizeParsedItems(
  parsed: ISocialSitePageInformation | ISocialSitePageInformation[],
  source: ISocialRecommendationSource,
): ISocialRecommendationItem[] {
  const parsedItems = Array.isArray(parsed) ? parsed : [parsed];
  const existingIds = new Set<string>();

  return parsedItems
    .map((item) => {
      const titles = item.titles.map((title) => title.trim()).filter(Boolean);
      const title = titles[0];

      if (!item.id || !title) {
        return undefined;
      }

      const uniqueId = `${source.category}:${item.site}:${item.id}`;
      if (existingIds.has(uniqueId)) {
        return undefined;
      }
      existingIds.add(uniqueId);

      return {
        id: item.id,
        site: source.site,
        category: source.category,
        title,
        titles,
        sourceUrl: source.url,
      } satisfies ISocialRecommendationItem;
    })
    .filter((item): item is ISocialRecommendationItem => !!item)
    .slice(0, source.limit);
}

async function fetchRecommendationSource(source: ISocialRecommendationSource): Promise<ISocialRecommendationItem[]> {
  const parserEntry = socialPageParserMatchesMap[source.site]?.find(([pattern]) => {
    if (typeof pattern === "string") {
      return source.url.includes(pattern);
    }

    return pattern.test(source.url);
  });

  if (!parserEntry) {
    console.warn(`No social recommendation parser found for ${source.url}`);
    return [];
  }

  const [, parser] = parserEntry;
  const { data } = await axios.get<Document>(source.url, {
    responseType: "document",
    timeout: 10e3,
  });

  Object.defineProperty(data, "URL", {
    value: source.url,
    configurable: true,
  });

  return normalizeParsedItems(parser(data), source);
}

export async function getSocialRecommendations(
  options: IGetSocialRecommendationsOptions = {},
): Promise<ISocialRecommendationsResult> {
  if (!options.flush && recommendationCache && recommendationCache.createAt > Date.now() - RECOMMENDATION_CACHE_TTL) {
    return { items: recommendationCache.items, hasFailedSources: false };
  }

  const settledResults = await Promise.allSettled(
    recommendationSources.map((source) => fetchRecommendationSource(source)),
  );
  let hasRejectedSource = false;
  const items = settledResults.flatMap((result) => {
    if (result.status === "fulfilled" && result.value.length > 0) {
      return result.value;
    }

    hasRejectedSource = true;
    console.warn(
      "Failed to fetch social recommendations",
      result.status === "rejected" ? result.reason : "empty result",
    );
    return [];
  });

  if (!hasRejectedSource) {
    recommendationCache = {
      createAt: Date.now(),
      items,
    };
  }

  return { items, hasFailedSources: hasRejectedSource };
}
