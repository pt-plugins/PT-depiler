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
  durationMs?: number;
  candidates: Array<{
    url: string;
    status?: number;
    contentType?: string;
    byteLength?: number;
    durationMs?: number;
    error?: string;
  }>;
}

interface IRecommendationItemPerformanceDiagnostic {
  item: string;
  title: string;
  category: ISocialRecommendationItem["category"];
  skipped?: boolean;
  totalMs?: number;
  socialInformationMs?: number;
  socialInformationNeeded?: boolean;
  socialInformationHit?: boolean;
  posterMs?: number;
  posterCandidateCount?: number;
  posterCacheHit?: boolean;
  posterHit?: boolean;
}

interface IRecommendationPerformanceDiagnostics {
  enrichment: TRecommendationEnrichmentMode;
  flush: boolean;
  count: number;
  visibleCount: number;
  enrichedCount: number;
  sourceMs: number;
  enrichmentMs: number;
  totalMs: number;
  concurrency: number;
  posterCacheSize: number;
  items: IRecommendationItemPerformanceDiagnostic[];
}

interface IEnrichRecommendationResult {
  item: ISocialRecommendationItem;
  itemPerformanceDiagnostic: IRecommendationItemPerformanceDiagnostic;
  posterDiagnostic?: IPosterDiagnostic;
}

interface IEnrichRecommendationsResult {
  items: ISocialRecommendationItem[];
  itemPerformanceDiagnostics: IRecommendationItemPerformanceDiagnostic[];
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

function inferImageContentType(buffer: ArrayBuffer, contentType?: string): string | undefined {
  if (contentType?.startsWith("image/")) {
    return contentType;
  }

  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  }
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return "image/webp";
  }

  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return [error.response?.status, error.message].filter(Boolean).join(" ");
  }

  return error instanceof Error ? error.message : String(error);
}

async function fetchPosterDataUrl(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
  ...posters: Array<string | undefined>
): Promise<{ poster?: string; diagnostic: IPosterDiagnostic }> {
  const startedAt = performance.now();
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
        durationMs: Math.round(performance.now() - startedAt),
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
        durationMs: Math.round(performance.now() - startedAt),
      },
    };
  }

  for (const candidate of candidates) {
    const candidateStartedAt = performance.now();
    try {
      const response = await axios.get<ArrayBuffer>(candidate, {
        responseType: "arraybuffer",
        timeout: posterFetchOptions.timeout,
      });
      const contentType = response.headers["content-type"];
      const normalizedContentType = typeof contentType === "string" ? contentType.split(";")[0] : undefined;
      const inferredContentType = inferImageContentType(response.data, normalizedContentType);
      diagnostic.candidates.push({
        url: candidate,
        status: response.status,
        contentType: normalizedContentType,
        byteLength: response.data.byteLength,
        durationMs: Math.round(performance.now() - candidateStartedAt),
      });

      if (inferredContentType && response.data.byteLength > 1024) {
        const poster = `data:${inferredContentType};base64,${arrayBufferToBase64(response.data)}`;
        setPosterDataUrlCache(cacheKey, poster);
        return {
          poster,
          diagnostic: {
            ...diagnostic,
            durationMs: Math.round(performance.now() - startedAt),
          },
        };
      }
    } catch (error) {
      diagnostic.candidates.push({
        url: candidate,
        durationMs: Math.round(performance.now() - candidateStartedAt),
        error: getErrorMessage(error),
      });
      console.warn("Failed to fetch recommendation poster", candidate, error);
    }
  }

  return {
    diagnostic: {
      ...diagnostic,
      durationMs: Math.round(performance.now() - startedAt),
    },
  };
}

async function enrichRecommendation(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
): Promise<IEnrichRecommendationResult> {
  const startedAt = performance.now();
  const needsSocialInformation =
    !item.poster || !item.summary || !item.releaseYear || !item.region || !item.genres?.length || !item.ratingScore;
  const socialInformationStartedAt = performance.now();
  const socialInformation = needsSocialInformation ? await getSocialInformationSafely(item) : undefined;
  const socialInformationMs = Math.round(performance.now() - socialInformationStartedAt);
  const posterStartedAt = performance.now();
  const posterResult = await fetchPosterDataUrl(item, enrichment, item.poster, socialInformation?.poster);
  const posterMs = Math.round(performance.now() - posterStartedAt);
  const itemPerformanceDiagnostic: IRecommendationItemPerformanceDiagnostic = {
    item: getRecommendationItemKey(item),
    title: item.title,
    category: item.category,
    totalMs: Math.round(performance.now() - startedAt),
    socialInformationMs,
    socialInformationNeeded: needsSocialInformation,
    socialInformationHit: !!socialInformation,
    posterMs,
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
    itemPerformanceDiagnostic,
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
          itemPerformanceDiagnostic: {
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
    itemPerformanceDiagnostics: results.map((result) => result.itemPerformanceDiagnostic),
    posterDiagnostics: results.flatMap((result) => (result.posterDiagnostic ? [result.posterDiagnostic] : [])),
  };
}

onMessage("getSocialRecommendations", async ({ data }) => {
  const requestStartedAt = performance.now();
  const options = (data ?? {}) as IGetSocialRecommendationsMessageOptions;
  const sourceStartedAt = performance.now();
  const result = await getSocialRecommendations(options);
  const sourceMs = Math.round(performance.now() - sourceStartedAt);

  if (options.enrichment === "none") {
    const performanceDiagnostics: IRecommendationPerformanceDiagnostics = {
      enrichment: "none",
      flush: options.flush ?? false,
      count: result.items.length,
      visibleCount: 0,
      enrichedCount: 0,
      sourceMs,
      enrichmentMs: 0,
      totalMs: Math.round(performance.now() - requestStartedAt),
      concurrency: RECOMMENDATION_ENRICHMENT_CONCURRENCY,
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
        performanceDiagnostics,
      },
    });
    return { ...result, performanceDiagnostics, posterDiagnostics: [] };
  }

  const enrichment = options.enrichment ?? "all";
  const enrichmentStartedAt = performance.now();
  const enrichmentResult = await enrichRecommendations(result.items, enrichment);
  const enrichmentMs = Math.round(performance.now() - enrichmentStartedAt);
  const enrichedCount = enrichmentResult.itemPerformanceDiagnostics.filter((item) => !item.skipped).length;
  const performanceDiagnostics: IRecommendationPerformanceDiagnostics = {
    enrichment,
    flush: options.flush ?? false,
    count: enrichmentResult.items.length,
    visibleCount: enrichment === "visible" ? enrichedCount : enrichmentResult.items.length,
    enrichedCount,
    sourceMs,
    enrichmentMs,
    totalMs: Math.round(performance.now() - requestStartedAt),
    concurrency: RECOMMENDATION_ENRICHMENT_CONCURRENCY,
    posterCacheSize: posterDataUrlCache.size,
    items: enrichmentResult.itemPerformanceDiagnostics,
  };

  logger({
    msg: "getSocialRecommendations",
    data: {
      count: enrichmentResult.items.length,
      flush: options.flush ?? false,
      hasFailedSources: result.hasFailedSources,
      enrichment,
      performanceDiagnostics,
      posterDiagnostics: enrichmentResult.posterDiagnostics,
    },
  });
  return {
    ...result,
    items: enrichmentResult.items,
    performanceDiagnostics,
    posterDiagnostics: enrichmentResult.posterDiagnostics,
  };
});

onMessage("getSocialRecommendationItem", async ({ data }) => {
  const requestStartedAt = performance.now();
  const enrichment = data.enrichment ?? "all";
  const result = await enrichRecommendation(data.item, enrichment);
  const performanceDiagnostics: IRecommendationPerformanceDiagnostics = {
    enrichment,
    flush: false,
    count: 1,
    visibleCount: enrichment === "visible" ? 1 : 0,
    enrichedCount: 1,
    sourceMs: 0,
    enrichmentMs: Math.round(performance.now() - requestStartedAt),
    totalMs: Math.round(performance.now() - requestStartedAt),
    concurrency: 1,
    posterCacheSize: posterDataUrlCache.size,
    items: [result.itemPerformanceDiagnostic],
  };

  logger({
    msg: "getSocialRecommendationItem",
    data: {
      item: getRecommendationItemKey(result.item),
      enrichment,
      performanceDiagnostics,
      posterDiagnostics: result.posterDiagnostic ? [result.posterDiagnostic] : [],
    },
  });

  return {
    item: result.item,
    performanceDiagnostics,
    posterDiagnostics: result.posterDiagnostic ? [result.posterDiagnostic] : [],
  };
});
