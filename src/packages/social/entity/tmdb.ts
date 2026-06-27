import axios from "axios";
import { uniq } from "es-toolkit";
import {
  IFetchSocialSiteInformationConfig,
  ISocialInformation,
  ISocialSitePageInformation,
  TSupportSocialSitePageParserMatches,
} from "../types";
import { commonParseFactory } from "../utils.ts";

const tmdbUrlPattern = /^(?:https?:\/\/)?(?:www\.)?themoviedb\.org\/(?:movie|tv)\/(\d+)(?:-[^/?#]+)?\/?(?:\?.*)?$/;

export function build(id: string): string {
  return `https://www.themoviedb.org/tv/${id}`;
}

export const parse = commonParseFactory([tmdbUrlPattern]);

function buildTmdbExternalIdsUrl(docUrl: string): string {
  try {
    const url = new URL(docUrl);
    const match = url.pathname.match(/^\/(movie|tv)\/\d+(?:-[^/]+)?/);
    if (!match) {
      return "";
    }

    return `${url.origin}${match[0]}/edit?active_nav_item=external_ids`;
  } catch {
    return "";
  }
}

async function fetchTmdbExternalIds(docUrl: string): Promise<{ imdb?: string; tvdb?: string }> {
  const externalIdsUrl = buildTmdbExternalIdsUrl(docUrl);
  if (!externalIdsUrl) {
    return {};
  }

  try {
    const resp = await fetch(externalIdsUrl, { credentials: "include" });
    if (!resp.ok) {
      return {};
    }

    const html = await resp.text();
    const extDoc = new DOMParser().parseFromString(html, "text/html");
    const imdb = extDoc.querySelector<HTMLInputElement>("#imdb_id")?.value?.trim() || undefined;
    const tvdb = extDoc.querySelector<HTMLInputElement>("#tvdb_id")?.value?.trim() || undefined;

    return { ...(imdb && { imdb }), ...(tvdb && { tvdb }) };
  } catch (error) {
    console.warn("Failed to fetch TMDb external ids page", error);
    return {};
  }
}

async function pageParser(doc: Document): Promise<ISocialSitePageInformation> {
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() ?? "";
  const originalTitle = Array.from(doc.querySelectorAll("p.wrap")).find((item) => {
    const strongText = item.querySelector("strong")?.textContent?.trim();
    return strongText === "原始片名" || strongText === "Original Title" || strongText === "Original Name";
  });
  const originalTitleText = originalTitle?.textContent?.replace(/^\s*(原始片名|Original Title|Original Name)\s*/i, "").trim() ?? "";
  const external_ids = await fetchTmdbExternalIds(doc.URL);

  return {
    site: "tmdb",
    id: parse(doc.URL),
    titles: uniq([ogTitle, originalTitleText]).filter(Boolean),
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

    resDict.title = pageInfo.titles.join(" / ") || ldJson.name || "";
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
