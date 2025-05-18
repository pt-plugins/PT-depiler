import JSZip from "jszip";
import CryptoJS from "crypto-js";
import { EListOrderBy, EListOrderMode } from "./type";
import type { IBackupData, IBackupFileInfo, IBackupFileListOption, IBackupFileManifest } from "./type";

/**
 * 注意，我们不直接使用用户提供的 secretKey 作为 AES 的密钥，因为可能无法提供足够强度的密钥
 */
export function encryptData(data: any, encryptionKey?: string): string {
  const stringifyData = JSON.stringify(data);
  if (!encryptionKey) {
    return stringifyData;
  }
  const the_key = CryptoJS.MD5(encryptionKey).toString().substring(0, 16);
  return CryptoJS.AES.encrypt(stringifyData, the_key).toString();
}

export function decryptData<T = any>(data: string, encryptionKey?: string): T {
  if (!encryptionKey) {
    return JSON.parse(data);
  }
  const the_key = CryptoJS.MD5(encryptionKey).toString().substring(0, 16);
  const decrypted = CryptoJS.AES.decrypt(data, the_key).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted) as T;
}

export async function backupDataToJSZipBlob(data: IBackupData, encryptionKey?: string): Promise<Blob> {
  const zip = new JSZip();

  const manifest = {
    ...(data.manifest ?? {}),
    encryption: typeof encryptionKey === "string" && encryptionKey !== "",
    time: new Date().getTime(),
    files: {},
  } as IBackupFileManifest;

  for (const [key, value] of Object.entries(data)) {
    const fileName = `${key}.json`;
    const fileContent = encryptData(value, encryptionKey);
    zip.file(fileName, fileContent);
    manifest.files[key] = { name: fileName, hash: CryptoJS.MD5(fileContent).toString() };
  }

  zip.file("manifest.json", JSON.stringify(manifest));

  return await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
}

export async function jsZipBlobToBackupData(blob: Blob, encryptionKey?: string): Promise<IBackupData> {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(blob);
  const data = {} as IBackupData;

  // 首先解出 manifest.json 的内容
  const manifest = await zipContent
    .file("manifest.json")
    ?.async("string")
    .then((content) => {
      return JSON.parse(content) as IBackupFileManifest;
    });

  if (manifest?.files) {
    if (!manifest.encryption && encryptionKey) {
      encryptionKey = "";
    }

    // 只解出 manifest 中记录的文件
    for (const [fileKey, manifestFileData] of Object.entries(manifest.files ?? {})) {
      const { name: fileName, hash: manifestFileHash } = manifestFileData;
      const fileContent = await zipContent.file(fileName)?.async("string");
      if (fileContent) {
        const fileContentHash = CryptoJS.MD5(fileContent).toString();
        if (fileKey != "manifest" && fileContentHash !== manifestFileHash) {
          throw new Error(`File hash mismatch for ${fileName}.`);
        }

        try {
          data[fileKey] = decryptData(fileContent, encryptionKey);
        } catch (e) {
          throw new Error(`Failed to decrypt file.`);
        }
      }
    }
  } else {
    throw new Error("Manifest not found in the zip file");
  }

  return data;
}

export function localSort(files: IBackupFileInfo[], options: IBackupFileListOption): IBackupFileInfo[] {
  if (files.length > 0 && Object.keys(options).length > 0) {
    const orderMode: EListOrderMode = options.orderMode ?? EListOrderMode.desc;
    const orderBy: EListOrderBy = options.orderBy ?? EListOrderBy.time;

    files.sort((a, b) => {
      let v1, v2;
      switch (orderBy) {
        case EListOrderBy.name:
          v1 = a.filename;
          v2 = b.filename;
          break;
        case EListOrderBy.size:
          v1 = a.size;
          v2 = b.size;
          break;

        case EListOrderBy.time:
        default:
          v1 = a.time;
          v2 = b.time;
          break;
      }

      const compareRep = v1.toString().localeCompare(v2.toString());
      return orderMode === EListOrderMode.desc ? -compareRep : compareRep;
    });
  }

  return files;
}
