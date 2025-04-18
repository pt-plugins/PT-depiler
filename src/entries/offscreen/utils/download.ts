import axios from "axios";
import { stringify } from "urlencode";
import { isEmpty } from "es-toolkit/compat";
import { CAddTorrentOptions, getDownloader, getRemoteTorrentFile } from "@ptd/downloader";
import type { ITorrent } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import { getSiteInstance } from "@/shared/adapters/site.ts";
import { setDownloadHistory } from "@/shared/storages/indexdb.ts";
import type { ITorrentDownloadMetadata } from "@/shared/storages/types/indexdb.ts";
import type { ISearchResultTorrent } from "@/shared/storages/types/runtime.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/storages/types/config.ts";

import { log } from "~/helper.ts";

onMessage("getTorrentDownloadLink", async ({ data: torrent }) => {
  const site = await getSiteInstance<"public">(torrent.site);
  return await site.getTorrentDownloadLink(torrent);
});

function buildDownloadHistory(
  torrent: ITorrent,
  downloaderId: string = "local",
  addTorrentOptions: CAddTorrentOptions = {} as CAddTorrentOptions,
): ITorrentDownloadMetadata {
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
    addTorrentOptions,
    torrent: torrent as ISearchResultTorrent,
  };
}

onMessage("downloadTorrentToLocalFile", async ({ data: { torrent, localDownloadMethod } }) => {
  const downloadHistory = buildDownloadHistory(torrent);
  const downloadId = await setDownloadHistory(downloadHistory);

  const site = await getSiteInstance<"public">(torrent.site);
  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);

  if (!localDownloadMethod) {
    const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
    localDownloadMethod = configStoreRaw?.download?.localDownloadMethod ?? "web";
  }

  const downloadUri = axios.getUri(downloadRequestConfig); // 组装 baseURL, url, params
  const {
    method: downloadMethod = "GET",
    data: downloadData = {},
    headers: downloadHeaders = {} as Record<string, string>,
  } = downloadRequestConfig;

  await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "downloading" });

  // 如果设置为 web 方法，且没有 headers 的情况，直接使用 window.open 方法
  if (localDownloadMethod === "web") {
    if (downloadMethod.toUpperCase() === "GET" && isEmpty(downloadHeaders)) {
      log("downloadTorrentToLocalFile.web", downloadUri);
      window.open(downloadUri, "_blank");
      await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "completed" });
      return downloadId;
    } else {
      localDownloadMethod = "extension"; // 如果是不能直接使用 window.open 方法的情况，直接使用 extension 方法
    }
  }

  // 如果设置为 extension，直接使用 chrome.downloads 方法
  if (localDownloadMethod === "browser" && ["GET", "POST"].includes(downloadMethod.toUpperCase())) {
    try {
      // 将 AxiosRequestConfig 转换为 chrome.downloads.DownloadOptions， 我们在这里只考虑 method, body, headers
      const downloadOptions: chrome.downloads.DownloadOptions = {
        url: downloadUri,
        conflictAction: "uniquify",
        method: downloadMethod.toUpperCase() as "GET" | "POST",
      };

      if (downloadMethod.toUpperCase() === "POST" && !isEmpty(downloadData ?? {})) {
        downloadOptions.body = stringify(downloadData);
      }

      if (!isEmpty(downloadHeaders)) {
        downloadOptions.headers = Object.entries(downloadHeaders).map(([name, value]) => ({ name, value }));
      }

      log("downloadTorrentToLocalFile.browser", downloadOptions);
      await sendMessage("downloadFile", downloadOptions);
      await setDownloadHistory({ ...downloadHistory, id: downloadId, downloadStatus: "completed" });
      return downloadId;
    } catch (e) {
      localDownloadMethod = "extension"; // 如果下载失败，直接使用 extension 方法（怎么可能？）
    }
  } else {
    localDownloadMethod = "extension"; // 如果还是不能使用的情况（怎么可能？），则直接使用 extension 方法
  }

  // 如果设置为 extension，其次考虑使用 getRemoteTorrentFile 转为 Blob 再调用 chrome.downloads
  if (localDownloadMethod === "extension") {
    try {
      log("downloadTorrentToLocalFile.extension", downloadRequestConfig);
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
  }

  return downloadId;
});

onMessage("downloadTorrentToDownloader", async ({ data: { torrent, downloaderId, addTorrentOptions } }) => {
  log("downloadTorrentToDownloader.Init", torrent, downloaderId, addTorrentOptions);

  const downloadHistory = buildDownloadHistory(torrent, downloaderId, addTorrentOptions);
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
