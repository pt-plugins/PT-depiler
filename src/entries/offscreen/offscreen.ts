import { getSiteInstance } from "../shared/adapters/site.ts";
import { onMessage, sendMessage } from "@/messages.ts";
import { getDownloader, getRemoteTorrentFile } from "@ptd/downloader";
import { EResultParseStatus, type ITorrent, type IUserInfo } from "@ptd/site";
import type { IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";
import { log } from "~/helper.ts";
import {
  getDownloadHistory,
  getDownloadHistoryById,
  getSocialInformation,
  setDownloadHistory,
} from "@/shared/storages/indexdb.ts";
import type { ITorrentDownloadMetadata } from "@/shared/storages/types/indexdb.ts";
import type { ISearchResultTorrent } from "@/shared/storages/types/runtime.ts";

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  const site = await getSiteInstance<"public">(siteId);
  return await site.getSearchResult(keyword, searchEntry);
});

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => {
  const site = await getSiteInstance<"private">(siteId);

  // 获取历史信息
  const metadataStoreRaw = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  let lastUserInfo = metadataStoreRaw?.lastUserInfo?.[siteId as string] ?? {};

  let userInfo = await site.getUserInfoResult(lastUserInfo);
  if (userInfo.status === EResultParseStatus.success) {
    await sendMessage("setSiteLastUserInfo", userInfo as IUserInfo); // 只有获取成功才保存
  }

  return userInfo;
});

onMessage("getTorrentDownloadLink", async ({ data: torrent }) => {
  const site = await getSiteInstance<"public">(torrent.site);
  return await site.getTorrentDownloadLink(torrent);
});

function buildDownloadHistory(torrent: ITorrent, downloaderId: string = "local"): ITorrentDownloadMetadata {
  return {
    siteId: torrent.site,
    torrentId: torrent.id,
    downloaderId,
    title: torrent.title,
    subTitle: torrent.subTitle,
    url: torrent.url,
    link: torrent.link,
    downloadAt: +Date.now(),
    downloadStatus: "pending",
    torrent: torrent as ISearchResultTorrent,
  };
}

onMessage("downloadTorrentToLocalFile", async ({ data: torrent }) => {
  const downloadHistory = buildDownloadHistory(torrent);
  const downloadId = await setDownloadHistory(downloadHistory);

  const site = await getSiteInstance<"public">(torrent.site);
  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);

  await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "downloading" });
  try {
    const torrentInstance = await getRemoteTorrentFile(downloadRequestConfig);
    const torrentUrl = URL.createObjectURL(torrentInstance.metadata.blob());
    let filename = torrentInstance.name;
    if (filename === "1.torrent") {
      // 如果文件名是缺省的 1.torrent，那么使用种子属性中的站点名和标题作为文件名
      filename = `[${torrent.site}] ${torrent.title}.torrent`;
    }

    await sendMessage("downloadFile", { url: torrentUrl, filename, conflictAction: "uniquify" });
    await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "completed" });
    URL.revokeObjectURL(torrentUrl);
  } catch (e) {
    await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "failed" });
  }

  return downloadId;
});

onMessage("downloadTorrentToDownloader", async ({ data: { torrent, downloaderId, addTorrentOptions } }) => {
  log("downloadTorrentToDownloader.Init", torrent, downloaderId, addTorrentOptions);

  const downloadHistory = buildDownloadHistory(torrent, downloaderId);
  const downloadId = await setDownloadHistory(downloadHistory);

  const site = await getSiteInstance<"public">(torrent.site);
  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);

  const downloaderConfig = await sendMessage("getDownloaderConfig", downloaderId);
  if (downloaderConfig.id && downloaderConfig.enabled) {
    const downloaderInstance = await getDownloader(downloaderConfig);
    if (addTorrentOptions.localDownload !== false) {
      addTorrentOptions.localDownloadOption = downloadRequestConfig;
    }

    await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "downloading" });
    try {
      log("downloadTorrentToDownloader", downloadRequestConfig, addTorrentOptions);
      await downloaderInstance.addTorrent(downloadRequestConfig.url!, addTorrentOptions);
      await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "completed" });
    } catch (e) {
      await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "failed" });
    }
  } else {
    await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "failed" });
  }

  return downloadId;
});

onMessage("getSocialInformation", async ({ data: { site, sid } }) => {
  return await getSocialInformation(site, sid);
});

onMessage("getDownloadHistory", async () => {
  return await getDownloadHistory();
});

onMessage("getDownloadHistoryById", async ({ data: downloadId }) => {
  return (await getDownloadHistoryById(downloadId))!;
});

if (import.meta.env.DEV) {
  // @ts-ignore
  globalThis.sendMessage = sendMessage;
}
