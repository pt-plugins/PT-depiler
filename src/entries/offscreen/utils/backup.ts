import { getBackupServer, IBackupData } from "@ptd/backupServer";
import { type IMetadataPiniaStorageSchema, TBackupFields } from "@/shared/storages/types/metadata.ts";
import { onMessage, sendMessage } from "@/messages.ts";
import { ptdIndexDb } from "@/offscreen/adapter/indexdb.ts";
import type { IConfigPiniaStorageSchema, TExtensionStorageKey } from "@/storage.ts";
import { backupDataToJSZipBlob } from "@ptd/backupServer/utils.ts";
import { formatDate } from "date-fns";

export async function createBackupData(backupFields: TBackupFields[] = []): Promise<IBackupData> {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;

  const backupData: IBackupData = {};

  // 备份已添加站点的Cookie
  if (backupFields.includes("cookies")) {
    const cookies = {} as Required<IBackupData>["cookies"];
    for (const siteHost in metadataStore.siteHostMap) {
      const siteHostCookies = await sendMessage("getCookiesByDomain", siteHost);
      if (siteHostCookies.length > 0) {
        cookies[siteHost] = siteHostCookies;
      }
    }
    backupData.cookies = cookies;
  }

  // 处理直接从 chrome.storage.local 读取的字段
  for (const field of ["config", "metadata", "userInfo", "searchResultSnapshot"]) {
    if (backupFields.includes(field as TBackupFields)) {
      backupData[field] = await sendMessage("getExtStorage", field as TExtensionStorageKey);
    }
  }

  // 备份下载历史
  if (backupFields.includes("downloadHistory")) {
    backupData["downloadHistory"] = await (await ptdIndexDb).getAll("download_history");
  }

  backupData.manifest = {
    time: new Date().getTime(),
    version: __EXT_VERSION__,
  };

  return backupData;
}

export async function exportBackupData(
  backupServerId: string | "local",
  backupFields: TBackupFields[] = [],
): Promise<boolean> {
  const backupData = await createBackupData(backupFields);
  const backupFilename = `PTD_backup_${formatDate(new Date(), "yyyyMMdd'T'HHmm")}.zip`;

  const configStore = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
  const encryptionKey = configStore?.backup?.encryptionKey ?? "";

  if (backupServerId === "local") {
    const jsZipBlob = await backupDataToJSZipBlob(backupData, encryptionKey);
    const blobUrl = URL.createObjectURL(jsZipBlob);
    await sendMessage("downloadFile", { url: blobUrl, filename: backupFilename, conflictAction: "uniquify" });
    return true;
  } else {
    const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
    const backupServerConfig = metadataStore.backupServers[backupServerId];
    const backupServerInstance = await getBackupServer(backupServerConfig);
    backupServerInstance.setEncryptionKey(encryptionKey);
    return await backupServerInstance.addFile(backupFilename, backupData);
  }
}

onMessage("exportBackupData", async ({ data: { backupServerId, backupFields } }) => {
  return await exportBackupData(backupServerId, backupFields);
});
