import axios from "axios";
import PQueue from "p-queue";
import { getSocialRecommendations } from "@ptd/social";
import type { ISocialRecommendationItem } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { logger } from "./logger.ts";
import { getSocialInformation } from "./socialInformation.ts";

type TRecommendationEnrichmentMode = "all" | "none" | "visible";

interface IGetSocialRecommendationsMessageOptions {
  flush?: boolean;
  enrichment?: TRecommendationEnrichmentMode;
}

interface IPosterDiagnostic {
  item: string;
  sources: string[];
  cacheHit?: boolean;
  candidates: Array<{
    url: string;
    status?: number;
    contentType?: string;
    byteLength?: number;
    error?: string;
  }>;
}

interface IRecommendationItemDiagnostic {
  item: string;
  title: string;
  category: ISocialRecommendationItem["category"];
  skipped?: boolean;
  socialInformationNeeded?: boolean;
  socialInformationHit?: boolean;
  posterCandidateCount?: number;
  posterCacheHit?: boolean;
  posterHit?: boolean;
}

interface IRecommendationDiagnostics {
  enrichment: TRecommendationEnrichmentMode;
  flush: boolean;
  count: number;
  visibleCount: number;
  enrichedCount: number;
  posterCacheSize: number;
  items: IRecommendationItemDiagnostic[];
}

interface IEnrichRecommendationResult {
  item: ISocialRecommendationItem;
  itemDiagnostic: IRecommendationItemDiagnostic;
  posterDiagnostic?: IPosterDiagnostic;
}

interface IEnrichRecommendationsResult {
  items: ISocialRecommendationItem[];
  itemDiagnostics: IRecommendationItemDiagnostic[];
  posterDiagnostics: IPosterDiagnostic[];
}

const RECOMMENDATION_ENRICHMENT_CONCURRENCY = 8;
const VISIBLE_RECOMMENDATION_CATEGORY_LIMIT = 5;
const POSTER_CANDIDATE_LIMIT = 8;
const VISIBLE_POSTER_CANDIDATE_LIMIT = 2;
const POSTER_CACHE_LIMIT = 100;
const POSTER_FETCH_TIMEOUT = 3e3;
const VISIBLE_POSTER_FETCH_TIMEOUT = 800;
const posterDataUrlCache = new Map<string, string>();

function setPosterDataUrlCache(key: string, poster: string) {
  if (posterDataUrlCache.size >= POSTER_CACHE_LIMIT) {
    const oldestKey = posterDataUrlCache.keys().next().value;
    if (oldestKey) {
      posterDataUrlCache.delete(oldestKey);
    }
  }
  posterDataUrlCache.set(key, poster);
}

function getDoubanPosterRatioCandidates(poster: string): string[] {
  return [
    poster,
    poster.replace("/l_ratio_poster/", "/s_ratio_poster/"),
    poster.replace("/l_ratio_poster/", "/m_ratio_poster/"),
    poster.replace("/s_ratio_poster/", "/m_ratio_poster/"),
    poster.replace("/s_ratio_poster/", "/l_ratio_poster/"),
  ];
}

function getPosterCandidates(...posters: Array<string | undefined>): string[] {
  const candidates = posters.flatMap((poster) => {
    if (!poster || !/doubanio\.com/.test(poster)) {
      return poster ? [poster] : [];
    }

    return getDoubanPosterRatioCandidates(poster).flatMap((ratioCandidate) =>
      ["img1", "img2", "img3", "img9"].map((host) => ratioCandidate.replace(/img\d(?=\.doubanio\.com)/, host)),
    );
  });

  return Array.from(new Set(candidates)).slice(0, POSTER_CANDIDATE_LIMIT);
}

function getPosterFetchOptions(enrichment: TRecommendationEnrichmentMode) {
  return enrichment === "visible"
    ? {
        candidateLimit: VISIBLE_POSTER_CANDIDATE_LIMIT,
        timeout: VISIBLE_POSTER_FETCH_TIMEOUT,
      }
    : {
        candidateLimit: POSTER_CANDIDATE_LIMIT,
        timeout: POSTER_FETCH_TIMEOUT,
      };
}

async function getSocialInformationSafely(item: ISocialRecommendationItem) {
  try {
    return await getSocialInformation(item.site, item.id, {
      requireMetadata: !item.releaseYear || !item.region || !item.genres?.length,
      requireSummary: !item.summary,
    });
  } catch (error) {
    console.warn("Failed to enrich social recommendation", item, error);
    return undefined;
  }
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return [error.response?.status, error.message].filter(Boolean).join(" ");
  }

  return error instanceof Error ? error.message : String(error);
}

function transformBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Error when parse recommendation poster Blob"));
      }
    });

    reader.readAsDataURL(blob);
  });
}

async function fetchPosterDataUrl(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
  ...posters: Array<string | undefined>
): Promise<{ poster?: string; diagnostic: IPosterDiagnostic }> {
  const posterFetchOptions = getPosterFetchOptions(enrichment);
  const diagnostic: IPosterDiagnostic = {
    item: `${item.category}:${item.site}:${item.id}`,
    sources: posters.filter((poster): poster is string => !!poster),
    candidates: [],
  };
  const dataUrlPoster = posters.find((poster): poster is string => !!poster?.startsWith("data:image/"));

  if (dataUrlPoster) {
    return {
      poster: dataUrlPoster,
      diagnostic: {
        ...diagnostic,
        cacheHit: true,
      },
    };
  }

  const candidates = getPosterCandidates(...posters).slice(0, posterFetchOptions.candidateLimit);
  const cacheKey = candidates.join("\n");
  const cachedPoster = posterDataUrlCache.get(cacheKey);

  if (cachedPoster) {
    return {
      poster: cachedPoster,
      diagnostic: {
        ...diagnostic,
        cacheHit: true,
      },
    };
  }

  for (const candidate of candidates) {
    try {
      const response = await axios.get<Blob>(candidate, {
        responseType: "blob",
        timeout: posterFetchOptions.timeout,
      });
      const contentType = response.headers["content-type"];
      const normalizedContentType =
        typeof contentType === "string" ? contentType.split(";")[0] : response.data.type || undefined;
      diagnostic.candidates.push({
        url: candidate,
        status: response.status,
        contentType: normalizedContentType,
        byteLength: response.data.size,
      });

      if (normalizedContentType?.startsWith("image/") && response.data.size > 1024) {
        const poster = await transformBlob(response.data);
        setPosterDataUrlCache(cacheKey, poster);
        return {
          poster,
          diagnostic,
        };
      }
    } catch (error) {
      diagnostic.candidates.push({
        url: candidate,
        error: getErrorMessage(error),
      });
      console.warn("Failed to fetch recommendation poster", candidate, error);
    }
  }

  return {
    diagnostic,
  };
}

async function enrichRecommendation(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
): Promise<IEnrichRecommendationResult> {
  const needsSocialInformation =
    !item.poster || !item.summary || !item.releaseYear || !item.region || !item.genres?.length || !item.ratingScore;
  const socialInformation = needsSocialInformation ? await getSocialInformationSafely(item) : undefined;
  const posterResult = await fetchPosterDataUrl(item, enrichment, item.poster, socialInformation?.poster);
  const itemDiagnostic: IRecommendationItemDiagnostic = {
    item: getRecommendationItemKey(item),
    title: item.title,
    category: item.category,
    socialInformationNeeded: needsSocialInformation,
    socialInformationHit: !!socialInformation,
    posterCandidateCount: posterResult.diagnostic.candidates.length,
    posterCacheHit: posterResult.diagnostic.cacheHit,
    posterHit: !!posterResult.poster,
  };

  return {
    item: {
      ...item,
      poster: posterResult.poster,
      summary: socialInformation?.summary || item.summary,
      releaseYear: socialInformation?.releaseYear || item.releaseYear,
      region: socialInformation?.region || item.region,
      genres: socialInformation?.genres?.length ? socialInformation.genres : item.genres,
      ratingScore: socialInformation?.ratingScore || item.ratingScore,
      ratingCount: socialInformation?.ratingCount || item.ratingCount,
    },
    itemDiagnostic,
    posterDiagnostic: posterResult.diagnostic,
  };
}

function getRecommendationItemKey(item: ISocialRecommendationItem) {
  return `${item.category}:${item.site}:${item.id}`;
}

function getVisibleRecommendationItemKeys(items: ISocialRecommendationItem[]) {
  const categoryCounts = new Map<ISocialRecommendationItem["category"], number>();
  const visibleItemKeys = new Set<string>();

  for (const item of items) {
    const categoryCount = categoryCounts.get(item.category) ?? 0;
    categoryCounts.set(item.category, categoryCount + 1);

    if (categoryCount < VISIBLE_RECOMMENDATION_CATEGORY_LIMIT) {
      visibleItemKeys.add(getRecommendationItemKey(item));
    }
  }

  return visibleItemKeys;
}

function shouldEnrichRecommendation(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
  visibleItemKeys: Set<string>,
) {
  return enrichment !== "visible" || visibleItemKeys.has(getRecommendationItemKey(item));
}

async function enrichRecommendations(
  items: ISocialRecommendationItem[],
  enrichment: TRecommendationEnrichmentMode,
): Promise<IEnrichRecommendationsResult> {
  const visibleItemKeys = getVisibleRecommendationItemKeys(items);
  const enrichmentQueue = new PQueue({ concurrency: RECOMMENDATION_ENRICHMENT_CONCURRENCY });
  const results = await Promise.all(
    items.map((item) => {
      if (!shouldEnrichRecommendation(item, enrichment, visibleItemKeys)) {
        return {
          item,
          itemDiagnostic: {
            item: getRecommendationItemKey(item),
            title: item.title,
            category: item.category,
            skipped: true,
          },
          posterDiagnostic: undefined,
        } satisfies IEnrichRecommendationResult;
      }

      return enrichmentQueue.add(() => enrichRecommendation(item, enrichment)) as Promise<IEnrichRecommendationResult>;
    }),
  );

  return {
    items: results.map((result) => result.item),
    itemDiagnostics: results.map((result) => result.itemDiagnostic),
    posterDiagnostics: results.flatMap((result) => (result.posterDiagnostic ? [result.posterDiagnostic] : [])),
  };
}

onMessage("getSocialRecommendations", async ({ data }) => {
  const options = (data ?? {}) as IGetSocialRecommendationsMessageOptions;
  const result = await getSocialRecommendations(options);

  if (options.enrichment === "none") {
    const recommendationDiagnostics: IRecommendationDiagnostics = {
      enrichment: "none",
      flush: options.flush ?? false,
      count: result.items.length,
      visibleCount: 0,
      enrichedCount: 0,
      posterCacheSize: posterDataUrlCache.size,
      items: [],
    };
    logger({
      msg: "getSocialRecommendations",
      data: {
        count: result.items.length,
        flush: options.flush ?? false,
        hasFailedSources: result.hasFailedSources,
        enrichment: "none",
        recommendationDiagnostics,
      },
    });
    return { ...result, posterDiagnostics: [] };
  }

  const enrichment = options.enrichment ?? "all";
  const enrichmentResult = await enrichRecommendations(result.items, enrichment);
  const enrichedCount = enrichmentResult.itemDiagnostics.filter((item) => !item.skipped).length;
  const recommendationDiagnostics: IRecommendationDiagnostics = {
    enrichment,
    flush: options.flush ?? false,
    count: enrichmentResult.items.length,
    visibleCount: enrichment === "visible" ? enrichedCount : enrichmentResult.items.length,
    enrichedCount,
    posterCacheSize: posterDataUrlCache.size,
    items: enrichmentResult.itemDiagnostics,
  };

  logger({
    msg: "getSocialRecommendations",
    data: {
      count: enrichmentResult.items.length,
      flush: options.flush ?? false,
      hasFailedSources: result.hasFailedSources,
      enrichment,
      recommendationDiagnostics,
      posterDiagnostics: enrichmentResult.posterDiagnostics,
    },
  });
  return {
    ...result,
    items: enrichmentResult.items,
    posterDiagnostics: enrichmentResult.posterDiagnostics,
  };
});

onMessage("getSocialRecommendationItem", async ({ data }) => {
  const enrichment = data.enrichment ?? "all";
  const result = await enrichRecommendation(data.item, enrichment);
  const recommendationDiagnostics: IRecommendationDiagnostics = {
    enrichment,
    flush: false,
    count: 1,
    visibleCount: enrichment === "visible" ? 1 : 0,
    enrichedCount: 1,
    posterCacheSize: posterDataUrlCache.size,
    items: [result.itemDiagnostic],
  };

  logger({
    msg: "getSocialRecommendationItem",
    data: {
      item: getRecommendationItemKey(result.item),
      enrichment,
      recommendationDiagnostics,
      posterDiagnostics: result.posterDiagnostic ? [result.posterDiagnostic] : [],
    },
  });

  return {
    item: result.item,
    posterDiagnostics: result.posterDiagnostic ? [result.posterDiagnostic] : [],
  };
});
