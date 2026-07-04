/**
 * Backblaze B2 云存储备份服务器
 *
 * 使用前请先到 https://secure.backblaze.com/b2_buckets.htm 创建应用密钥和存储桶：
 * - 创建存储桶：选择 "私有" 权限
 * - 创建应用密钥：在 "App Keys" 页面点击 "Generate New Master Application Key"
 *   或 "Generate New Application Key"，建议限制访问刚创建的存储桶
 * - 记录 applicationKeyId 和 applicationKey
 */

import axios from "axios";

import AbstractBackupServer from "../AbstractBackupServer.ts";
import { localSort } from "../utils";
import type { IBackupConfig, IBackupMetadata, IBackupFileListOption, IBackupFileInfo, IBackupData } from "../type";

interface BackblazeB2Config extends IBackupConfig {
  config: {
    applicationKeyId: string;
    applicationKey: string;
    bucketName: string;
  };
}

export const serverConfig: BackblazeB2Config = {
  name: "Backblaze B2",
  type: "BackblazeB2",
  config: { applicationKeyId: "", applicationKey: "", bucketName: "" },
};

export const serverMetaData: IBackupMetadata<BackblazeB2Config> = {
  description: "Backblaze B2 是一个高性价比的云对象存储服务，提供安全可靠的云存储方案，适合用于备份各类数据。",
  requiredField: [
    { key: "applicationKeyId", name: "Application Key ID", type: "string" },
    { key: "applicationKey", name: "Application Key", type: "string" },
    { key: "bucketName", name: "Bucket 名称", type: "string" },
  ],
};

// ── B2 API 响应类型 ──────────────────────────────────────────────

interface B2AuthorizeAccountResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  accountId: string;
  allowed: {
    bucketId: string | null;
    bucketName: string | null;
    capabilities: string[];
  };
}

interface B2Bucket {
  bucketId: string;
  bucketName: string;
  bucketType: string;
}

interface B2ListBucketsResponse {
  buckets: B2Bucket[];
}

interface B2FileEntry {
  fileName: string;
  fileId: string;
  action: "upload" | "hide" | "folder" | "start";
  size: number;
  uploadTimestamp: number;
  contentMd5?: string;
}

interface B2ListFileNamesResponse {
  files: B2FileEntry[];
  nextFileName: string | null;
}

interface B2GetUploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}

interface B2DeleteFileResponse {
  fileId: string;
  fileName: string;
}

// ── 辅助函数 ─────────────────────────────────────────────────────

/**
 * 计算 ArrayBuffer 的 SHA1 十六进制字符串
 */
async function sha1Hex(data: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── 主类 ─────────────────────────────────────────────────────────

export default class BackblazeB2 extends AbstractBackupServer<BackblazeB2Config> {
  protected version = "2.0.0";

  /** 授权后获得的临时令牌 */
  private authToken?: string;
  /** B2 API 基础地址（含区域） */
  private apiUrl?: string;
  /** 下载 URL 基础地址 */
  private downloadUrl?: string;
  /** 账户 ID */
  private accountId?: string;
  /** 授权响应中的 allowed 信息 */
  private allowed?: B2AuthorizeAccountResponse["allowed"];
  /** 目标存储桶 ID（通过 bucketName 查询得到） */
  private bucketId?: string;

  // ── 授权与桶解析 ──────────────────────────────────────────────

  private async authorize(): Promise<void> {
    const { data } = await axios.get<B2AuthorizeAccountResponse>(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        auth: {
          username: this.userConfig.applicationKeyId,
          password: this.userConfig.applicationKey,
        },
      },
    );

    this.authToken = data.authorizationToken;
    this.apiUrl = data.apiUrl.replace(/\/$/, "");
    this.downloadUrl = data.downloadUrl.replace(/\/$/, "");
    this.accountId = data.accountId;
    this.allowed = data.allowed;
  }

  private async getBucketId(): Promise<string> {
    if (this.bucketId) return this.bucketId;

    if (!this.authToken) await this.authorize();

    const targetBucketName = this.userConfig.bucketName;

    // 如果 allowed.bucketName 与配置的 bucketName 一致，直接使用 allowed.bucketId，跳过 list_buckets
    const allowed = this.allowed;
    if (allowed?.bucketName === targetBucketName) {
      if (!allowed.bucketId) throw new Error(`Application key has no access to bucket "${targetBucketName}"`);
      this.bucketId = allowed.bucketId;
      return this.bucketId;
    }

    // allowed.bucketName === null 表示该 Key 拥有 full access，需要手动查找
    // 如果 allowed.bucketName 非 null 且不匹配，说明 Key 被限制到了其他 bucket，以下查找必然失败，但仍执行以给出明确错误
    const { data } = await axios.post<B2ListBucketsResponse>(
      `${this.apiUrl}/b2api/v2/b2_list_buckets`,
      { accountId: this.accountId },
      { headers: { Authorization: this.authToken } },
    );

    const bucket = data.buckets.find((b) => b.bucketName === targetBucketName);
    if (!bucket) {
      throw new Error(`Bucket "${targetBucketName}" not found`);
    }

    this.bucketId = bucket.bucketId;
    return this.bucketId;
  }

  /** 确保已授权（可安全重复调用） */
  private async ensureAuthorized(): Promise<void> {
    if (!this.authToken) await this.authorize();
  }

  // ── 抽象方法实现 ──────────────────────────────────────────────

  async ping(): Promise<boolean> {
    try {
      await this.authorize();
      await this.getBucketId();
      return true;
    } catch {
      return false;
    }
  }

  async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const bucketId = await this.getBucketId();
    const files: IBackupFileInfo[] = [];

    let startFileName: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const { data } = await axios.post<B2ListFileNamesResponse>(
        `${this.apiUrl}/b2api/v2/b2_list_file_names`,
        {
          bucketId,
          prefix: "",
          delimiter: undefined,
          maxFileCount: 1000,
          ...(startFileName ? { startFileName } : {}),
        },
        { headers: { Authorization: this.authToken } },
      );

      for (const entry of data.files) {
        if (entry.action !== "upload") continue;
        if (!entry.fileName.endsWith(".zip")) continue;

        files.push({
          filename: entry.fileName,
          path: entry.fileName,
          time: entry.uploadTimestamp,
          size: entry.size,
        });
      }

      hasMore = data.nextFileName != null;
      startFileName = data.nextFileName;
    }

    return localSort(files, options);
  }

  async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    const bucketId = await this.getBucketId();

    // Step 1: 获取上传 URL
    const { data: uploadData } = await axios.post<B2GetUploadUrlResponse>(
      `${this.apiUrl}/b2api/v2/b2_get_upload_url`,
      { bucketId },
      { headers: { Authorization: this.authToken } },
    );

    // Step 2: 构建 zip blob
    const fileBlob = await this.backupDataToJSZipBlob(file);
    const fileBuffer = await fileBlob.arrayBuffer();
    const sha1 = await sha1Hex(fileBuffer);

    // Step 3: 上传文件
    try {
      const { status } = await axios.post(uploadData.uploadUrl, fileBuffer, {
        headers: {
          Authorization: uploadData.authorizationToken,
          "X-Bz-File-Name": encodeURIComponent(fileName),
          "Content-Type": "application/zip",
          "X-Bz-Content-Sha1": sha1,
        },
      });
      return status === 200;
    } catch {
      return false;
    }
  }

  async getFile(path: string): Promise<IBackupData> {
    await this.ensureAuthorized();

    const { data } = await axios.get<Blob>(
      `${this.downloadUrl}/file/${this.userConfig.bucketName}/${encodeURIComponent(path)}`,
      {
        headers: { Authorization: this.authToken },
        responseType: "blob",
      },
    );

    return await this.jsZipBlobToBackupData(data);
  }

  async deleteFile(path: string): Promise<boolean> {
    const bucketId = await this.getBucketId();

    try {
      // 通过文件名精确查找 fileId
      const { data: listData } = await axios.post<B2ListFileNamesResponse>(
        `${this.apiUrl}/b2api/v2/b2_list_file_names`,
        {
          bucketId,
          prefix: path,
          maxFileCount: 1,
        },
        { headers: { Authorization: this.authToken } },
      );

      const file = listData.files.find((f) => f.fileName === path);
      if (!file) return false;

      const { data: deleteData } = await axios.post<B2DeleteFileResponse>(
        `${this.apiUrl}/b2api/v2/b2_delete_file_version`,
        { fileName: path, fileId: file.fileId },
        { headers: { Authorization: this.authToken } },
      );

      return !!deleteData.fileId;
    } catch {
      return false;
    }
  }
}
