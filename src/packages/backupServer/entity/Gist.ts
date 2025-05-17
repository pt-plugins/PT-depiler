/**
 * 使用 Github Gist 进行备份
 *
 *
 * 使用方法：
 *  1. 获取 gist_id： 在 https://gist.github.com/ 创建一个 secret gist 。
 *                   gist 的名称（为了方便辨识 可以填写 PTD backup） 和 文件内容 都任意填写即可，
 *                   你会获得 类似 https://gist.github.com/<userName>/<gist_id> 的地址
 *  2. 获取 access_token: 参照官方文档（ https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token ）
 *                       创建一个 Fine-grained personal access tokens ， Repository access 为 Public repositories
 *                       并在下方 Permissions - Account permissions 中找到 Gists 并将其设置为 Read And Write
 *                       注意，根据你创建的 gist 用户设置 Resource owner 并 按照需要设置 Expiration
 *                       你会获得 以 github_pat_ 开头的字符串
 *
 * 注意：
 * 1. Gist 不支持删除历史记录，如果需要删除，请在 github 上手动删除对应 gist，并创建一个新的。
 */

import axios, { AxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";
import AbstractBackupServer from "../AbstractBackupServer.ts";
import { localSort } from "../utils.ts";
import type { IBackupConfig, IBackupData, IBackupFileInfo, IBackupFileListOption, IBackupMetadata } from "../type.ts";

interface GistConfig extends IBackupConfig {
  config: {
    gist_id: string;
    access_token: string;
  };
}

export const serverConfig: GistConfig = {
  name: "Gist",
  type: "Gist",
  address: "https://gist.github.com/", // 这个其实没用，只是占位
  config: { gist_id: "", access_token: "" },
};

export const serverMetaData: IBackupMetadata<GistConfig> = {
  requiredField: [
    {
      name: "Gist ID",
      key: "gist_id",
      type: "string",
      description:
        "在 https://gist.github.com/ 创建一个 secret gist ，你会获得 类似 https://gist.github.com/<userName>/<gist_id> 的地址",
    },
    {
      name: "Access Token",
      key: "access_token",
      type: "string",
      description:
        "创建一个 Fine-grained personal access tokens ， Repository access 为 Public repositories 并在下方 Permissions - Account permissions 中找到 Gists 并将其设置为 Read And Write",
    },
  ],
};

interface IGistBackupFileManifest {
  encryption: boolean;
  fileName: string;
  version: string;
  time: number;
  files: Record<string, { name: string; hash: string }>;
}

export default class Gist extends AbstractBackupServer<GistConfig> {
  protected version = "0.0.1";

  protected async request<T>(url: string, config: AxiosRequestConfig = {}) {
    const headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${this.userConfig.access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    return axios.request<T>({
      ...config,
      baseURL: `https://api.github.com/gists/${this.userConfig.gist_id}`,
      url,
      headers,
    });
  }

  async ping(): Promise<boolean> {
    try {
      const pingReq = await this.request<{ url?: string }>("");
      return typeof pingReq.data?.url === "string";
    } catch (e) {
      console?.warn(e);
    }
    return false;
  }

  async list(options: IBackupFileListOption): Promise<IBackupFileInfo[]> {
    const retFileList = [] as IBackupFileInfo[];
    const listReq = await this.request<{ committed_at: string; version: string }[]>("/commits", {
      params: { per_page: 100 },
    });
    for (const datum of listReq.data) {
      retFileList.push({
        filename: datum.version,
        path: datum.version,
        time: new Date(datum.committed_at).getTime(),
        size: "N/A",
      });
    }

    return localSort(retFileList, options);
  }

  async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    const patchFile = {} as Record<string, any>;

    const manifest = {
      encryption: typeof this.encryptionKey === "string" && this.encryptionKey !== "",
      fileName,
      version: `${this.config.type} (${this.version})`,
      time: new Date().getTime(),
      files: {},
    } as IGistBackupFileManifest;

    for (const [key, value] of Object.entries(file)) {
      const fileName = `${key}.${manifest.encryption ? "txt" : "json"}`;
      const fileContent = this.encryptData(value);
      manifest.files[key] = { name: fileContent, hash: CryptoJS.MD5(fileContent).toString() };
      patchFile[fileName] = { content: fileContent };
    }

    patchFile["_manifest.json"] = { content: JSON.stringify(manifest, null, 2) };

    try {
      await this.request("", {
        method: "PATCH",
        data: {
          description: fileName,
          files: patchFile,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async getFile(path: string): Promise<IBackupData> {
    const {
      data: { files = {} },
    } = await this.request<{ files: Record<string, { content: string }> }>(`/${path}`);

    const fileManifestContent = files?.["_manifest.json"]?.content;
    if (!fileManifestContent) {
      throw new Error("This file is not valid.");
    }

    const result = {} as IBackupData;

    const manifest = JSON.parse(fileManifestContent) as IGistBackupFileManifest;
    for (const [key, value] of Object.entries(manifest.files)) {
      const { hash: manifestContentHash, name: fileName } = value;
      const fileRawContent = files[fileName]?.content;
      if (fileRawContent) {
        const fileContentHash = CryptoJS.MD5(fileRawContent).toString();
        if (fileContentHash !== manifestContentHash) {
          throw new Error(`File hash mismatch for ${fileName}.`);
        }

        result[key] = this.encryptData(fileRawContent);
      }
    }

    return result;
  }

  // Gist 不支持删除历史记录！我们直接返回 false 表示删除失败即可！
  async deleteFile(path: string): Promise<boolean> {
    return false;
  }
}
