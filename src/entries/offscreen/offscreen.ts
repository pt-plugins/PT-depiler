import { getSiteInstance } from "../shared/adapters/site.ts";
import { onMessage, sendMessage } from "@/messages.ts";
import { getRemoteTorrentFile } from "@ptd/downloader";
import { ITorrent } from "@ptd/site";

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  const site = await getSiteInstance<"public">(siteId);
  return await site.getSearchResult(keyword, searchEntry);
});

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => {
  const site = await getSiteInstance<"private">(siteId);
  return await site.getUserInfoResult();
});

onMessage("getTorrentDownloadLink", async ({ data: torrent }) => {
  const site = await getSiteInstance<"public">(torrent.site);
  return await site.getTorrentDownloadLink(torrent);
});

async function getTorrentInstance(torrent: ITorrent) {
  const site = await getSiteInstance<"public">(torrent.site);
  const downloadRequestConfig = await site.getTorrentDownloadRequestConfig(torrent);
  return await getRemoteTorrentFile(downloadRequestConfig);
}

onMessage("downloadTorrentFile", async ({ data: torrent }) => {
  const torrentInstance = await getTorrentInstance(torrent);
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

if (import.meta.env.DEV) {
  // @ts-ignore
  globalThis.sendMessage = sendMessage;
}
