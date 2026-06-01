import axios from "axios";

import type { ISocialSitePageInformation, TSupportSocialSite } from "./types.ts";

export type TSocialRecommendationCategory = "movie" | "tv" | "anime";

export interface ISocialRecommendationItem {
  id: string;
  site: Extract<TSupportSocialSite, "douban" | "bangumi">;
  category: TSocialRecommendationCategory;
  title: string;
  titles: string[];
  sourceUrl: string;
  poster?: string;
  summary?: string;
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
const RECOMMENDATION_CATEGORY_LIMIT = 10;
const recommendationCategories: TSocialRecommendationCategory[] = ["movie", "tv", "anime"];

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
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E5%9B%BD%E4%BA%A7%E5%89%A7&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
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

interface IDoubanSubjectAbstractResponse {
  r?: 0 | "error";
  subject?: {
    title?: string;
    rate?: string;
    directors?: string[];
    actors?: string[];
    duration?: string;
    region?: string;
    types?: string[];
    release_year?: string;
  };
}

function normalizeDoubanImageUrl(url?: string): string | undefined {
  return url?.replace(/img\d(.doubanio.com)/, "img1$1");
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
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

function buildDoubanSubjectSummary(subject?: IDoubanSubjectAbstractResponse["subject"]): string | undefined {
  if (!subject) {
    return undefined;
  }

  const metadataParts = [
    subject.release_year,
    subject.region,
    subject.types?.filter(Boolean).join("/"),
    subject.duration,
  ].filter(Boolean);
  const peopleParts = [
    subject.directors?.length ? `导演：${subject.directors.slice(0, 2).join("、")}` : "",
    subject.actors?.length ? `主演：${subject.actors.slice(0, 3).join("、")}` : "",
  ].filter(Boolean);
  const summary = [...metadataParts, ...peopleParts].join(" · ");

  return summary ? normalizeText(summary) : undefined;
}

async function fetchDoubanSubjectSummary(id: string): Promise<string | undefined> {
  const { data } = await axios.get<IDoubanSubjectAbstractResponse>(
    `https://movie.douban.com/j/subject_abstract?subject_id=${id}`,
    {
      responseType: "json",
      timeout: 10e3,
    },
  );

  return data.r === 0 ? buildDoubanSubjectSummary(data.subject) : undefined;
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

async function fetchRecommendationSource(source: ISocialRecommendationSource): Promise<ISocialRecommendationItem[]> {
  if (source.kind === "doubanSearchSubjects") {
    const { data } = await axios.get<IDoubanSearchSubjectsResponse>(source.url, {
      responseType: "json",
      timeout: 10e3,
    });

    const items = normalizeDoubanSearchSubjects(data, source);
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        summary: await fetchDoubanSubjectSummary(item.id).catch(() => undefined),
      })),
    );
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

  if (!hasRejectedSource) {
    recommendationCache = {
      createAt: Date.now(),
      items,
    };
  }

  return { items, hasFailedSources: hasRejectedSource };
}
