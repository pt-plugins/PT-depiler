import JSZip from "jszip";
import CryptoJS from "crypto-js";
import { IBackupConfig, IBackupData, IBackupFileInfo, IBackupFileListOption } from "./type.ts";

interface IBackupFileManifest {
  encryption: boolean;
  version: string;
  time: number;
  fileHash: Record<string, string>;
}

export default abstract class AbstractBackupServer<T extends IBackupConfig> {
  protected abstract version: string;

  protected config: T;
  protected encryptionKey?: string;

  protected constructor(config: T) {
    this.config = config;
  }

  get userConfig(): T["config"] {
    return this.config.config;
  }

  public setEncryptionKey(key: string): void {
    this.encryptionKey = key;
  }

  /**
   * 验证服务器可用性
   */
  public abstract ping(): Promise<boolean>;

  /**
   * 获取资源列表
   * @param options
   */
  public abstract list(options: IBackupFileListOption): Promise<IBackupFileInfo[]>;

  public abstract addFile(fileName: string, file: IBackupData): Promise<boolean>;

  /**
   * 获取（下载）一个文件
   * @param path
   * @returns 返回一个 binary 数据
   */
  public abstract getFile(path: string): Promise<IBackupData>;

  public abstract deleteFile(path: string): Promise<boolean>;

  /**
   * 注意，我们不直接使用用户提供的 secretKey 作为 AES 的密钥，因为可能无法提供足够强度的密钥
   */
  private encryptData(data: any): string {
    if (!this.encryptionKey) {
      return JSON.stringify(data);
    }
    const the_key = CryptoJS.MD5(this.encryptionKey).toString().substring(0, 16);
    return CryptoJS.AES.encrypt(data, the_key).toString();
  }

  private decryptData<T = any>(data: string): T {
    if (!this.encryptionKey) {
      return JSON.parse(data);
    }
    const the_key = CryptoJS.MD5(this.encryptionKey).toString().substring(0, 16);
    const decrypted = CryptoJS.AES.decrypt(data, the_key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  }

  protected async backupDataToJSZipBlob(data: IBackupData): Promise<Blob> {
    const zip = new JSZip();

    const createdAt = new Date().getTime();
    const manifest: IBackupFileManifest = {
      encryption: this.encryptionKey !== "",
      version: `${this.config.type} (${this.version})`,
      time: createdAt,
      fileHash: {},
    };

    for (const [key, value] of Object.entries(data)) {
      const fileName = `${key}.json`;
      const fileContent = this.encryptData(value);
      zip.file(fileName, fileContent);
      manifest.fileHash[key] = CryptoJS.MD5(fileContent).toString();
    }

    zip.file("manifest.json", JSON.stringify(manifest));

    return await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
  }

  protected async jsZipBlobToBackupData(blob: Blob): Promise<IBackupData> {
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

    if (manifest) {
      for (const fileName of Object.keys(zipContent.files)) {
        if (fileName !== "manifest.json" && fileName.endsWith(".json")) {
          const fileContent = await zipContent.file(fileName)?.async("string");
          if (fileContent) {
            const key = fileName.replace(/\.json$/, "");
            const fileContentHash = CryptoJS.MD5(fileContent).toString();
            if (fileContentHash !== manifest.fileHash?.[key]) {
              throw new Error(`File hash mismatch for ${fileName}.`);
            }
            data[key] = this.decryptData(fileContent);
          }
        }
      }
    } else {
      throw new Error("Manifest not found in the zip file");
    }

    return data;
  }
}
