import axios from "axios";
import { stringify } from "urlencode";
import { isEmpty } from "es-toolkit/compat";
import pWaitFor from "p-wait-for";
import { type CAddTorrentOptions, getDownloader, getRemoteTorrentFile } from "@ptd/downloader";
import type { ITorrent } from "@ptd/site";

import { log } from "~/helper.ts";

import { onMessage, sendMessage } from "@/messages.ts";
import { getSiteInstance } from "./site.ts";
import { ptdIndexDb } from "../adapter/indexdb.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";
import type { ISearchResultTorrent } from "@/shared/storages/types/runtime.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/storages/types/config.ts";
import type { IDownloaderMetadata, IMetadataPiniaStorageSchema } from "@/storage.ts";

export async function getDownloaderConfig(downloaderId: string) {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  return metadataStore?.downloaders?.[downloaderId] ?? ({} as IDownloaderMetadata);
}

onMessage("getDownloaderConfig", async ({ data: downloaderId }) => await getDownloaderConfig(downloaderId));

export async function getTorrentDownloadLink(torrent: ITorrent) {
  const site = await getSiteInstance<"public">(torrent.site);
  return await site.getTorrentDownloadLink(torrent);
}

onMessage("getTorrentDownloadLink", async ({ data: torrent }) => await getTorrentDownloadLink(torrent));

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

const lastSiteDownloadAt = new Map<string, number>();

onMessage("downloadTorrentToLocalFile", async ({ data: { torrent, localDownloadMethod } }) => {
  if (!localDownloadMethod) {
    const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
    localDownloadMethod = configStoreRaw?.download?.localDownloadMethod ?? "web";
  }

  const downloadHistory = buildDownloadHistory(torrent);
  const downloadId = await setDownloadHistory(downloadHistory);

  const site = await getSiteInstance<"public">(torrent.site);
  if (site.downloadInterval > 0) {
    if (localDownloadMethod === "web") localDownloadMethod = "extension";
    await pWaitFor(
      () => new Date().getTime() - (lastSiteDownloadAt.get(torrent.site) ?? 0) > site.downloadInterval * 1000,
    );
    lastSiteDownloadAt.set(torrent.site, new Date().getTime());
  }

  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);

  const downloadUri = axios.getUri(downloadRequestConfig); // 组装 baseURL, url, params
  const {
    method: downloadMethod = "GET",
    data: downloadData = {},
    headers: downloadHeaders = {} as Record<string, string>,
  } = downloadRequestConfig;

  await patchDownloadHistory(downloadId, { downloadStatus: "downloading" });

  // 如果设置为 web 方法，且没有 headers 的情况，直接使用 window.open 方法
  if (localDownloadMethod === "web") {
    if (downloadMethod.toUpperCase() === "GET" && isEmpty(downloadHeaders)) {
      log("downloadTorrentToLocalFile.web", downloadUri);
      window.open(downloadUri, "_blank");
      await patchDownloadHistory(downloadId, { downloadStatus: "completed" });
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
      await patchDownloadHistory(downloadId, { downloadStatus: "completed" });
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
      await patchDownloadHistory(downloadId, { downloadStatus: "completed" });
      URL.revokeObjectURL(torrentUrl);
    } catch (e) {
      await patchDownloadHistory(downloadId, { downloadStatus: "failed" });
    }
  }

  return downloadId;
});

onMessage("downloadTorrentToDownloader", async ({ data: { torrent, downloaderId, addTorrentOptions } }) => {
  log("downloadTorrentToDownloader.Init", torrent, downloaderId, addTorrentOptions);

  const downloadHistory = buildDownloadHistory(torrent, downloaderId, addTorrentOptions);
  const downloadId = await setDownloadHistory(downloadHistory);

  const site = await getSiteInstance<"public">(torrent.site);
  if (site.downloadInterval > 0) {
    await pWaitFor(
      () => new Date().getTime() - (lastSiteDownloadAt.get(torrent.site) ?? 0) > site.downloadInterval * 1000,
    );
    lastSiteDownloadAt.set(torrent.site, new Date().getTime());
  }

  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);

  const downloaderConfig = await getDownloaderConfig(downloaderId);
  if (downloaderConfig.id && downloaderConfig.enabled) {
    const downloaderInstance = await getDownloader(downloaderConfig);
    if (addTorrentOptions.localDownload !== false) {
      addTorrentOptions.localDownloadOption = downloadRequestConfig;
    }

    await patchDownloadHistory(downloadId, { downloadStatus: "downloading" });
    try {
      log("downloadTorrentToDownloader", downloadRequestConfig, addTorrentOptions);
      await downloaderInstance.addTorrent(downloadRequestConfig.url!, addTorrentOptions);
      await patchDownloadHistory(downloadId, { downloadStatus: "completed" });
    } catch (e) {
      await patchDownloadHistory(downloadId, { downloadStatus: "failed" });
    }
  } else {
    await patchDownloadHistory(downloadId, { downloadStatus: "failed" });
  }

  return downloadId;
});

export async function getDownloadHistory() {
  return await (await ptdIndexDb).getAll("download_history");
}

onMessage("getDownloadHistory", getDownloadHistory);

export async function getDownloadHistoryById(downloadId: TTorrentDownloadKey) {
  return await (await ptdIndexDb).get("download_history", downloadId);
}

onMessage("getDownloadHistoryById", async ({ data: downloadId }) => (await getDownloadHistoryById(downloadId))!);

export async function setDownloadHistory(data: ITorrentDownloadMetadata) {
  return await (await ptdIndexDb).put("download_history", data);
}

export async function patchDownloadHistory(downloadId: TTorrentDownloadKey, data: Partial<ITorrentDownloadMetadata>) {
  const downloadHistory = await getDownloadHistoryById(downloadId);
  if (downloadHistory) {
    await setDownloadHistory({ ...downloadHistory, ...data });
  }
}

export async function deleteDownloadHistoryById(downloadId: TTorrentDownloadKey) {
  return await (await ptdIndexDb).delete("download_history", downloadId);
}

onMessage("deleteDownloadHistoryById", async ({ data: downloadId }) => await deleteDownloadHistoryById(downloadId));

export async function clearDownloadHistory() {
  return await (await ptdIndexDb).clear("download_history");
}

onMessage("clearDownloadHistory", clearDownloadHistory);
