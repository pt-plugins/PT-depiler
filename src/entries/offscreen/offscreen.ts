import { getSiteInstance } from "../shared/adapters/site.ts";
import { onMessage, sendMessage } from "@/messages.ts";
import { getDownloader, getRemoteTorrentFile } from "@ptd/downloader";
import { EResultParseStatus, type IUserInfo } from "@ptd/site";
import { IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";
import { log } from "~/helper.ts";

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  const site = await getSiteInstance<"public">(siteId);
  return await site.getSearchResult(keyword, searchEntry);
});

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => {
  const site = await getSiteInstance<"private">(siteId);

  // 获取历史信息
  const metadataStoreRaw = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  let lastUserInfo = metadataStoreRaw?.lastUserInfo?.[siteId as string] ?? {};
  if ((lastUserInfo as IUserInfo).status !== EResultParseStatus.success) {
    lastUserInfo = {} as IUserInfo;
  }

  let userInfo = await site.getUserInfoResult(lastUserInfo);
  await sendMessage("setSiteLastUserInfo", userInfo as IUserInfo);
  return userInfo;
});

onMessage("getTorrentDownloadLink", async ({ data: torrent }) => {
  const site = await getSiteInstance<"public">(torrent.site);
  return await site.getTorrentDownloadLink(torrent);
});

onMessage("downloadTorrentFile", async ({ data: torrent }) => {
  const site = await getSiteInstance<"public">(torrent.site);
  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);
  const torrentInstance = await getRemoteTorrentFile(downloadRequestConfig);

  const torrentUrl = URL.createObjectURL(torrentInstance.metadata.blob());
  let filename = torrentInstance.name;
  if (filename === "1.torrent") {
    // 如果文件名是缺省的 1.torrent，那么使用种子属性中的站点名和标题作为文件名
    filename = `[${torrent.site}] ${torrent.title}.torrent`;
  }

  const downloadId = await sendMessage("downloadFile", { url: torrentUrl, filename, conflictAction: "uniquify" });
  URL.revokeObjectURL(torrentUrl);
  return downloadId;
});

onMessage("sendTorrentToDownloader", async ({ data: { torrent, downloaderId, addTorrentOptions } }) => {
  log("sendTorrentToDownloader.Init", torrent, downloaderId, addTorrentOptions);
  const site = await getSiteInstance<"public">(torrent.site);
  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);

  const downloaderConfig = await sendMessage("getDownloaderConfig", downloaderId);
  if (downloaderConfig.id && downloaderConfig.enabled) {
    const downloaderInstance = await getDownloader(downloaderConfig);
    if (addTorrentOptions.localDownload !== false) {
      addTorrentOptions.localDownloadOption = downloadRequestConfig;
    }

    log("sendTorrentToDownloader", downloadRequestConfig, addTorrentOptions);
    await downloaderInstance.addTorrent(downloadRequestConfig.url!, addTorrentOptions);
  }
});

if (import.meta.env.DEV) {
  // @ts-ignore
  globalThis.sendMessage = sendMessage;
}
