import { IBackupConfig, IBackupData, IBackupFileInfo, IBackupFileListOption } from "./type.ts";
import { backupDataToJSZipBlob, decryptData, encryptData, jsZipBlobToBackupData } from "./utils.ts";

export default abstract class AbstractBackupServer<T extends IBackupConfig> {
  protected abstract version: string;

  protected config: T;
  protected _encryptionKey?: string;

  protected constructor(config: T) {
    this.config = config;
  }

  get userConfig(): T["config"] {
    return this.config.config;
  }

  // 默认情况下，我们使用 外部设置的加密密钥， subclass 可以覆写 从而使用 userConfig 等其他地方的值
  get encryptionKey() {
    return this._encryptionKey;
  }

  public setEncryptionKey(key: string): void {
    this._encryptionKey = key;
  }

  /**
   * 验证服务器可用性
   */
  public abstract ping(): Promise<boolean>;

  /**
   * 获取资源列表
   * @param options
   */
  public abstract list(options?: IBackupFileListOption): Promise<IBackupFileInfo[]>;

  public abstract addFile(fileName: string, file: IBackupData): Promise<boolean>;

  /**
   * 获取（下载）一个文件
   * @param path
   * @returns 返回一个 binary 数据
   */
  public abstract getFile(path: string): Promise<IBackupData>;

  public abstract deleteFile(path: string): Promise<boolean>;

  protected encryptData(data: any): string {
    return encryptData(data, this.encryptionKey);
  }

  protected decryptData<T = any>(data: string): T {
    return decryptData(data, this.encryptionKey);
  }

  protected async backupDataToJSZipBlob(data: IBackupData): Promise<Blob> {
    return await backupDataToJSZipBlob(data, this.encryptionKey);
  }

  protected async jsZipBlobToBackupData(blob: Blob): Promise<IBackupData> {
    return await jsZipBlobToBackupData(blob, this.encryptionKey);
  }
}
