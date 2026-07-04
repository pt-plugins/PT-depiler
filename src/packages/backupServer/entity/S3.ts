/**
 * S3 兼容对象存储备份支持（AWS S3、MinIO、Cloudflare R2、DigitalOcean Spaces 等）
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AbstractBackupServer from "../AbstractBackupServer.ts";
import { localSort } from "../utils";
import type { IBackupConfig, IBackupData, IBackupFileInfo, IBackupFileListOption, IBackupMetadata } from "../type";

interface S3Config extends IBackupConfig {
  config: {
    endpoint: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    pathPrefix?: string;
    forcePathStyle?: boolean;
  };
}

export const serverConfig: S3Config = {
  name: "S3",
  type: "S3",
  config: {
    endpoint: "https://s3.amazonaws.com",
    region: "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",
    bucket: "",
    pathPrefix: "",
    forcePathStyle: false,
  },
};

export const serverMetaData: IBackupMetadata<S3Config> = {
  description: "S3 兼容对象存储（支持 AWS S3、MinIO、Cloudflare R2、DigitalOcean Spaces 等）",
  requiredField: [
    { name: "Endpoint", key: "endpoint", type: "string" },
    { name: "Region", key: "region", type: "string" },
    { name: "Access Key ID", key: "accessKeyId", type: "string" },
    { name: "Secret Access Key", key: "secretAccessKey", type: "string" },
    { name: "Bucket", key: "bucket", type: "string" },
    { name: "Path Prefix", key: "pathPrefix", type: "string", description: "可选" },
    { name: "Force Path Style", key: "forcePathStyle", type: "boolean", description: "MinIO 等需开启" },
  ],
};

export default class S3 extends AbstractBackupServer<S3Config> {
  protected version = "1.0.0";

  private get endpoint(): string {
    return this.userConfig.endpoint.replace(/\/+$/, "");
  }

  private get keyPrefix(): string {
    const prefix = this.userConfig.pathPrefix?.trim() ?? "";
    return prefix ? (prefix.endsWith("/") ? prefix : `${prefix}/`) : "";
  }

  private get accessKeyId(): string {
    return this.userConfig.accessKeyId;
  }

  private objectUrl(path: string): string {
    const bucket = this.userConfig.bucket;
    const cleanPath = path.replace(/^\//, "");
    if (this.userConfig.forcePathStyle) {
      return `${this.endpoint}/${bucket}/${cleanPath}`;
    }
    return `${this.endpoint.replace("://", `://${bucket}.`)}/${cleanPath}`;
  }

  // ───── AWS Signature V4 ─────

  private static bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private static async sha256(data: string): Promise<string> {
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
    return S3.bufferToHex(hash);
  }

  private static async hmacSha256(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      // @ts-ignore
      key instanceof Uint8Array ? key.buffer : key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    return await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  }

  private static async deriveSigningKey(
    secretAccessKey: string,
    dateStamp: string,
    region: string,
    service: string,
  ): Promise<Uint8Array> {
    const kSecret = new TextEncoder().encode(`AWS4${secretAccessKey}`);
    const kDate = await S3.hmacSha256(kSecret, dateStamp);
    const kRegion = await S3.hmacSha256(kDate, region);
    const kService = await S3.hmacSha256(kRegion, service);
    const kSigning = await S3.hmacSha256(kService, "aws4_request");
    return new Uint8Array(kSigning);
  }

  private async buildAuthHeaders(
    method: string,
    url: string,
    queryString: string,
    extraHeaders: Record<string, string>,
    payloadHash: string,
    date: Date,
  ): Promise<Record<string, string>> {
    const region = this.userConfig.region;
    const service = "s3";
    const amzDate = date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);
    const parsedUrl = new URL(url);
    const canonicalUri = parsedUrl.pathname === "" ? "/" : parsedUrl.pathname;

    const signedHeaders: Record<string, string> = {
      host: parsedUrl.host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      ...extraHeaders,
    };

    const sortedKeys = Object.keys(signedHeaders).sort();
    const canonicalHeaders = sortedKeys.map((k) => `${k.toLowerCase()}:${signedHeaders[k]}\n`).join("");
    const signedHeaderStr = sortedKeys.map((k) => k.toLowerCase()).join(";");

    const canonicalRequest = [method, canonicalUri, queryString, canonicalHeaders, signedHeaderStr, payloadHash].join(
      "\n",
    );

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = await S3.sha256(canonicalRequest);
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, canonicalRequestHash].join("\n");

    const signingKey = await S3.deriveSigningKey(this.userConfig.secretAccessKey, dateStamp, region, service);
    const signature = S3.bufferToHex(await S3.hmacSha256(signingKey, stringToSign));

    return {
      ...signedHeaders,
      Authorization: `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaderStr}, Signature=${signature}`,
    };
  }

  private async s3Request<T>(
    method: string,
    path: string,
    options: {
      query?: Record<string, string>;
      data?: any;
      headers?: Record<string, string>;
      responseType?: AxiosRequestConfig["responseType"];
    } = {},
  ): Promise<AxiosResponse<T>> {
    const url = this.objectUrl(path);
    const queryString = options.query ? new URLSearchParams(options.query).toString() : "";

    let payloadHash: string;
    if (options.data instanceof Blob) {
      const buffer = await options.data.arrayBuffer();
      payloadHash = S3.bufferToHex(await crypto.subtle.digest("SHA-256", buffer));
    } else if (options.data && typeof options.data === "string") {
      payloadHash = await S3.sha256(options.data);
    } else if (options.data) {
      payloadHash = await S3.sha256(JSON.stringify(options.data));
    } else {
      payloadHash = await S3.sha256("");
    }

    const now = new Date();
    const authHeaders = await this.buildAuthHeaders(method, url, queryString, options.headers ?? {}, payloadHash, now);
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    return axios.request<T>({
      method: method as AxiosRequestConfig["method"],
      url: finalUrl,
      headers: authHeaders,
      data: options.data,
      responseType: options.responseType ?? "json",
      timeout: 45e3,
    });
  }

  // ───── S3 XML 响应解析 ─────

  /**
   * 解析 S3 ListObjectsV2 XML 响应
   */
  private parseListBucketResult(xml: string): {
    Contents: Array<{ Key: string; LastModified: string; Size: number }>;
    IsTruncated: boolean;
    NextContinuationToken?: string;
  } {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const contents: Array<{ Key: string; LastModified: string; Size: number }> = [];

    // 使用 getElementsByTagName 而非 querySelectorAll，
    // 避免 S3 XML 命名空间 (xmlns=...) 导致匹配失效
    const contentNodes = doc.getElementsByTagName("Contents");
    for (let i = 0; i < contentNodes.length; i++) {
      const el = contentNodes[i];
      contents.push({
        Key: el.getElementsByTagName("Key")[0]?.textContent ?? "",
        LastModified: el.getElementsByTagName("LastModified")[0]?.textContent ?? "",
        Size: parseInt(el.getElementsByTagName("Size")[0]?.textContent ?? "0", 10),
      });
    }

    return {
      Contents: contents,
      IsTruncated: doc.getElementsByTagName("IsTruncated")[0]?.textContent === "true",
      NextContinuationToken: doc.getElementsByTagName("NextContinuationToken")[0]?.textContent ?? undefined,
    };
  }

  // ───── AbstractBackupServer 实现 ─────

  async ping(): Promise<boolean> {
    try {
      // HEAD 请求到 bucket 根目录，S3 返回 200 即表示连通
      await this.s3Request("HEAD", "");
      return true;
    } catch {
      return false;
    }
  }

  async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const retFileList: IBackupFileInfo[] = [];
    let continuationToken: string | undefined;

    do {
      const query: Record<string, string> = {
        "list-type": "2",
        prefix: this.keyPrefix,
      };
      if (continuationToken) {
        query["continuation-token"] = continuationToken;
      }

      const res = await this.s3Request<string>("GET", "", { query, responseType: "text" });
      const parsed = this.parseListBucketResult(res.data);

      for (const item of parsed.Contents) {
        if (!item.Key.endsWith(".zip")) continue;
        const displayKey = this.keyPrefix ? item.Key.replace(this.keyPrefix, "") : item.Key;
        retFileList.push({
          filename: displayKey,
          path: displayKey,
          size: item.Size,
          time: +new Date(item.LastModified),
        } as IBackupFileInfo);
      }

      continuationToken = parsed.IsTruncated ? parsed.NextContinuationToken : undefined;
    } while (continuationToken);

    return localSort(retFileList, options);
  }

  async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    try {
      const fileBlob = await this.backupDataToJSZipBlob(file);
      const objectKey = `${this.keyPrefix}${fileName}`;
      await this.s3Request("PUT", objectKey, {
        data: fileBlob,
        headers: { "Content-Type": "application/zip" },
      });
      return true;
    } catch (e) {
      console?.warn("S3 addFile failed:", e);
      return false;
    }
  }

  async getFile(path: string): Promise<IBackupData> {
    const objectKey = `${this.keyPrefix}${path}`;
    const { data: blobData } = await this.s3Request<Blob>("GET", objectKey, { responseType: "blob" });
    return await this.jsZipBlobToBackupData(blobData);
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      const objectKey = `${this.keyPrefix}${path}`;
      await this.s3Request("DELETE", objectKey);
      return true;
    } catch {
      return false;
    }
  }
}
