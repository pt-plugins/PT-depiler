import axios from "axios";
import { uniq } from "es-toolkit";
import {
  IFetchSocialSiteInformationConfig,
  ISocialInformation,
  ISocialSitePageInformation,
  TSupportSocialSitePageParserMatches,
} from "../types";

function isNonEmptyString(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

const tmdbUrlPattern =
  /^(?:https?:\/\/)?(?:www\.)?themoviedb\.org\/((?:movie|tv)\/\d+(?:-[^/?#]+)?(?:\/season\/\d+(?:\/episode\/\d+)?)?)\/?(?:\?.*)?$/;

export function build(id: string): string {
  return `https://www.themoviedb.org/${parse(id)}`;
}

export function parse(query: string | number | undefined): string {
  if (typeof query === "undefined") {
    return query as unknown as string;
  }

  const normalizedQuery = String(query).trim();
  const match = normalizedQuery.match(
    /(?:https?:\/\/)?(?:www\.)?themoviedb\.org\/((movie|tv)\/\d+)(?:-[^/?#]+)?((?:\/season\/\d+(?:\/episode\/\d+)?)?)\/?(?:\?.*)?$/,
  );

  if (match) {
    return `${match[1]}${match[3] ?? ""}`;
  }

  const idMatch = normalizedQuery.match(/^(movie|tv)\/\d+(?:\/season\/\d+(?:\/episode\/\d+)?)?$/);
  if (idMatch) {
    return idMatch[0];
  }

  return normalizedQuery;
}

function getBaseId(idOrUrl: string): string {
  return parse(idOrUrl).match(/^(movie\/\d+|tv\/\d+)/)?.[1] ?? "";
}

function buildTmdbExternalIdsUrl(docUrl: string): string {
  const baseId = getBaseId(docUrl);
  if (!baseId) {
    return "";
  }

  return `https://www.themoviedb.org/${baseId}/edit?active_nav_item=external_ids`;
}

function buildTmdbBaseUrl(docUrl: string): string {
  const baseId = getBaseId(docUrl);
  if (!baseId) {
    return "";
  }

  return `https://www.themoviedb.org/${baseId}`;
}

function buildTmdbSeasonsUrl(docUrl: string): string {
  const baseId = getBaseId(docUrl);
  if (!baseId.startsWith("tv/")) {
    return "";
  }

  return `https://www.themoviedb.org/${baseId}/seasons`;
}

async function fetchTmdbExternalIds(docUrl: string): Promise<{ imdb?: string; tvdb?: string }> {
  const externalIdsUrl = buildTmdbExternalIdsUrl(docUrl);
  if (!externalIdsUrl) {
    return {};
  }

  try {
    const { data: extDoc } = await axios.get<Document>(externalIdsUrl, {
      responseType: "document",
      withCredentials: true,
    });
    const imdb = extDoc.querySelector<HTMLInputElement>("#imdb_id")?.value?.trim() || undefined;
    const tvdb = extDoc.querySelector<HTMLInputElement>("#tvdb_id")?.value?.trim() || undefined;

    return { ...(imdb && { imdb }), ...(tvdb && { tvdb }) };
  } catch (error) {
    console.warn("Failed to fetch TMDb external ids page", error);
    return {};
  }
}

async function fetchTmdbSeriesOgTitleFromSeasons(docUrl: string): Promise<string | undefined> {
  const seasonsUrl = buildTmdbSeasonsUrl(docUrl);
  if (!seasonsUrl) {
    return undefined;
  }

  try {
    const { data: seasonsDoc } = await axios.get<Document>(seasonsUrl, {
      responseType: "document",
      withCredentials: true,
    });
    return seasonsDoc.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() || undefined;
  } catch (error) {
    console.warn("Failed to fetch TMDb seasons page", error);
    return undefined;
  }
}

async function fetchTmdbBaseTitles(docUrl: string): Promise<{ displayTitle?: string; originalTitle?: string }> {
  const baseUrl = buildTmdbBaseUrl(docUrl);
  if (!baseUrl) {
    return {};
  }

  try {
    const { data: baseDoc } = await axios.get<Document>(baseUrl, {
      responseType: "document",
      withCredentials: true,
    });
    const displayTitle = baseDoc.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() || undefined;
    const originalTitle = getOriginalTitleText(baseDoc) || undefined;

    return { displayTitle, originalTitle };
  } catch (error) {
    console.warn("Failed to fetch TMDb base page", error);
    return {};
  }
}

function getOriginalTitleText(doc: Document): string {
  const originalTitle = Array.from(doc.querySelectorAll("p.wrap")).find((item) => {
    const strongText = item.querySelector("strong")?.textContent?.trim();
    return strongText === "原始片名" || strongText === "Original Title" || strongText === "Original Name";
  });

  return originalTitle?.textContent?.replace(/^\s*(原始片名|Original Title|Original Name)\s*/i, "").trim() ?? "";
}

function formatSeasonCode(docUrl: string): string {
  const seasonNumber = docUrl.match(/\/season\/(\d+)/)?.[1];
  if (!seasonNumber) {
    return "";
  }

  return `S${seasonNumber.padStart(2, "0")}`;
}

async function pageParser(doc: Document): Promise<ISocialSitePageInformation | ISocialSitePageInformation[]> {
  const mediaType = doc.URL.match(/\/((movie|tv))\//)?.[1] as "movie" | "tv" | undefined;
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() ?? "";
  const originalTitleText = getOriginalTitleText(doc);
  const shouldUseBaseTitles = mediaType === "tv" && /\/(seasons|season\/\d+)(?:\?.*)?$/.test(doc.URL);
  const { displayTitle: baseDisplayTitle, originalTitle: baseOriginalTitle } = shouldUseBaseTitles ? await fetchTmdbBaseTitles(doc.URL) : {};
  const displayTitle = baseDisplayTitle || ogTitle;
  const originalTitle = baseOriginalTitle || originalTitleText;
  const external_ids = await fetchTmdbExternalIds(doc.URL);

  if (mediaType === "tv" && /\/seasons(?:\?.*)?$/.test(doc.URL)) {
    const seasonResults: ISocialSitePageInformation[] = Array.from(
      doc.querySelectorAll("div.season_wrapper div.season h2 a[href*='/season/']"),
    ).flatMap((item) => {
      const seasonTitle = item.textContent?.trim() ?? "";
      const seasonNumber = item.getAttribute("href")?.match(/\/season\/(\d+)/)?.[1] ?? "";
      if (!seasonTitle || !seasonNumber) {
        return [];
      }

      const titles = uniq([
        `${displayTitle} ${seasonTitle}`.trim(),
      ]).filter(isNonEmptyString);

      if (titles.length === 0) {
        return [];
      }

      return [
        {
          site: "tmdb",
          id: parse(doc.URL),
          mediaType,
          titles,
          external_ids,
          pageCategory: "season_list",
          seriesTitle: displayTitle,
          entryTitle: seasonTitle,
        },
      ];
    });

    if (seasonResults.length > 0) {
      return seasonResults;
    }
  }

  if (mediaType === "tv" && /\/season\/\d+(?:\?.*)?$/.test(doc.URL)) {
    const seasonCode = formatSeasonCode(doc.URL);
    const seasonDisplayTitle = (await fetchTmdbSeriesOgTitleFromSeasons(doc.URL)) ?? displayTitle;
    const currentSeasonTitle =
      doc.querySelector("h2 a[href*='/season/']")?.textContent?.trim() ?? doc.querySelector("section.header h2")?.textContent?.trim() ?? "";

    if (seasonCode) {
      return {
        site: "tmdb",
        id: parse(doc.URL),
        mediaType,
        titles: uniq([
          currentSeasonTitle ? `${seasonDisplayTitle} ${currentSeasonTitle}`.trim() : "",
          seasonDisplayTitle,
        ]).filter(isNonEmptyString),
        external_ids,
        pageCategory: "season_detail",
        seriesTitle: seasonDisplayTitle,
        entryTitle: currentSeasonTitle ? `${seasonDisplayTitle} ${currentSeasonTitle}`.trim() : seasonDisplayTitle,
      };
    }
  }

  return {
    site: "tmdb",
    id: parse(doc.URL),
    mediaType,
    titles: uniq([displayTitle, originalTitle]).filter(isNonEmptyString),
    external_ids,
  };
}

export const pageParserMatches: TSupportSocialSitePageParserMatches = [[tmdbUrlPattern, pageParser]];

interface ITmdbLdJson {
  name?: string;
  image?: string;
  description?: string;
  genre?: string[];
  aggregateRating?: {
    ratingValue?: number;
    ratingCount?: number;
  };
  countryOfOrigin?: Array<{ name?: string }>;
  startDate?: string;
  datePublished?: string;
}

export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  const realId = parse(String(id));
  const resDict = {
    site: "tmdb",
    id: realId,
    title: "",
    poster: "",
    summary: "",
    releaseYear: "",
    region: "",
    genres: [],
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;

  try {
    const { data } = await axios.get<Document>(build(realId), {
      responseType: "document",
      timeout: config.timeout ?? 10e3,
    });
    const ldJson = JSON.parse(data.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}") as ITmdbLdJson;
    const pageInfo = await pageParser(data);
    const firstPageInfo = Array.isArray(pageInfo) ? pageInfo[0] : pageInfo;

    resDict.title = firstPageInfo?.titles.join(" / ") || ldJson.name || "";
    resDict.poster = ldJson.image ?? "";
    resDict.summary = ldJson.description ?? "";
    resDict.releaseYear = (ldJson.startDate ?? ldJson.datePublished ?? "").slice(0, 4);
    resDict.region = ldJson.countryOfOrigin?.[0]?.name ?? "";
    resDict.genres = ldJson.genre ?? [];
    resDict.ratingScore = ldJson.aggregateRating?.ratingValue ?? 0;
    resDict.ratingCount = ldJson.aggregateRating?.ratingCount ?? 0;
  } catch (error) {
    console.warn(error);
  } finally {
    resDict.createAt = +Date.now();
  }

  return resDict;
}
