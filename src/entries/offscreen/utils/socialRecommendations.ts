import axios from "axios";
import { getSocialRecommendations } from "@ptd/social";
import type { ISocialRecommendationItem } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { logger } from "./logger.ts";
import { getSocialInformation } from "./socialInformation.ts";

interface IPosterDiagnostic {
  item: string;
  sources: string[];
  candidates: Array<{
    url: string;
    status?: number;
    contentType?: string;
    byteLength?: number;
    error?: string;
  }>;
}

const posterDiagnostics: IPosterDiagnostic[] = [];

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

  return Array.from(new Set(candidates));
}

async function getSocialInformationSafely(item: ISocialRecommendationItem) {
  try {
    return await getSocialInformation(item.site, item.id);
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
  ...posters: Array<string | undefined>
): Promise<{ poster?: string; diagnostic: IPosterDiagnostic }> {
  const diagnostic: IPosterDiagnostic = {
    item: `${item.category}:${item.site}:${item.id}`,
    sources: posters.filter((poster): poster is string => !!poster),
    candidates: [],
  };

  for (const candidate of getPosterCandidates(...posters)) {
    try {
      const response = await axios.get<ArrayBuffer>(candidate, {
        responseType: "arraybuffer",
        timeout: 8e3,
      });
      const contentType = response.headers["content-type"];
      const normalizedContentType = typeof contentType === "string" ? contentType.split(";")[0] : undefined;
      const inferredContentType = inferImageContentType(response.data, normalizedContentType);
      diagnostic.candidates.push({
        url: candidate,
        status: response.status,
        contentType: normalizedContentType,
        byteLength: response.data.byteLength,
      });

      if (inferredContentType && response.data.byteLength > 1024) {
        return {
          poster: `data:${inferredContentType};base64,${arrayBufferToBase64(response.data)}`,
          diagnostic,
        };
      }
    } catch (error) {
      diagnostic.candidates.push({ url: candidate, error: getErrorMessage(error) });
      console.warn("Failed to fetch recommendation poster", candidate, error);
    }
  }

  return { diagnostic };
}

async function enrichRecommendation(item: ISocialRecommendationItem): Promise<ISocialRecommendationItem> {
  const socialInformation = await getSocialInformationSafely(item);
  const posterResult = await fetchPosterDataUrl(item, item.poster, socialInformation?.poster);
  posterDiagnostics.push(posterResult.diagnostic);

  return {
    ...item,
    poster: posterResult.poster,
    summary: socialInformation?.summary || item.summary,
    ratingScore: socialInformation?.ratingScore || item.ratingScore,
    ratingCount: socialInformation?.ratingCount || item.ratingCount,
  };
}

onMessage("getSocialRecommendations", async ({ data }) => {
  const result = await getSocialRecommendations(data ?? {});
  posterDiagnostics.length = 0;
  const items = await Promise.all(result.items.map((item) => enrichRecommendation(item)));

  logger({
    msg: "getSocialRecommendations",
    data: {
      count: items.length,
      flush: data?.flush ?? false,
      hasFailedSources: result.hasFailedSources,
      posterDiagnostics: [...posterDiagnostics],
    },
  });
  return { ...result, items, posterDiagnostics: [...posterDiagnostics] };
});
