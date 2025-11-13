import { uniqBy } from "es-toolkit";
import { getMediaServer } from "@ptd/mediaServer";
import { normalizedTorrentTagMap, sortTorrentTags } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema, TSearchResultSnapshotStorageSchema } from "@/shared/types.ts";

import { logger } from "./logger.ts";
import { getSiteInstance } from "./site.ts";

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  logger({
    msg: `getSiteSearchResult For site: ${siteId} with keyword: ${keyword}`,
    data: { siteId, keyword, searchEntry },
  });
  const site = await getSiteInstance<"public">(siteId);

  let searchResult = await site.getSearchResult(keyword, searchEntry);

  if (searchResult.data.length > 0) {
    searchResult.data = searchResult.data.map((item) => {
      if (item.tags) {
        // 尽可能将 tags 转换预定义的部分，去重并排序
        item.tags = sortTorrentTags(
          uniqBy(
            item.tags.map((tag) => {
              for (const normalizedTorrentTag of normalizedTorrentTagMap) {
                if (normalizedTorrentTag.from.test(tag.name)) {
                  return normalizedTorrentTag.to;
                }
              }
              return tag;
            }),
            (tag) => tag.name,
          ),
        );
      }
      return item;
    });
  }

  return searchResult;
});

onMessage("getMediaServerSearchResult", async ({ data: { mediaServerId, keywords = "", options = {} } }) => {
  logger({
    msg: `getMediaServerSearchResult For mediaServer: ${mediaServerId} with: ${keywords}`,
    data: { mediaServerId, keywords, options },
  });
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  const mediaServerConfig = metadataStore.mediaServers[mediaServerId];
  const mediaServer = await getMediaServer(mediaServerConfig);
  return await mediaServer.getSearchResult(keywords ?? "", options);
});

async function getSnapshotData() {
  return ((await sendMessage("getExtStorage", "searchResultSnapshot")) ?? {}) as TSearchResultSnapshotStorageSchema;
}

onMessage("getSearchResultSnapshotData", async ({ data: snapshotId }) => {
  const snapshotData = await getSnapshotData();
  return snapshotData?.[snapshotId];
});

onMessage("saveSearchResultSnapshotData", async ({ data: { snapshotId, data } }) => {
  const snapshotData = await getSnapshotData();
  snapshotData[snapshotId] = data;
  logger({ msg: `A new SearchResult Snapshot will be add at: ${snapshotId}`, data });
  await sendMessage("setExtStorage", { key: "searchResultSnapshot", value: snapshotData });
});

onMessage("removeSearchResultSnapshotData", async ({ data: snapshotId }) => {
  const snapshotData = await getSnapshotData();
  delete snapshotData[snapshotId];
  await sendMessage("setExtStorage", { key: "searchResultSnapshot", value: snapshotData });
  logger({ msg: `SearchResult Snapshot ${snapshotId} is removed.` });
});
