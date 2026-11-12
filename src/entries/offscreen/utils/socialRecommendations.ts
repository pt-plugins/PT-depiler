import axios from "axios";
import PQueue from "p-queue";
import { getSocialRecommendations, selectRecommendationRating } from "@ptd/social";
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
  if (item.site === "anilist") {
    return undefined;
  }
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

interface ILocalizedAnime {
  title?: string;
  summary?: string;
  genres?: string[];
}

const localizedAnimeCache = new Map<string, { expiresAt: number; match: Promise<ILocalizedAnime | undefined> }>();

function normalizeAnimeTitle(title: string) {
  return title
    .normalize("NFKC")
    .toLowerCase()
    .split(/[~～]/, 1)[0]
    .replace(/(?:season\s*(\d+)|(\d+)(?:nd|rd|th)\s*season|第\s*(\d+)\s*期)\s*[。.!！]?$/, "$1$2$3")
    .replace(/\b(ii|iii|iv)\s*$/, (part) => ({ ii: "2", iii: "3", iv: "4" })[part.trim()] ?? part)
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function chineseText(value?: string) {
  const text = value?.trim();
  return text &&
    /\p{Script=Han}/u.test(text) &&
    !/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(text)
    ? text
    : undefined;
}

async function findDoubanAnime(
  item: ISocialRecommendationItem,
  releaseDate: string,
): Promise<ILocalizedAnime | undefined> {
  const base = "https://m.douban.com/rexxar/api/v2";
  const options = { headers: { Referer: "https://m.douban.com/" }, timeout: 2e3 };
  const titles = new Set(item.titles.map(normalizeAnimeTitle));
  const seen = new Set<string>();

  for (const query of item.titles.slice(0, 2)) {
    const result = await axios
      .get<{ items?: Array<{ target_type?: string; target?: { id?: string } }> }>(`${base}/search/weixin`, {
        ...options,
        params: { q: (query.length > 70 ? query.split(/[~～]/, 1)[0] : query).trim() },
      })
      .catch(() => undefined);
    const ids = (result?.data.items ?? [])
      .flatMap(({ target_type, target }) => (target_type === "tv" && target?.id ? [String(target.id)] : []))
      .filter((id) => !seen.has(id))
      .slice(0, 2);
    ids.forEach((id) => seen.add(id));
    const details = await Promise.allSettled(
      ids.map((id) =>
        axios.get<{
          title?: string;
          original_title?: string;
          aka?: string[];
          genres?: string[];
          pubdate?: string[];
          intro?: string;
        }>(`${base}/tv/${id}`, options),
      ),
    );

    for (const detail of details) {
      if (detail.status !== "fulfilled") {
        continue;
      }
      const { title, original_title, aka, pubdate, genres, intro } = detail.value.data;
      const names = [original_title ?? "", ...(aka ?? [])];
      const dateMatches = pubdate?.some(
        (date) => Math.abs(Date.parse(date.slice(0, 10)) - Date.parse(releaseDate)) <= 86_400_000,
      );
      if (
        title &&
        genres?.includes("动画") &&
        dateMatches &&
        names.some((name) => titles.has(normalizeAnimeTitle(name)))
      ) {
        return {
          title: chineseText(title),
          summary: chineseText(intro),
          genres: genres.filter((genre) => genre !== "动画" && chineseText(genre)),
        };
      }
    }
  }
  return undefined;
}

async function findBangumiAnime(originalTitle: string, releaseDate: string): Promise<ILocalizedAnime | undefined> {
  const { data } = await axios.post<{
    data?: Array<{ name: string; name_cn?: string; date?: string; summary?: string }>;
  }>(
    "https://api.bgm.tv/v0/search/subjects?limit=5",
    { keyword: originalTitle, filter: { type: [2] } },
    { timeout: 1800 },
  );
  const match = data.data?.find(
    (entry) => entry.date === releaseDate && normalizeAnimeTitle(entry.name) === normalizeAnimeTitle(originalTitle),
  );
  return match ? { title: chineseText(match.name_cn), summary: chineseText(match.summary) } : undefined;
}

function getLocalizedAnime(item: ISocialRecommendationItem) {
  const { id, originalTitle, releaseDate } = item;
  if (item.site !== "anilist" || item.hasChineseAnimeDetails || !originalTitle || !releaseDate) {
    return undefined;
  }
  const cached = localizedAnimeCache.get(id);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.match;
  }
  if (localizedAnimeCache.size >= 50) {
    localizedAnimeCache.delete(localizedAnimeCache.keys().next().value!);
  }

  const match = findDoubanAnime(item, releaseDate)
    .catch(() => undefined)
    .then(async (douban) => {
      if (douban?.title && douban.summary) {
        return douban;
      }
      const bangumi = await findBangumiAnime(originalTitle, releaseDate).catch(() => undefined);
      return {
        title: douban?.title ?? bangumi?.title,
        summary: douban?.summary ?? bangumi?.summary,
        genres: douban?.genres,
      };
    });
  localizedAnimeCache.set(id, { expiresAt: Date.now() + 60 * 60 * 1000, match });
  return match;
}

async function enrichRecommendation(
  item: ISocialRecommendationItem,
  enrichment: TRecommendationEnrichmentMode,
): Promise<ISocialRecommendationItem> {
  const needsSocialInformation =
    !item.poster ||
    !item.summary ||
    !item.releaseYear ||
    !item.region ||
    !item.genres?.length ||
    item.ratingCount == null;
  const [socialInformation, localizedAnime] = await Promise.all([
    needsSocialInformation ? getSocialInformationSafely(item) : undefined,
    getLocalizedAnime(item),
  ]);
  const poster = await fetchPosterDataUrl(enrichment, item.poster, socialInformation?.poster);
  const localizedTitle = localizedAnime?.title?.trim();

  return {
    ...item,
    poster: poster || (isDoubanPosterUrl(item.poster) ? undefined : item.poster),
    title: localizedTitle || item.title,
    titles: localizedTitle ? [...new Set([localizedTitle, ...item.titles])] : item.titles,
    summary: localizedAnime?.summary?.trim() || socialInformation?.summary || item.summary,
    releaseYear: item.releaseYear || socialInformation?.releaseYear,
    region: socialInformation?.region || item.region,
    genres: localizedAnime?.genres?.length
      ? [...new Set([...localizedAnime.genres, ...(item.genres ?? [])])]
      : socialInformation?.genres?.length
        ? socialInformation.genres
        : item.genres,
    ...selectRecommendationRating(item, socialInformation),
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
