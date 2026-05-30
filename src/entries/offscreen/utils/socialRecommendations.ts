import { getSocialRecommendations } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { logger } from "./logger.ts";

onMessage("getSocialRecommendations", async ({ data }) => {
  const recommendations = await getSocialRecommendations(data ?? {});
  logger({ msg: "getSocialRecommendations", data: { count: recommendations.length, flush: data?.flush ?? false } });
  return recommendations;
});
