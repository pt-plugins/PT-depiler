/**
 * 使用前请先到 https://www.dropbox.com/developers/apps 页面申请应用，
 * - 申请页设置：
 *   1. Choose an API : Scoped access
 *   2. Choose the type of access you need : App folder  ( 一定要使用这个，不支持 Full Dropbox )
 *   3. Name your app : 随便取名，建议 PTPP，因为会影响到在应用文件夹的显示
 * - 应用新增好后，前往 Permissions 标签页，为应用添加 Files and folders 下的所有权限，并保存：
 *   files.metadata.write, files.metadata.read, files.content.write, files.content.read
 * - 在 Settings 标签页，设置 Access token expiration 为 No expiration
 *   并点击 Generated access token 的 Generate 按钮，记住生成的 access_token 并填入设置页面（请勿重复生成）
 */

import { merge } from "es-toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import AbstractBackupServer from "../AbstractBackupServer.ts";
import { localSort } from "../utils";
import type { IBackupConfig, IBackupMetadata, IBackupFileListOption, IBackupFileInfo, IBackupData } from "../type";

interface DropBoxConfig extends IBackupConfig {
  config: {
    access_token: string;
  };
}

export const serverConfig: DropBoxConfig = {
  name: "DropBox",
  type: "DropBox",
  config: { access_token: "" },
};

export const serverMetaData: IBackupMetadata<DropBoxConfig> = {
  description: "DropBox 是一个云存储服务，提供文件存储和共享功能。",
  requiredField: [{ name: "access_token", key: "access_token", type: "string" }],
};

interface DropBoxBaseEntry {
  ".tag": string;
  name: string;
  id: `id:${string}`;
  path_lower: string;
  path_display: string;
  sharing_info: any;
  property_groups: {
    template_id: string;
    fields: { name: string; value: string }[];
  }[];
}

interface DropBoxFile extends DropBoxBaseEntry {
  ".tag": "file";
  client_modified: string;
  server_modified: string;
  rev: string;
  size: number;
  sharing_info: {
    read_only: boolean;
    parent_shared_folder_id: `${number}`;
    modified_by: string;
  };
  is_downloadable: boolean;
  has_explicit_shared_members: boolean;
  content_hash: string;
  file_lock_info: {
    is_lockholder: boolean;
    lockholder_name: string;
    created: string;
  };
}

interface DropBoxFolder extends DropBoxBaseEntry {
  ".tag": "folder";
  sharing_info: {
    read_only: boolean;
    parent_shared_folder_id: `${number}`;
    traverse_only: boolean;
    no_access: boolean;
  };
}

type DropBoxEntry = DropBoxFile | DropBoxFolder;

interface DropBoxList {
  entries: DropBoxEntry[];
  cursor: string;
  has_more: boolean;
}

export default class DropBox extends AbstractBackupServer<DropBoxConfig> {
  protected version = "1.0.0";

  get accessToken(): string {
    return this.userConfig.access_token;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.request<T>(
      merge(
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          responseType: "json",
        },
        config,
      ),
    );
  }

  public async ping(): Promise<boolean> {
    try {
      const { data } = await this.request<{ account_id?: string }>({
        url: "https://api.dropboxapi.com/2/users/get_current_account",
      });
      return !!data.account_id;
    } catch {
      return false;
    }
  }

  public async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    try {
      const { data } = await this.request<{ is_downloadable?: boolean }>({
        url: "https://content.dropboxapi.com/2/files/upload",
        headers: {
          "Dropbox-API-Arg": JSON.stringify({ path: `/${fileName}`, mode: "overwrite" }),
        },
        data: await this.backupDataToJSZipBlob(file),
      });

      return !!data.is_downloadable;
    } catch {
      return false;
    }
  }

  public async getFile(path: string): Promise<IBackupData> {
    const { data } = await this.request<Blob>({
      url: "https://content.dropboxapi.com/2/files/download",
      headers: {
        "Dropbox-API-Arg": JSON.stringify({ path }),
      },
      responseType: "blob",
    });

    return await this.jsZipBlobToBackupData(data);
  }

  public async deleteFile(path: string): Promise<boolean> {
    try {
      const { data } = await this.request<{
        error_summary?: string;
        metadata?: any;
      }>({
        url: "https://api.dropboxapi.com/2/files/delete_v2",
        data: { path },
      });

      return !data.error_summary;
    } catch {
      return false;
    }
  }

  async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const files: IBackupFileInfo[] = [];

    let cursor;
    let hasMore = true;
    while (hasMore) {
      // @ts-ignore
      const { data } = await this.request<DropBoxList>({
        url: `https://api.dropboxapi.com/2/files/list_folder${cursor ? "/continue" : ""}`,
        data: cursor ? { cursor } : { path: "" },
      });

      for (const dropboxEntry of data.entries) {
        if (dropboxEntry[".tag"] === "file") {
          files.push({
            filename: dropboxEntry.name,
            path: dropboxEntry.path_display,
            time: +new Date(dropboxEntry.client_modified || dropboxEntry.server_modified),
            size: dropboxEntry.size,
          } as IBackupFileInfo);
        }
      }

      hasMore = data.has_more;
      cursor = data.cursor;
    }

    return localSort(files, options);
  }
}
