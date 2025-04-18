import { onMessage } from "@/messages.ts";
import {
  clearDownloadHistory,
  deleteDownloadHistoryById,
  getDownloadHistory,
  getDownloadHistoryById,
  getSocialInformation,
} from "@/shared/storages/indexdb.ts";

onMessage("getSocialInformation", async ({ data: { site, sid } }) => {
  return await getSocialInformation(site, sid);
});

onMessage("getDownloadHistory", async () => {
  return await getDownloadHistory();
});

onMessage("getDownloadHistoryById", async ({ data: downloadId }) => {
  return (await getDownloadHistoryById(downloadId))!;
});

onMessage("clearDownloadHistory", async () => {
  return await clearDownloadHistory();
});

onMessage("deleteDownloadHistoryById", async ({ data: downloadId }) => {
  return await deleteDownloadHistoryById(downloadId);
});
