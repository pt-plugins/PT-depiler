import axios, { type AxiosRequestConfig } from "axios";
import { stringify } from "urlencode";
import { isEmpty } from "es-toolkit/compat";
import { type CAddTorrentOptions, getDownloader, getRemoteTorrentFile } from "@ptd/downloader";
import type { ITorrent } from "@ptd/site";

import { IDownloadTorrentResult, onMessage, sendMessage } from "@/messages.ts";
import {
  IConfigPiniaStorageSchema,
  ISearchResultTorrent,
  ITorrentDownloadMetadata,
  TTorrentDownloadKey,
  IDownloaderMetadata,
  IMetadataPiniaStorageSchema,
  TTorrentDownloadStatus,
} from "@/shared/types.ts";

import { getSiteInstance } from "./site.ts";
import { logger } from "./logger.ts";
import { ptdIndexDb } from "../adapter/indexdb.ts";
import { toMerged } from "es-toolkit";

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
  torrent: Partial<ITorrent>,
  downloaderId: string = "local",
  addTorrentOptions: CAddTorrentOptions = {} as CAddTorrentOptions,
): ITorrentDownloadMetadata {
  return {
    siteId: torrent.site ?? "unknown",
    torrentId: torrent.id ?? "unknown",
    downloaderId,
    title: torrent.title ?? "unknown",
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

async function isAllowedSaveDownloadHistory(): Promise<boolean> {
  const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
  return configStoreRaw.download.saveDownloadHistory ?? true;
}

onMessage("downloadTorrentToLocalFile", async ({ data: { torrent, localDownloadMethod, downloadId } }) => {
  const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;

  // 设置默认的本地下载方法
  localDownloadMethod ??= configStoreRaw?.download?.localDownloadMethod ?? "web";

  // 设置下载记录情况
  if (typeof downloadId === "undefined") {
    const downloadHistory = buildDownloadHistory(torrent);
    downloadId = await setDownloadHistory(downloadHistory);
  }
  let downloadStatus = await setDownloadStatus(downloadId, "pending");

  let downloadRequestConfig: AxiosRequestConfig = { url: torrent.link, method: "GET", timeout: 30e3 };
  if (torrent.site) {
    // 生成站点，并检查站点下载间隔，如果触及到站点下载间隔，则将下载任务放入到 alarms 中等待
    const site = await getSiteInstance<"public">(torrent.site);
    if (site.downloadInterval > 0) {
      if (new Date().getTime() - (lastSiteDownloadAt.get(torrent.site) ?? 0) < site.downloadInterval * 1000) {
        logger({ msg: `Site ${torrent.site} download interval not reached, waiting...` });
        sendMessage("reDownloadTorrentToLocalFile", { torrent, localDownloadMethod, downloadId }).catch();
        return { downloadId, downloadStatus: await setDownloadStatus(downloadId, "pending") } as IDownloadTorrentResult;
      }
    }

    lastSiteDownloadAt.set(torrent.site, new Date().getTime());
    downloadRequestConfig = toMerged(
      downloadRequestConfig,
      await site.getTorrentDownloadRequestConfig(torrent as ITorrent),
    );
  }

  const downloadUri = axios.getUri(downloadRequestConfig); // 组装 baseURL, url, params
  const {
    method: downloadMethod = "GET",
    data: downloadData = {},
    headers: downloadHeaders = {} as Record<string, string>,
  } = downloadRequestConfig;

  // 如果设置为 web 方法，且没有 headers 的情况，直接使用 window.open 方法
  if (localDownloadMethod === "web") {
    if (downloadMethod.toUpperCase() === "GET" && isEmpty(downloadHeaders)) {
      logger({ msg: `Download torrent file with web method: ${downloadUri}` });
      window.open(downloadUri, "_blank");
      downloadStatus = await setDownloadStatus(downloadId, "completed");
      return { downloadId, downloadStatus };
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

      logger({ msg: `Download torrent file with browser method: ${downloadUri}`, data: downloadOptions });
      await sendMessage("downloadFile", downloadOptions);
      downloadStatus = await setDownloadStatus(downloadId, "completed");
      return { downloadId, downloadStatus };
    } catch (e) {
      localDownloadMethod = "extension"; // 如果下载失败，直接使用 extension 方法（怎么可能？）
    }
  } else {
    localDownloadMethod = "extension"; // 如果还是不能使用的情况（怎么可能？），则直接使用 extension 方法
  }

  // 如果设置为 extension，其次考虑使用 getRemoteTorrentFile 转为 Blob 再调用 chrome.downloads
  if (localDownloadMethod === "extension") {
    try {
      logger({ msg: `Download torrent file with extension method: ${downloadUri}`, data: downloadRequestConfig });

      const torrentInstance = await getRemoteTorrentFile(downloadRequestConfig);
      const torrentUrl = URL.createObjectURL(torrentInstance.metadata.blob());
      let filename = torrentInstance.name;
      if (filename === "1.torrent") {
        // 如果文件名是缺省的 1.torrent，那么使用种子属性中的站点名和标题作为文件名
        filename = `[${torrent.site}] ${torrent.title}.torrent`;
      }

      await sendMessage("downloadFile", { url: torrentUrl, filename, conflictAction: "uniquify" });
      downloadStatus = await setDownloadStatus(downloadId, "completed");
      URL.revokeObjectURL(torrentUrl);
    } catch (e) {
      downloadStatus = await setDownloadStatus(downloadId, "failed");
    }
  }

  return { downloadId, downloadStatus };
});

onMessage("downloadTorrentToDownloader", async ({ data: { torrent, downloaderId, addTorrentOptions, downloadId } }) => {
  const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;

  logger({ msg: "downloadTorrentToDownloader", data: { torrent, downloaderId, addTorrentOptions } });

  addTorrentOptions.localDownload ??= true; // 默认开启本地中转选项（如果传递进来的没有 localDownload 值的话）
  if (!(configStoreRaw?.download?.allowDirectSendToClient ?? false)) {
    addTorrentOptions.localDownload = true; // 如果不允许直接发送到下载器，则将本地中转选项强行设置为 true
  }

  if (typeof downloadId === "undefined") {
    const downloadHistory = buildDownloadHistory(torrent, downloaderId, addTorrentOptions);
    downloadId = await setDownloadHistory(downloadHistory);
  }
  let downloadStatus = await setDownloadStatus(downloadId, "pending");

  let downloadRequestConfig: AxiosRequestConfig = { url: torrent.link, method: "GET", timeout: 30e3 };
  let site: Awaited<ReturnType<typeof getSiteInstance<"public">>> | null = null;

  if (torrent.site) {
    // 生成站点，并检查站点下载间隔，如果触及到站点下载间隔，则将下载任务放入到 alarms 中等待
    site = await getSiteInstance<"public">(torrent.site);
    if (site.downloadInterval > 0) {
      if (new Date().getTime() - (lastSiteDownloadAt.get(torrent.site) ?? 0) < site.downloadInterval * 1000) {
        logger({ msg: `Site ${torrent.site} download interval not reached, waiting...` });
        sendMessage("reDownloadTorrentToDownloader", { torrent, downloaderId, addTorrentOptions, downloadId }).catch();
        return { downloadId, downloadStatus: await setDownloadStatus(downloadId, "pending") } as IDownloadTorrentResult;
      }
    }

    lastSiteDownloadAt.set(torrent.site, new Date().getTime());
    downloadRequestConfig = toMerged(
      downloadRequestConfig,
      await site.getTorrentDownloadRequestConfig(torrent as ITorrent),
    );
  }

  const downloaderConfig = await getDownloaderConfig(downloaderId);
  if (downloaderConfig.id && downloaderConfig.enabled) {
    const downloaderInstance = await getDownloader(downloaderConfig);
    if (addTorrentOptions.localDownload) {
      addTorrentOptions.localDownloadOption = downloadRequestConfig;
    }

    // 添加站点配置的上传速度限制
    if (site?.userConfig?.uploadSpeedLimit && site.userConfig.uploadSpeedLimit > 0) {
      addTorrentOptions.uploadSpeedLimit = site.userConfig.uploadSpeedLimit;
    }

    downloadStatus = await setDownloadStatus(downloadId, "downloading");
    try {
      logger({ msg: "downloadTorrentToDownloader", data: { torrent, downloadRequestConfig, addTorrentOptions } });
      const addStatus = await downloaderInstance.addTorrent(downloadRequestConfig.url!, addTorrentOptions);
      if (!addStatus) {
        logger({ msg: "Failed to add torrent to downloader", data: { torrent, downloaderId, addTorrentOptions } });
        downloadStatus = await setDownloadStatus(downloadId, "failed");
      } else {
        logger({ msg: "Successfully added torrent to downloader", data: { torrent, downloaderId, addTorrentOptions } });
        downloadStatus = await setDownloadStatus(downloadId, "completed");
      }
    } catch (e) {
      logger({ msg: "Error adding torrent to downloader", data: { torrent, downloaderId, addTorrentOptions } });
      downloadStatus = await setDownloadStatus(downloadId, "failed");
    }
  } else {
    downloadStatus = await setDownloadStatus(downloadId, "failed");
  }

  return { downloadId: downloadId, downloadStatus } as IDownloadTorrentResult;
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
  const allowedSave = await isAllowedSaveDownloadHistory();
  return allowedSave ? await (await ptdIndexDb).put("download_history", data) : 0;
}

export async function patchDownloadHistory(downloadId: TTorrentDownloadKey, data: Partial<ITorrentDownloadMetadata>) {
  const allowedSave = await isAllowedSaveDownloadHistory();
  const downloadHistory = await getDownloadHistoryById(downloadId);
  if (allowedSave && downloadHistory) {
    await setDownloadHistory({ ...downloadHistory, ...data });
  }
}

async function setDownloadStatus(
  downloadId: TTorrentDownloadKey,
  downloadStatus: TTorrentDownloadStatus,
): Promise<TTorrentDownloadStatus> {
  await patchDownloadHistory(downloadId, { downloadStatus }).catch();
  return downloadStatus;
}

export async function deleteDownloadHistoryById(downloadId: TTorrentDownloadKey) {
  return await (await ptdIndexDb).delete("download_history", downloadId);
}

onMessage("deleteDownloadHistoryById", async ({ data: downloadId }) => await deleteDownloadHistoryById(downloadId));

export async function clearDownloadHistory() {
  return await (await ptdIndexDb).clear("download_history");
}

onMessage("clearDownloadHistory", clearDownloadHistory);
