import axios from "axios";
import PQueue from "p-queue";
import { getSocialRecommendations } from "@ptd/social";
import type { ISocialRecommendationItem } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";
import { logger } from "./logger.ts";
import { getSocialInformation } from "./socialInformation.ts";

setupReplaceUnsafeHeader(axios);

type TRecommendationEnrichmentMode = "all" | "none" | "visible";

interface IGetSocialRecommendationsMessageOptions {
  flush?: boolean;
  enrichment?: TRecommendationEnrichmentMode;
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

function isDoubanPosterUrl(poster?: string) {
  return !!poster && /doubanio\.com/.test(poster);
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
  enrichment: TRecommendationEnrichmentMode,
  ...posters: Array<string | undefined>
): Promise<string | undefined> {
  const posterFetchOptions = getPosterFetchOptions(enrichment);
  const dataUrlPoster = posters.find((poster): poster is string => !!poster?.startsWith("data:image/"));

  if (dataUrlPoster) {
    return dataUrlPoster;
  }

  const candidates = getPosterCandidates(...posters).slice(0, posterFetchOptions.candidateLimit);
  const cacheKey = candidates.join("\n");
  const cachedPoster = posterDataUrlCache.get(cacheKey);

  if (cachedPoster) {
    return cachedPoster;
  }

  for (const candidate of candidates) {
    try {
      const response = await axios.get<Blob>(candidate, {
        headers: isDoubanPosterUrl(candidate) ? { Referer: "https://m.douban.com/" } : undefined,
        responseType: "blob",
        timeout: posterFetchOptions.timeout,
      });
      const contentType = response.headers["content-type"];
      const normalizedContentType =
        typeof contentType === "string" ? contentType.split(";")[0] : response.data.type || undefined;

      if (normalizedContentType?.startsWith("image/") && response.data.size > 1024) {
        const poster = await transformBlob(response.data);
        setPosterDataUrlCache(cacheKey, poster);
        return poster;
      }
    } catch (error) {
      console.warn("Failed to fetch recommendation poster", candidate, error);
    }
  }

  return undefined;
}

async function enrichRecommendation(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
): Promise<ISocialRecommendationItem> {
  const needsSocialInformation =
    !item.poster || !item.summary || !item.releaseYear || !item.region || !item.genres?.length || !item.ratingScore;
  const socialInformation = needsSocialInformation ? await getSocialInformationSafely(item) : undefined;
  const poster = await fetchPosterDataUrl(enrichment, item.poster, socialInformation?.poster);

  return {
    ...item,
    poster: poster || (isDoubanPosterUrl(item.poster) ? undefined : item.poster),
    summary: socialInformation?.summary || item.summary,
    releaseYear: socialInformation?.releaseYear || item.releaseYear,
    region: socialInformation?.region || item.region,
    genres: socialInformation?.genres?.length ? socialInformation.genres : item.genres,
    ratingScore: socialInformation?.ratingScore || item.ratingScore,
    ratingCount: socialInformation?.ratingCount || item.ratingCount,
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
): Promise<ISocialRecommendationItem[]> {
  const visibleItemKeys = getVisibleRecommendationItemKeys(items);
  const enrichmentQueue = new PQueue({ concurrency: RECOMMENDATION_ENRICHMENT_CONCURRENCY });
  return Promise.all(
    items.map((item) => {
      if (!shouldEnrichRecommendation(item, enrichment, visibleItemKeys)) {
        return item;
      }

      return enrichmentQueue.add(() => enrichRecommendation(item, enrichment)) as Promise<ISocialRecommendationItem>;
    }),
  );
}

onMessage("getSocialRecommendations", async ({ data }) => {
  const options = (data ?? {}) as IGetSocialRecommendationsMessageOptions;
  const result = await getSocialRecommendations(options);

  if (options.enrichment === "none") {
    logger({
      msg: "getSocialRecommendations",
      data: {
        count: result.items.length,
        flush: options.flush ?? false,
        hasFailedSources: result.hasFailedSources,
        enrichment: "none",
      },
    });
    return result;
  }

  const enrichment = options.enrichment ?? "all";
  const items = await enrichRecommendations(result.items, enrichment);

  logger({
    msg: "getSocialRecommendations",
    data: {
      count: items.length,
      flush: options.flush ?? false,
      hasFailedSources: result.hasFailedSources,
      enrichment,
    },
  });
  return { ...result, items };
});

onMessage("getSocialRecommendationItem", async ({ data }) => {
  const enrichment = data.enrichment ?? "all";
  const item = await enrichRecommendation(data.item, enrichment);

  logger({
    msg: "getSocialRecommendationItem",
    data: {
      item: getRecommendationItemKey(item),
      enrichment,
    },
  });

  return { item };
});
