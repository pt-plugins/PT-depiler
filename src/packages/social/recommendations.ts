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
  kind?: "page" | "doubanSearchSubjects";
}

export interface IGetSocialRecommendationsOptions {
  flush?: boolean;
}

const RECOMMENDATION_CACHE_TTL = 6 * 60 * 60 * 1000;

const recommendationSources: ISocialRecommendationSource[] = [
  {
    site: "douban",
    category: "movie",
    url: "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=5&page_start=0",
    limit: 5,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "tv",
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=5&page_start=0",
    limit: 5,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "anime",
    url: "https://movie.douban.com/j/search_subjects?type=movie&tag=%E5%8A%A8%E7%94%BB&sort=recommend&page_limit=5&page_start=0",
    limit: 5,
    kind: "doubanSearchSubjects",
  },
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
    .map((item): ISocialRecommendationItem | undefined => {
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

interface IDoubanSearchSubjectsResponse {
  subjects?: Array<{
    id?: string;
    title?: string;
    url?: string;
    cover?: string;
    rate?: string;
  }>;
}

function normalizeDoubanSearchSubjects(
  data: IDoubanSearchSubjectsResponse,
  source: ISocialRecommendationSource,
): ISocialRecommendationItem[] {
  const existingIds = new Set<string>();

  return (data.subjects ?? [])
    .map((item): ISocialRecommendationItem | undefined => {
      const id = item.id?.trim();
      const title = item.title?.trim();

      if (!id || !title) {
        return undefined;
      }

      const uniqueId = `${source.category}:${source.site}:${id}`;
      if (existingIds.has(uniqueId)) {
        return undefined;
      }
      existingIds.add(uniqueId);

      return {
        id,
        site: source.site,
        category: source.category,
        title,
        titles: [title],
        sourceUrl: item.url ?? source.url,
        poster: item.cover,
        ratingScore: Number(item.rate || 0),
      } satisfies ISocialRecommendationItem;
    })
    .filter((item): item is ISocialRecommendationItem => !!item)
    .slice(0, source.limit);
}

async function fetchRecommendationSource(source: ISocialRecommendationSource): Promise<ISocialRecommendationItem[]> {
  if (source.kind === "doubanSearchSubjects") {
    const { data } = await axios.get<IDoubanSearchSubjectsResponse>(source.url, {
      responseType: "json",
      timeout: 10e3,
    });

    return normalizeDoubanSearchSubjects(data, source);
  }

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
