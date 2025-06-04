import { getMediaServer } from "@ptd/mediaServer";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema, TSearchResultSnapshotStorageSchema } from "@/shared/types.ts";

import { logger } from "./logger.ts";
import { getSiteInstance } from "./site.ts";
import { type TBaseTorrentTagName } from "@ptd/site";

const torrentTagColorMap: Record<TBaseTorrentTagName, string> = {
  Free: "blue",
  "2xFree": "green",
  "2xUp": "lime",
  "2x50%": "light-green",
  "25%": "purple",
  "30%": "indigo",
  "35%": "indigo-darken-3",
  "50%": "orange",
  "70%": "blue-grey",
  "75%": "lime-darken-3",
  VIP: "orange-darken-2",
  "Excl.": "deep-orange-darken-1",
};

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  logger({
    msg: `getSiteSearchResult For site: ${siteId} with keyword: ${keyword}`,
    data: { siteId, keyword, searchEntry },
  });
  const site = await getSiteInstance<"public">(siteId);

  let searchResult = await site.getSearchResult(keyword, searchEntry);

  if (searchResult.data.length > 0) {
    // 将 tags 中的基础 tag 名称转换为对应的颜色
    searchResult.data.forEach((item) => {
      if (item.tags) {
        item.tags.forEach((tag) => {
          if (torrentTagColorMap[tag.name]) {
            tag.color = torrentTagColorMap[tag.name];
          }
        });
      }
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
