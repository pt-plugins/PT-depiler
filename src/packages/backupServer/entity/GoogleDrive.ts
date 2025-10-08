/**
 * Many thanks to those project:
 *  - goindex: https://github.com/alx-xlx/goindex/blob/master/goindex.js
 *  - rclone: https://github.com/rclone/rclone/blob/master/backend/drive
 *
 * 我们建议给予的 scope 为 https://www.googleapis.com/auth/drive.appdata ，
 *         但对于完整给予 https://www.googleapis.com/auth/drive 权限的也应进行支持
 *   注意：
 *     - 这两个权限是互斥的
 *     - 如果给予 drive.appdata 权限，那么会备份到 Application Folder 的根目录下（因为这个目录用户读取不了）
 *       如果给予 drive 权限， 那么则会在 我的云端硬盘（My Drive）下新建一个 名为 `PTPP Backup` 的目录，并将文件备份到该目录中
 *
 * 使用方法：
 * 1. 申请 client_id 和 client_secret， 方法见：https://rclone.org/drive/#making-your-own-client-id
 * 2. 通过 Rclone 等途径获取 refresh_token ，记得在 Scope 时候选 "drive" 或 "drive.appfolder" （新用户建议）
 * 3. 填入以上三个参数。
 *
 * 请注意，对于同一个账号使用同一个 client_id 和 client_secret ，其 Scope 是唯一的。
 */
import urlJoin from "url-join";
import { sleep } from "~/helper.ts";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import AbstractBackupServer from "../AbstractBackupServer.ts";
import { EListOrderBy, EListOrderMode } from "../type";
import type { IBackupConfig, IBackupFileInfo, IBackupFileListOption, IBackupMetadata, IBackupData } from "../type";

interface GoogleDriveConfig extends IBackupConfig {
  config: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
  };
}

export const serverConfig: GoogleDriveConfig = {
  name: "GoogleDrive",
  type: "GoogleDrive",
  config: { client_id: "", client_secret: "", refresh_token: "" },
};

export const serverMetaData: IBackupMetadata<GoogleDriveConfig> = {
  description: "Google Drive 是 Google 提供的云存储服务，支持文件存储和共享功能。",
  requiredField: [
    { name: "client_id", key: "client_id", type: "string" },
    { name: "client_secret", key: "client_secret", type: "string" },
    { name: "refresh_token", key: "refresh_token", type: "string" },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ApiResponse {}

interface ErrorResponse extends ApiResponse {
  error: {
    code: number;
    errors: {
      domain: string;
      message: string;
      reason: string;
    }[];
    message: string;
  };
}

interface AuthInformationResponse extends ApiResponse {
  access_token: string;
  expires_in: number; // 一般返回值均为 3599
  scope: `https://www.googleapis.com/auth/${"drive" | "drive.appdata"}`;
  token_type: "Bearer";
}

interface File {
  kind: string;
  id: string;
  name: string;
  mimeType: string;

  size: string;
  createdTime: string;
}

interface FileListResponse extends ApiResponse {
  kind: "drive#fileList";
  nextPageToken?: string;
  incompleteSearch?: boolean;
  files: File[];
}

interface AuthInformation extends AuthInformationResponse {
  expired_at: number;
}

export default class GoogleDrive extends AbstractBackupServer<GoogleDriveConfig> {
  protected version = "1.0.0";

  private accessInformation?: AuthInformation;

  private rootFolderName = "PTD Backup";
  private ApiEndpoint = "https://www.googleapis.com/drive/v3/files";

  private async fetchAccessToken(): Promise<AuthInformation> {
    if (this.accessInformation === undefined || this.accessInformation.expired_at < Date.now()) {
      const { data } = await axios.post<AuthInformationResponse>(
        "https://www.googleapis.com/oauth2/v4/token",
        new URLSearchParams({
          client_id: this.userConfig.client_id,
          client_secret: this.userConfig.client_secret,
          refresh_token: this.userConfig.refresh_token,
          grant_type: "refresh_token",
        }),
      );
      this.accessInformation = { ...data, expired_at: Date.now() + 3500 * 1e3 };
    }

    return this.accessInformation!;
  }

  private async request<T extends ApiResponse>(config: AxiosRequestConfig = {}, retry = 3): Promise<AxiosResponse<T>> {
    // generateAuthRequestConfig
    const accessToken = await this.fetchAccessToken();
    config.headers = {
      ...config.headers,
      authorization: "Bearer " + accessToken.access_token,
    };

    try {
      return axios.request<T>(config);
    } catch (e) {
      const response = (e as AxiosError<ErrorResponse>).response!;
      if (response.data) {
        const errorMsg = response.data?.error?.message;
        if (errorMsg === "Rate Limit Exceeded" && retry > 0) {
          await sleep(2e3);
          return await this.request(config, retry - 1);
        }
      }

      throw Error(`Network Error: ${response.status} ${response.statusText || ""}`.trim());
    }
  }

  private async getScope(): Promise<"appDataFolder" | "drive"> {
    const accessToken = await this.fetchAccessToken();
    return accessToken.scope === "https://www.googleapis.com/auth/drive.appdata" ? "appDataFolder" : "drive";
  }

  private async getParentId(): Promise<string> {
    const scope = await this.getScope();
    if (scope === "appDataFolder") {
      return "appDataFolder";
    } else {
      const req = await this.request<FileListResponse>({
        url: this.ApiEndpoint,
        params: {
          q: `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${this.rootFolderName}'`,
        },
      });

      if (req.data.files.length === 0) {
        // 如果没有这个文件夹的话，就创建一个
        const { data } = await this.request<File>({
          method: "post",
          url: this.ApiEndpoint,
          data: {
            name: this.rootFolderName,
            mimeType: "application/vnd.google-apps.folder",
          },
        });

        return data.id;
      } else {
        return req.data.files[0].id;
      }
    }
  }

  async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    const metadata = {
      name: fileName,
      parents: [await this.getParentId()],
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", await this.backupDataToJSZipBlob(file));

    const { data } = await this.request<File>({
      method: "post",
      url: "https://www.googleapis.com/upload/drive/v3/files",
      params: { uploadType: "multipart" },
      data: form,
    });

    return !!data.id;
  }

  async getFile(path: string): Promise<IBackupData> {
    const { data } = await this.request<Blob>({
      url: urlJoin(this.ApiEndpoint, path),
      // If you provide the URL parameter alt=media, then the response includes the file contents in the response body.
      params: { alt: "media" },
      responseType: "blob",
    });

    return await this.jsZipBlobToBackupData(data);
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      await this.request({
        method: "delete",
        url: urlJoin(this.ApiEndpoint, path),
      });
      return true;
    } catch (e) {
      const response = (e as AxiosError<ErrorResponse>).response!;
      if (response.data?.error?.message?.startsWith("File not found: ")) {
        return true;
      }
    }
    return false;
  }

  async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const files: IBackupFileInfo[] = [];

    const params: AxiosRequestConfig["params"] = {
      spaces: await this.getScope(),
      q: `'${await this.getParentId()}' in parents and trashed = false`,
      fields: "nextPageToken, files(kind, id, name, mimeType, size, createdTime)",
      pageSize: 1000,
    };

    if (options) {
      let orderBy = "";
      switch (options.orderBy) {
        case EListOrderBy.name:
          orderBy += "name";
          break;
        case EListOrderBy.size:
          orderBy += "quotaBytesUsed";
          break;
        case EListOrderBy.time:
        default:
          orderBy += "modifiedTime";
      }

      if (options.orderMode !== EListOrderMode.asc) {
        orderBy += " desc";
      }
      params.orderBy = orderBy;
    }

    let pageToken;
    do {
      if (pageToken) {
        params.pageToken = pageToken;
      }

      const { data } = await this.request<FileListResponse>({
        url: this.ApiEndpoint,
        params,
      });
      if (data.files.length > 0) {
        data.files.forEach((value) => {
          files.push({
            filename: value.name,
            path: value.id,
            time: +new Date(value.createdTime),
            size: parseInt(value.size),
          });
        });
      }

      if (data.nextPageToken) {
        pageToken = data.nextPageToken;
      }
    } while (pageToken);

    return files;
  }

  async ping(): Promise<boolean> {
    try {
      const accessToken = await this.fetchAccessToken();
      return typeof accessToken?.access_token !== "undefined";
    } catch {}
    return false;
  }
}
