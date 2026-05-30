import { getSocialRecommendations } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { logger } from "./logger.ts";

onMessage("getSocialRecommendations", async ({ data }) => {
  const result = await getSocialRecommendations(data ?? {});
  logger({
    msg: "getSocialRecommendations",
    data: { count: result.items.length, flush: data?.flush ?? false, hasFailedSources: result.hasFailedSources },
  });
  return result;
});
