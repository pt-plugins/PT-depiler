import { intersection, isEqual, toMerged } from "es-toolkit";
import { formatDate } from "date-fns";
import { getBackupServer, IBackupData, IBackupFileInfo } from "@ptd/backupServer";
import { backupDataToZipBlob, hasBackupRetentionToApply, pruneBackupFiles } from "@ptd/backupServer/utils.ts";
import AbstractBackupServer from "@ptd/backupServer/AbstractBackupServer.ts";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IExtensionStorageSchema, TExtensionStorageKey } from "@/storage.ts";
import type {
  IRestoreOptions,
  IMetadataPiniaStorageSchema,
  TBackupFields,
  TBackupServerKey,
  IConfigPiniaStorageSchema,
  TUserInfoStorageSchema,
} from "@/shared/types.ts";

import { logger } from "./logger.ts";
import { ptdIndexDb } from "../adapter/indexdb.ts";

export const storageKey = [
  "config",
  "metadata",
  "userInfo",
  "searchResultSnapshot",
  "keepUploadTask",
] as TExtensionStorageKey[];

export async function createBackupData(backupFields: TBackupFields[] = []): Promise<IBackupData> {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;

  const backupData: IBackupData = {};

  // 备份已添加站点的Cookie
  if (backupFields.includes("cookies")) {
    const cookies = {} as Required<IBackupData>["cookies"];
    for (const siteHost in metadataStore.siteHostMap) {
      const siteHostCookies = await sendMessage("getAllCookies", { domain: siteHost });
      if (siteHostCookies.length > 0) {
        cookies[siteHost] = siteHostCookies;
      }
    }
    backupData.cookies = cookies;
  }

  // 处理直接从 chrome.storage.local 读取的字段
  for (const field of storageKey) {
    if (backupFields.includes(field as TBackupFields)) {
      backupData[field] = await sendMessage("getExtStorage", field);
    }
  }

  // 备份下载历史
  if (backupFields.includes("downloadHistory")) {
    backupData["downloadHistory"] = await (await ptdIndexDb).getAll("download_history");
  }

  backupData.manifest = {
    time: new Date().getTime(),
    version: `PT-Depiler (${__EXT_VERSION__})`,
  };

  logger({
    msg: `A Backup data created at ${formatDate(backupData.manifest.time!, "yyyy-MM-dd HH:mm:ss")}`,
    data: Object.keys(backupData),
  });
  return backupData;
}

export async function getBackupServerInstance(backupServerId: TBackupServerKey): Promise<AbstractBackupServer<any>> {
  logger({ msg: `Get backup server instance for ID: ${backupServerId}` });
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  const backupServerConfig = metadataStore.backupServers[backupServerId];
  return await getBackupServer(backupServerConfig);
}

/**
 * 依据备份服务器的保留策略清理历史备份文件
 *
 * - `keepFilename`：本次刚刚上传的备份文件名，永远不会被清理（避免因服务器端 `list()` 结果滞后或时钟偏差而删除刚创建的备份）
 * - 注意：`list()` 返回的备份列表可能包含非本插件创建的文件，因此我们仅处理文件名符合
 *   `PTD_backup_yyyyMMddTHHmm.zip` 规则的文件，避免误删用户的其他数据。
 */
export async function applyBackupRetention(
  backupServerId: TBackupServerKey,
  keepFilename?: string,
): Promise<IBackupFileInfo[]> {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  const retention = metadataStore.backupServers[backupServerId]?.retention;

  if (!hasBackupRetentionToApply(retention)) {
    return [];
  }

  const backupServerInstance = await getBackupServerInstance(backupServerId);
  const list = (await backupServerInstance.list()) ?? [];

  const backupFiles = list
    .filter((item) => /^PTD_backup_\d{16}\.zip$/.test(item.filename))
    .sort((a, b) => b.time - a.time); // 按备份时间从新到旧排序
  const [deletedFiles] = pruneBackupFiles(
    backupFiles.filter((item) => item.filename !== keepFilename),
    retention,
  );

  const actuallyDeletedFiles: IBackupFileInfo[] = [];
  for (const file of deletedFiles) {
    try {
      if (await backupServerInstance.deleteFile(file.path)) {
        actuallyDeletedFiles.push(file);
      }
    } catch (e) {
      logger({
        msg: `Failed to delete expired backup [${file.filename}] of [${backupServerId}]: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  if (actuallyDeletedFiles.length > 0) {
    logger({
      msg: `Retention policy removed ${actuallyDeletedFiles.length} of ${backupFiles.length} backup(s) of [${backupServerId}]`,
      data: { deleted: actuallyDeletedFiles.map((item) => item.filename) },
    });
  }

  return actuallyDeletedFiles;
}

onMessage("applyBackupRetention", async ({ data: { backupServerId, keepFilename } }) => {
  return await applyBackupRetention(backupServerId, keepFilename);
});

export async function exportBackupData(
  backupServerId: string | "local",
  backupFields: TBackupFields[] = [],
): Promise<boolean> {
  const backupData = await createBackupData(backupFields);
  const backupFilename = `PTD_backup_${formatDate(new Date(), "yyyyMMdd'T'HHmm")}.zip`;

  const configStore = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
  const encryptionKey = configStore?.backup?.encryptionKey ?? "";

  logger({ msg: `Exporting backup data to ${backupServerId}`, data: { backupFields, backupFilename } });
  if (backupServerId === "local") {
    const zipBlob = await backupDataToZipBlob(backupData, encryptionKey);
    const blobUrl = URL.createObjectURL(zipBlob);
    await sendMessage("downloadFile", { url: blobUrl, filename: backupFilename, conflictAction: "uniquify" });
    return true;
  } else {
    const backupServerInstance = await getBackupServerInstance(backupServerId);
    backupServerInstance.setEncryptionKey(encryptionKey);
    const backupStatus = await backupServerInstance.addFile(backupFilename, backupData);

    // 更新最后一次备份时间
    if (backupStatus) {
      const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
      metadataStore.backupServers[backupServerId].lastBackupAt = new Date().getTime();
      await sendMessage("setExtStorage", { key: "metadata", value: metadataStore });

      // 备份成功后，按照保留策略清理历史备份
      await applyBackupRetention(backupServerId, backupFilename).catch((e) => {
        logger({
          msg: `Failed to apply the backup retention policy of [${backupServerId}]: ${e instanceof Error ? e.message : String(e)}`,
        });
      });
    }

    return backupStatus;
  }
}

onMessage("exportBackupData", async ({ data: { backupServerId, backupFields } }) => {
  return await exportBackupData(backupServerId, backupFields);
});

export async function restoreBackupData(
  restoreData: IBackupData, // 已经解密了的数据
  restoreOptions: IRestoreOptions = {},
): Promise<boolean> {
  const { fields = [], expandCookieMinutes = -1, keepExistUserInfo = true } = restoreOptions;

  const restoreDataExistFields = Object.keys(restoreData.manifest?.files ?? {});
  const restoreFields = intersection(fields, restoreDataExistFields);

  // 恢复下载历史
  if (restoreFields.includes("downloadHistory")) {
    const db = await ptdIndexDb;
    await db.clear("download_history");
    for (const downloadHistoryElement of restoreData.downloadHistory) {
      await db.put("download_history", downloadHistoryElement);
    }
  }

  // 恢复直接从 chrome.storage.local 读取的字段
  for (const field of storageKey.toReversed()) {
    if (restoreFields.includes(field as TBackupFields)) {
      let fieldData = restoreData[field] as IExtensionStorageSchema[typeof field];
      if (fieldData) {
        if (field === "userInfo" && keepExistUserInfo) {
          const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
          fieldData = toMerged(fieldData, userInfoStore);
        }

        /**
         * 备份服务器的ID为添加时随机生成的（nanoid），同一台服务器在新旧设备上会产生不同的ID，
         * 直接恢复会导致出现重复条目（refs: https://github.com/pt-plugins/PT-depiler/issues/1024）。
         * 此处按「类型 + 完整配置」识别同一台服务器：命中则复用本机已有条目的ID（保留备份中的其余字段），
         * 未命中的条目正常合入。
         */
        if (field === "metadata") {
          const restoredMetadata = fieldData as IMetadataPiniaStorageSchema;
          if (restoredMetadata?.backupServers) {
            const existingMetadata = ((await sendMessage("getExtStorage", "metadata")) ??
              {}) as IMetadataPiniaStorageSchema;
            const existingServers = existingMetadata.backupServers ?? {};
            const mergedServers: IMetadataPiniaStorageSchema["backupServers"] = { ...restoredMetadata.backupServers };

            for (const [existingId, existingServer] of Object.entries(existingServers)) {
              const duplicatedEntry = Object.entries(mergedServers).find(
                ([restoredId, restoredServer]) =>
                  restoredId !== existingId && // ID相同（如自定义ID或同设备重复恢复）无需处理，直接以本机为准覆盖
                  restoredServer.type === existingServer.type &&
                  isEqual(restoredServer.config, existingServer.config),
              );
              if (duplicatedEntry) {
                const [restoredId, restoredServer] = duplicatedEntry;
                mergedServers[existingId] = { ...restoredServer, id: existingId };
                delete mergedServers[restoredId];
              }
            }

            fieldData = { ...restoredMetadata, backupServers: mergedServers };
          }
        }

        await sendMessage("setExtStorage", { key: field, value: fieldData });
      }
    }
  }

  // 恢复已添加站点的Cookie
  if (restoreFields.includes("cookies")) {
    const now = new Date().getTime() / 1000;

    for (const cookieData of Object.values(restoreData.cookies!)) {
      for (const cookie of cookieData) {
        // 延长 cookie 过期时间
        if (expandCookieMinutes > 0) {
          cookie.expirationDate = Math.max(cookie.expirationDate ?? 0, now) + expandCookieMinutes * 60;
        }

        await sendMessage("setCookie", cookie as unknown as chrome.cookies.SetDetails);
      }
    }
  }

  return true;
}

onMessage("restoreBackupData", async ({ data: { restoreData, restoreOptions = {} } }) => {
  return await restoreBackupData(restoreData, restoreOptions);
});

export async function getBackupHistory(backupServerId: string): Promise<IBackupFileInfo[]> {
  const backupServerInstance = await getBackupServerInstance(backupServerId);
  return await backupServerInstance.list();
}

onMessage("getBackupHistory", async ({ data: backupServerId }) => {
  return await getBackupHistory(backupServerId);
});

export async function deleteBackupHistory(backupServerId: string, path: string): Promise<boolean> {
  const backupServerInstance = await getBackupServerInstance(backupServerId);
  return await backupServerInstance.deleteFile(path);
}

onMessage("deleteBackupHistory", async ({ data: { backupServerId, path } }) => {
  return await deleteBackupHistory(backupServerId, path);
});

export async function getRemoteBackupData(
  backupServerId: string,
  path: string,
  decryptKey: string = "",
): Promise<IBackupData> {
  const backupServerInstance = await getBackupServerInstance(backupServerId);
  backupServerInstance.setEncryptionKey(decryptKey);
  return await backupServerInstance.getFile(path);
}

onMessage("getRemoteBackupData", async ({ data: { backupServerId, path, decryptKey = "" } }) => {
  return await getRemoteBackupData(backupServerId, path, decryptKey);
});
