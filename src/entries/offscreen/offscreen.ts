import { getSiteInstance } from "../shared/adapters/site.ts";
import { onMessage, sendMessage } from "@/messages.ts";

onMessage("getSiteSearchResult", async ({ data: { siteId, keyword = "", searchEntry = {} } }) => {
  const site = await getSiteInstance<"public">(siteId);
  return await site.getSearchResult(keyword, searchEntry);
});

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => {
  const site = await getSiteInstance<"private">(siteId);
  return await site.getUserInfoResult();
});

onMessage("getTorrentDownloadLink", async ({ data: { siteId, torrent } }) => {
  const site = await getSiteInstance<"public">(siteId);
  return await site.getTorrentDownloadLink(torrent);
});

onMessage("downloadTorrentFile", async ({ data: { siteId, torrent } }) => {
  const site = await getSiteInstance<"public">(siteId);
  const downloadOptions = await site.getTorrentDownloadOptions(torrent);
  console.log("downloadTorrentFile", siteId, torrent, " with options: ", downloadOptions);
  return await sendMessage("downloadFile", downloadOptions);
});
