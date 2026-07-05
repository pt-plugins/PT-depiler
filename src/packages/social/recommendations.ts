import axios from "axios";
import PQueue from "p-queue";

import type { ISocialSitePageInformation, TSupportSocialSite } from "./types.ts";

export type TSocialRecommendationCategory = "movie" | "tv" | "variety" | "anime";

export interface ISocialRecommendationItem {
  id: string;
  site: Extract<TSupportSocialSite, "douban" | "bangumi">;
  category: TSocialRecommendationCategory;
  title: string;
  titles: string[];
  sourceUrl: string;
  poster?: string;
  summary?: string;
  releaseYear?: string;
  region?: string;
  genres?: string[];
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
  kind?: "page" | "doubanSearchSubjects" | "doubanSubjectCollection";
  referer?: string;
}

export interface IGetSocialRecommendationsOptions {
  flush?: boolean;
}

const RECOMMENDATION_CACHE_TTL = 6 * 60 * 60 * 1000;
const RECOMMENDATION_CATEGORY_LIMIT = 10;
const RECOMMENDATION_SOURCE_CONCURRENCY = 6;
const recommendationCategories: TSocialRecommendationCategory[] = ["movie", "tv", "variety", "anime"];

const recommendationSources: ISocialRecommendationSource[] = [
  {
    site: "douban",
    category: "movie",
    url: "https://movie.douban.com/j/search_subjects?type=movie&tag=%E5%8D%8E%E8%AF%AD&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "movie",
    url: "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "tv",
    url: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_domestic/items?items_only=1&start=0&count=10",
    limit: 10,
    kind: "doubanSubjectCollection",
    referer: "https://m.douban.com/subject_collection/tv_domestic",
  },
  {
    site: "douban",
    category: "tv",
    url: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_american/items?items_only=1&start=0&count=10",
    limit: 10,
    kind: "doubanSubjectCollection",
    referer: "https://m.douban.com/subject_collection/tv_american",
  },
  {
    site: "douban",
    category: "tv",
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%83%AD%E9%97%A8&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "tv",
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%BE%8E%E5%89%A7&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "variety",
    url: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_variety_show/items?items_only=1&start=0&count=10",
    limit: 10,
    kind: "doubanSubjectCollection",
    referer: "https://m.douban.com/subject_collection/tv_variety_show",
  },
  {
    site: "douban",
    category: "variety",
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%BB%BC%E8%89%BA&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "anime",
    url: "https://movie.douban.com/j/search_subjects?type=movie&tag=%E5%8A%A8%E7%94%BB&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "anime",
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E6%97%A5%E6%9C%AC%E5%8A%A8%E7%94%BB&sort=time&page_limit=10&page_start=0",
    limit: 10,
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

interface IDoubanSubjectCollectionResponse {
  subject_collection_items?: Array<{
    id?: string;
    title?: string;
    card_subtitle?: string;
    comment?: string;
    year?: string;
    pic?: {
      large?: string;
      normal?: string;
    };
    rating?: {
      value?: number;
      count?: number;
    };
  }>;
}

function normalizeDoubanImageUrl(url?: string): string | undefined {
  return url?.replace(/img\d(?=\.doubanio\.com)/, "img1");
}

export function mergeRecommendationSourceItems(
  sourceItemGroups: ISocialRecommendationItem[][],
  limit: number,
): ISocialRecommendationItem[] {
  const mergedItems: ISocialRecommendationItem[] = [];
  const existingIds = new Set<string>();
  const maxGroupLength = Math.max(0, ...sourceItemGroups.map((items) => items.length));

  for (let itemIndex = 0; itemIndex < maxGroupLength && mergedItems.length < limit; itemIndex++) {
    for (const items of sourceItemGroups) {
      const item = items[itemIndex];
      if (!item) {
        continue;
      }

      const uniqueId = `${item.category}:${item.site}:${item.id}`;
      if (existingIds.has(uniqueId)) {
        continue;
      }

      existingIds.add(uniqueId);
      mergedItems.push(item);

      if (mergedItems.length >= limit) {
        break;
      }
    }
  }

  return mergedItems;
}

export function canCacheRecommendationItems(items: readonly Pick<ISocialRecommendationItem, "category">[]) {
  // 只要四个分类都有结果即可缓存；单个冗余源失败（hasFailedSources）不应阻止缓存，
  // 否则任一源持续失败都会导致每次都全量重抓所有源。
  return recommendationCategories.every((category) => items.some((item) => item.category === category));
}

async function settleRecommendationItemsWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  task: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const queue = new PQueue({ concurrency });
  return Promise.all(
    items.map(
      (item) =>
        queue
          .add(() => task(item))
          .then(
            (value) => ({ status: "fulfilled", value }) as PromiseFulfilledResult<R>,
            (reason) => ({ status: "rejected", reason }) as PromiseRejectedResult,
          ) as Promise<PromiseSettledResult<R>>,
    ),
  );
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
        poster: normalizeDoubanImageUrl(item.cover),
        ratingScore: Number(item.rate || 0),
      } satisfies ISocialRecommendationItem;
    })
    .filter((item): item is ISocialRecommendationItem => !!item)
    .slice(0, source.limit);
}

function parseDoubanCardSubtitle(cardSubtitle?: string) {
  const parts = cardSubtitle
    ?.split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    releaseYear: parts?.[0],
    region: parts?.[1],
    genres: parts?.[2]?.split(/\s+/).filter(Boolean),
  };
}

function normalizeDoubanSubjectCollection(
  data: IDoubanSubjectCollectionResponse,
  source: ISocialRecommendationSource,
): ISocialRecommendationItem[] {
  const existingIds = new Set<string>();

  return (data.subject_collection_items ?? [])
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

      const cardSubtitleMetadata = parseDoubanCardSubtitle(item.card_subtitle);
      const ratingScore = Number(item.rating?.value || 0);
      const ratingCount = Number(item.rating?.count || 0);

      return {
        id,
        site: source.site,
        category: source.category,
        title,
        titles: [title],
        sourceUrl: source.referer ?? source.url,
        poster: normalizeDoubanImageUrl(item.pic?.large ?? item.pic?.normal),
        summary: item.comment?.trim(),
        releaseYear: item.year?.trim() || cardSubtitleMetadata.releaseYear,
        region: cardSubtitleMetadata.region,
        genres: cardSubtitleMetadata.genres,
        ratingScore,
        ratingCount,
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

  if (source.kind === "doubanSubjectCollection") {
    const { data } = await axios.get<IDoubanSubjectCollectionResponse>(source.url, {
      headers: source.referer ? { Referer: source.referer } : undefined,
      responseType: "json",
      timeout: 10e3,
    });

    return normalizeDoubanSubjectCollection(data, source);
  }

  const { socialPageParserMatchesMap } = await import("./index.ts");
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

  return normalizeParsedItems(await parser(data), source);
}

export async function getSocialRecommendations(
  options: IGetSocialRecommendationsOptions = {},
): Promise<ISocialRecommendationsResult> {
  if (
    !options.flush &&
    recommendationCache &&
    recommendationCache.createAt > Date.now() - RECOMMENDATION_CACHE_TTL &&
    canCacheRecommendationItems(recommendationCache.items)
  ) {
    return { items: recommendationCache.items, hasFailedSources: false };
  }

  const settledResults = await settleRecommendationItemsWithConcurrency(
    recommendationSources,
    RECOMMENDATION_SOURCE_CONCURRENCY,
    fetchRecommendationSource,
  );
  let hasRejectedSource = false;
  const sourceItemGroups = settledResults.flatMap((result) => {
    if (result.status === "fulfilled" && result.value.length > 0) {
      return [result.value];
    }

    hasRejectedSource = true;
    console.warn(
      "Failed to fetch social recommendations",
      result.status === "rejected" ? result.reason : "empty result",
    );
    return [];
  });
  const items = recommendationCategories.flatMap((category) =>
    mergeRecommendationSourceItems(
      sourceItemGroups
        .map((items) => items.filter((item) => item.category === category))
        .filter((items) => items.length > 0),
      RECOMMENDATION_CATEGORY_LIMIT,
    ),
  );

  if (canCacheRecommendationItems(items)) {
    recommendationCache = {
      createAt: Date.now(),
      items,
    };
  }

  return { items, hasFailedSources: hasRejectedSource };
}
