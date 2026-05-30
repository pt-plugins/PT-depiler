import { getSocialRecommendations } from "@ptd/social";
import type { ISocialRecommendationItem } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { logger } from "./logger.ts";
import { getSocialInformation } from "./socialInformation.ts";

async function enrichRecommendation(item: ISocialRecommendationItem): Promise<ISocialRecommendationItem> {
  try {
    const socialInformation = await getSocialInformation(item.site, item.id);
    return {
      ...item,
      poster: socialInformation?.poster || item.poster,
      ratingScore: socialInformation?.ratingScore || item.ratingScore,
      ratingCount: socialInformation?.ratingCount || item.ratingCount,
    };
  } catch (error) {
    console.warn("Failed to enrich social recommendation", item, error);
    return item;
  }
}

onMessage("getSocialRecommendations", async ({ data }) => {
  const result = await getSocialRecommendations(data ?? {});
  const items = await Promise.all(result.items.map((item) => enrichRecommendation(item)));

  logger({
    msg: "getSocialRecommendations",
    data: { count: items.length, flush: data?.flush ?? false, hasFailedSources: result.hasFailedSources },
  });
  return { ...result, items };
});
