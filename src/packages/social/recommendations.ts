import axios from "axios";
import PQueue from "p-queue";

import { getChineseAnime, translateAnimeGenres } from "./animeLocalization.ts";

import type { ISocialSitePageInformation, TSupportSocialSite } from "./types.ts";

export type TSocialRecommendationCategory = "movie" | "tv" | "variety" | "anime";

export interface ISocialRecommendationItem {
  id: string;
  site: Extract<TSupportSocialSite, "douban" | "bangumi"> | "anilist";
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
  ratingFetchedAt?: number;
  releaseDate?: string;
  originalTitle?: string;
  hasChineseAnimeDetails?: boolean;
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
  kind?: "page" | "doubanSearchSubjects" | "doubanSubjectCollection" | "anilist";
  referer?: string;
}

export interface IGetSocialRecommendationsOptions {
  flush?: boolean;
}

const RECOMMENDATION_CACHE_TTL = 6 * 60 * 60 * 1000;
const RECOMMENDATION_CATEGORY_LIMIT = 10;
const RECOMMENDATION_SOURCE_CONCURRENCY = 6;
const recommendationCategories: TSocialRecommendationCategory[] = ["movie", "tv", "variety", "anime"];

const backupRecommendationSources: ISocialRecommendationSource[] = [
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
    url: "https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%BB%BC%E8%89%BA&sort=time&page_limit=10&page_start=0",
    limit: 10,
    kind: "doubanSearchSubjects",
  },
  {
    site: "douban",
    category: "movie",
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

function doubanCollection(category: TSocialRecommendationCategory, name: string): ISocialRecommendationSource {
  return {
    site: "douban",
    category,
    url: `https://m.douban.com/rexxar/api/v2/subject_collection/${name}/items?items_only=1&start=0&count=12`,
    limit: 12,
    kind: "doubanSubjectCollection",
    referer: `https://m.douban.com/subject_collection/${name}`,
  };
}

const primaryRecommendationSources: ISocialRecommendationSource[] = [
  doubanCollection("movie", "movie_weekly_best"),
  doubanCollection("movie", "movie_showing"),
  doubanCollection("tv", "tv_domestic"),
  doubanCollection("tv", "tv_american"),
  doubanCollection("tv", "tv_korean"),
  doubanCollection("tv", "tv_japanese"),
  doubanCollection("variety", "tv_variety_show"),
  { site: "anilist", category: "anime", url: "https://graphql.anilist.co", limit: 10, kind: "anilist" },
];

const varietyGenres = new Set(["真人秀", "脱口秀", "综艺"]);
const nonDramaGenres = new Set([...varietyGenres, "动画", "纪录片"]);
const doubanDetailQueue = new PQueue({ concurrency: 8 });

export function normalizeRecommendationRating(score?: unknown, count?: unknown, fetchedAt = Date.now()) {
  const parsedScore = Number(score);
  if (!Number.isFinite(parsedScore) || parsedScore <= 0 || parsedScore > 10) {
    return undefined;
  }
  const parsedCount = Number(count);
  return {
    ratingScore: parsedScore,
    ratingCount: Number.isSafeInteger(parsedCount) && parsedCount > 0 ? parsedCount : undefined,
    ratingFetchedAt: fetchedAt,
  };
}

export function selectRecommendationRating(
  item: ISocialRecommendationItem,
  details?: { ratingScore?: number; ratingCount?: number; createAt: number },
) {
  const current = normalizeRecommendationRating(item.ratingScore, item.ratingCount, item.ratingFetchedAt);
  const candidate =
    details && normalizeRecommendationRating(details.ratingScore, details.ratingCount, details.createAt);
  // A complete rating from the live chart takes precedence over enrichment providers,
  // whose response timestamp may reflect when a cached upstream payload was downloaded.
  if (
    !candidate ||
    (current &&
      (current.ratingCount != null ||
        candidate.ratingCount == null ||
        candidate.ratingFetchedAt < current.ratingFetchedAt))
  ) {
    return current;
  }
  return candidate;
}

function getTokyoDate(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);
}

interface IAniListMedia {
  id: number;
  title: { native?: string; romaji?: string; english?: string };
  format: string;
  countryOfOrigin: string;
  status: string;
  startDate: { year?: number; month?: number; day?: number };
  coverImage?: { large?: string };
  description?: string;
  genres?: string[];
  averageScore?: number;
  stats?: { scoreDistribution?: Array<{ amount: number }> };
}

const aniListSeasonQuery = `
  query ($season: MediaSeason!, $year: Int!, $before: FuzzyDateInt!, $limit: Int!) {
    Page(perPage: $limit) {
      media(type: ANIME, countryOfOrigin: JP, season: $season, seasonYear: $year,
        format_in: [TV, TV_SHORT, ONA], status_in: [RELEASING, FINISHED],
        startDate_lesser: $before, isAdult: false, sort: [POPULARITY_DESC, ID]) {
        id title { native romaji english } format countryOfOrigin status
        startDate { year month day } coverImage { large } description(asHtml: false)
        genres averageScore stats { scoreDistribution { amount } }
      }
    }
  }
`;

async function fetchAniListRecommendations(source: ISocialRecommendationSource): Promise<ISocialRecommendationItem[]> {
  const today = getTokyoDate();
  const [year, month, day] = today.split("-").map(Number);
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"];
  const season = seasons[Math.floor((month - 1) / 3)];
  const { data } = await axios.post<{ data?: { Page?: { media?: IAniListMedia[] } } }>(
    source.url,
    {
      query: aniListSeasonQuery,
      variables: { season, year, before: Number(tomorrow.replaceAll("-", "")), limit: source.limit },
    },
    { timeout: 5e3 },
  );

  return (data.data?.Page?.media ?? []).flatMap((item) => {
    const { year, month, day } = item.startDate;
    if (!year || !month || !day) {
      return [];
    }
    const titles = [
      ...new Set(
        [item.title.native, item.title.romaji, item.title.english].filter((title): title is string => !!title),
      ),
    ];
    const releaseDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (
      !titles.length ||
      releaseDate > today ||
      item.countryOfOrigin !== "JP" ||
      !["TV", "TV_SHORT", "ONA"].includes(item.format) ||
      !["RELEASING", "FINISHED"].includes(item.status)
    ) {
      return [];
    }

    const chinese = getChineseAnime(item.id);
    return [
      {
        site: "anilist",
        id: String(item.id),
        category: "anime",
        sourceUrl: `https://anilist.co/anime/${item.id}`,
        title: chinese?.title ?? titles[0],
        titles: chinese ? [chinese.title, ...titles] : titles,
        hasChineseAnimeDetails: !!chinese,
        originalTitle: item.title.native,
        releaseDate,
        releaseYear: String(year),
        region: "日本",
        poster: item.coverImage?.large,
        summary:
          chinese?.summary ??
          item.description
            ?.replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .trim(),
        genres: translateAnimeGenres(item.genres),
        ...normalizeRecommendationRating(
          item.averageScore == null ? undefined : item.averageScore / 10,
          item.stats?.scoreDistribution?.reduce((count, bucket) => count + bucket.amount, 0),
        ),
      },
    ];
  });
}

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

interface IDoubanSubject {
  id?: string;
  title?: string;
  original_title?: string;
  type?: string;
  url?: string;
  pubdate?: string[];
  episodes_info?: string;
  intro?: string;
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
}

interface IDoubanSubjectCollectionResponse {
  subject_collection_items?: IDoubanSubject[];
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
  const seenTitles = new Set<string>();
  const maxGroupLength = Math.max(0, ...sourceItemGroups.map((items) => items.length));

  for (let itemIndex = 0; itemIndex < maxGroupLength && mergedItems.length < limit; itemIndex++) {
    for (const items of sourceItemGroups) {
      const item = items[itemIndex];
      if (!item) {
        continue;
      }

      const uniqueId = `${item.category}:${item.site}:${item.id}`;
      const titleKeys = item.releaseDate
        ? [...item.titles, item.originalTitle ?? ""].filter(Boolean).map(
            (title) =>
              `${item.category}:${item.releaseDate}:${title
                .normalize("NFKC")
                .toLowerCase()
                .replace(/[^\p{L}\p{N}]/gu, "")}`,
          )
        : [];
      if (existingIds.has(uniqueId) || titleKeys.some((key) => seenTitles.has(key))) {
        continue;
      }

      existingIds.add(uniqueId);
      titleKeys.forEach((key) => seenTitles.add(key));
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
        ...normalizeRecommendationRating(item.rate),
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
      if (item.type !== (source.category === "movie" ? "movie" : "tv")) {
        return undefined;
      }

      const genres = cardSubtitleMetadata.genres ?? [];
      if (
        (source.category === "tv" && genres.some((genre) => nonDramaGenres.has(genre))) ||
        (source.category === "variety" &&
          source.kind === "doubanSearchSubjects" &&
          !genres.some((genre) => varietyGenres.has(genre)))
      ) {
        return undefined;
      }

      return {
        id,
        site: source.site,
        category: source.category,
        title,
        titles: [title],
        sourceUrl: item.url ?? `https://movie.douban.com/subject/${id}/`,
        poster: normalizeDoubanImageUrl(item.pic?.large ?? item.pic?.normal),
        summary: (item.intro || item.comment)?.trim(),
        originalTitle: item.original_title?.trim(),
        releaseDate: getDoubanReleaseDate(item),
        releaseYear: item.year?.trim() || cardSubtitleMetadata.releaseYear,
        region: cardSubtitleMetadata.region,
        genres: cardSubtitleMetadata.genres,
        ...normalizeRecommendationRating(item.rating?.value, item.rating?.count),
      } satisfies ISocialRecommendationItem;
    })
    .filter((item): item is ISocialRecommendationItem => !!item)
    .slice(0, source.limit);
}

function getDoubanReleaseDate(item: IDoubanSubject) {
  return item.pubdate
    ?.map((date) => date.slice(0, 10))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort()[0];
}

async function verifyDoubanRecommendation(
  candidate: ISocialRecommendationItem,
  source: ISocialRecommendationSource,
): Promise<ISocialRecommendationItem | undefined> {
  const type = source.category === "movie" ? "movie" : "tv";
  try {
    const { data } = await axios.get<IDoubanSubject>(`https://m.douban.com/rexxar/api/v2/${type}/${candidate.id}`, {
      headers: { Referer: "https://m.douban.com/" },
      timeout: 3e3,
    });
    const [item] = normalizeDoubanSubjectCollection({ subject_collection_items: [data] }, source);
    if (!item) {
      return undefined;
    }

    const today = getTokyoDate();
    const month = Number(today.slice(5, 7));
    const seasonStart = `${today.slice(0, 4)}-${String(Math.floor((month - 1) / 3) * 3 + 1).padStart(2, "0")}-01`;
    const cutoff = source.category === "anime" ? seasonStart : getRecentReleaseCutoff();
    if (!item.releaseDate || item.releaseDate > today || item.releaseDate < cutoff) {
      return undefined;
    }

    if (
      source.category === "anime" &&
      (!item.genres?.includes("动画") || !item.region?.split(/\s+/).includes("日本"))
    ) {
      return undefined;
    }

    return {
      ...candidate,
      ...item,
      poster: item.poster ?? candidate.poster,
      ...(candidate.ratingScore && !item.ratingScore
        ? normalizeRecommendationRating(candidate.ratingScore, candidate.ratingCount, candidate.ratingFetchedAt)
        : undefined),
    };
  } catch {
    return undefined;
  }
}

async function verifyDoubanRecommendations(items: ISocialRecommendationItem[], source: ISocialRecommendationSource) {
  const verified = await Promise.all(
    items.map((item) => doubanDetailQueue.add(() => verifyDoubanRecommendation(item, source))),
  );
  return verified.filter((item): item is ISocialRecommendationItem => !!item);
}

function getRecentReleaseCutoff() {
  return getTokyoDate(new Date(Date.now() - 120 * 86_400_000));
}

function rankWeeklyMovieRecommendations(items: ISocialRecommendationItem[]) {
  const ratedItems = items.filter((item) => item.ratingScore != null && item.ratingCount != null);
  if (!ratedItems.length) {
    return items;
  }
  const mean = ratedItems.reduce((sum, item) => sum + item.ratingScore!, 0) / ratedItems.length;
  const priorVotes = 1000;
  const adjustedScore = (item: ISocialRecommendationItem) =>
    item.ratingScore != null && item.ratingCount != null
      ? (item.ratingScore * item.ratingCount + mean * priorVotes) / (item.ratingCount + priorVotes)
      : Number.NEGATIVE_INFINITY;
  return items.toSorted((a, b) => adjustedScore(b) - adjustedScore(a));
}

async function fetchRecommendationSource(source: ISocialRecommendationSource): Promise<ISocialRecommendationItem[]> {
  if (source.site === "anilist") {
    return fetchAniListRecommendations(source);
  }

  if (source.kind === "doubanSearchSubjects") {
    const { data } = await axios.get<IDoubanSearchSubjectsResponse>(source.url, {
      responseType: "json",
      timeout: 10e3,
    });

    return verifyDoubanRecommendations(normalizeDoubanSearchSubjects(data, source), source);
  }

  if (source.kind === "doubanSubjectCollection") {
    const { data } = await axios.get<IDoubanSubjectCollectionResponse>(source.url, {
      headers: source.referer ? { Referer: source.referer } : undefined,
      responseType: "json",
      timeout: 10e3,
    });

    const cutoff = getRecentReleaseCutoff();
    const today = getTokyoDate();
    const items = normalizeDoubanSubjectCollection(data, source);
    const recentItems = items.filter((item) => {
      if (item.releaseDate) {
        return item.releaseDate >= cutoff && item.releaseDate <= today;
      }
      return !!item.releaseYear && item.releaseYear >= cutoff.slice(0, 4) && item.releaseYear <= today.slice(0, 4);
    });
    return source.referer?.endsWith("/movie_weekly_best") ? rankWeeklyMovieRecommendations(recentItems) : recentItems;
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

  async function fetchGroups(sources: ISocialRecommendationSource[]) {
    const results = await settleRecommendationItemsWithConcurrency(
      sources,
      RECOMMENDATION_SOURCE_CONCURRENCY,
      fetchRecommendationSource,
    );
    return results.flatMap((result) => {
      if (result.status === "fulfilled") {
        return result.value.length ? [result.value] : [];
      }
      console.warn("Failed to fetch social recommendations", result.reason);
      return [];
    });
  }

  const primaryGroups = await fetchGroups(primaryRecommendationSources);
  const primaryByCategory = recommendationCategories.map((category) =>
    mergeRecommendationSourceItems(
      primaryGroups.filter((group) => group[0].category === category),
      RECOMMENDATION_CATEGORY_LIMIT,
    ),
  );
  const incompleteCategories = new Set(
    recommendationCategories.filter((_, index) => primaryByCategory[index].length < RECOMMENDATION_CATEGORY_LIMIT),
  );
  const backupGroups = await fetchGroups(
    backupRecommendationSources.filter((source) => incompleteCategories.has(source.category)),
  );
  const items = recommendationCategories.flatMap((category, index) => {
    const primary = primaryByCategory[index];
    const backup = mergeRecommendationSourceItems(
      backupGroups.filter((group) => group[0].category === category),
      Number.POSITIVE_INFINITY,
    );
    return mergeRecommendationSourceItems([[...primary, ...backup]], RECOMMENDATION_CATEGORY_LIMIT);
  });
  const hasRejectedSource = !canCacheRecommendationItems(items);

  if (canCacheRecommendationItems(items)) {
    recommendationCache = {
      createAt: Date.now(),
      items,
    };
  }

  return { items, hasFailedSources: hasRejectedSource };
}
