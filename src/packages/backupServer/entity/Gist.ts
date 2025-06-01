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
import {
  IBackupConfig,
  IBackupData,
  IBackupFileInfo,
  IBackupFileListOption,
  IBackupFileManifest,
  IBackupMetadata,
} from "../type.ts";

interface GistConfig extends IBackupConfig {
  config: {
    gist_id: string;
    access_token: string;
  };
}

export const serverConfig: GistConfig = {
  name: "Gist",
  type: "Gist",
  config: { gist_id: "", access_token: "" },
};

export const serverMetaData: IBackupMetadata<GistConfig> = {
  description: "Gist 是 GitHub 提供的一个代码片段分享平台，支持文件存储和共享功能。",
  requiredField: [
    {
      name: "Gist ID",
      key: "gist_id",
      type: "string",
      description: "填入 https://gist.github.com/<userName>/<gist_id> 的地址中 gist_id 部分，创建一个 secret gist 即可",
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

interface IGistCommitHistory {
  committed_at: string;
  version: string;
  change_status: { total: number; additions: number; deletions: number };
}

interface IGistBackupFileManifest extends IBackupFileManifest {
  fileName: string;
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

  async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const retFileList = [] as IBackupFileInfo[];
    const listReq = await this.request<IGistCommitHistory[]>("/commits", {
      params: { per_page: 100 },
    });
    for (const datum of listReq.data) {
      // 假定了 每次更新记录 都会产生 deletions， 如果 deletions = 0 则说明是 第一次创建，应该过滤掉 （实际并不一定）
      if (datum.change_status?.deletions > 0) {
        retFileList.push({
          filename: datum.version,
          path: datum.version,
          time: new Date(datum.committed_at).getTime(),
          size: "N/A",
        });
      }
    }

    return localSort(retFileList, options);
  }

  async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    let patchFile = {} as Record<string, { content: string } | null>;

    const manifest = {
      version: `${this.config.type} (${this.version})`,
      time: new Date().getTime(),
      ...(file.manifest ?? {}),

      encryption: typeof this.encryptionKey === "string" && this.encryptionKey !== "",
      fileName,
      files: {},
    } as IGistBackupFileManifest;

    const writeFile = {} as Record<string, { content: string } | null>;
    for (const [key, value] of Object.entries(file)) {
      const writeFileName = `${key}.${manifest.encryption ? "txt" : "json"}`;
      const fileContent = this.encryptData(value);
      manifest.files[key] = { name: writeFileName, hash: CryptoJS.MD5(fileContent).toString() };
      writeFile[writeFileName] = { content: fileContent };
    }

    patchFile["_manifest.json"] = { content: JSON.stringify(manifest, null, 2) };
    patchFile = { ...patchFile, ...writeFile };

    try {
      const currentGistStatus = await this.request<{ files: Record<string, { content: string }> }>("");
      const currentGistFileKeys = Object.keys(currentGistStatus.data?.files ?? {});

      // 如果用户初次编辑的时候添加了任意的文件，我们需要进行删除，不然会遗留了不需要的文件
      for (const currentGistFileKey of currentGistFileKeys) {
        if (typeof patchFile[currentGistFileKey] === "undefined" && !currentGistFileKey.includes(".keep.")) {
          patchFile[currentGistFileKey] = null;
        }
      }

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
    } = await this.request<{ files: Record<string, { content: string; truncated: boolean; raw_url: string }> }>(
      `/${path}`,
    );

    const fileManifestContent = files?.["_manifest.json"]?.content;
    if (!fileManifestContent) {
      throw new Error("This file is not valid.");
    }

    const result = {} as IBackupData;

    const manifest = JSON.parse(fileManifestContent) as IGistBackupFileManifest;
    for (const [key, value] of Object.entries(manifest.files)) {
      const { hash: manifestContentHash, name: fileName } = value;

      let fileRawContent = files[fileName]?.content;
      if (fileRawContent) {
        if (files[fileName].truncated) {
          const rawContentReq = await this.request<string>(files[fileName].raw_url);
          fileRawContent = rawContentReq.data;
        }

        const fileContentHash = CryptoJS.MD5(fileRawContent).toString();
        if (fileContentHash !== manifestContentHash) {
          throw new Error(`File hash mismatch for ${fileName}.`);
        }

        try {
          result[key] = this.decryptData(fileRawContent);
        } catch (e) {
          throw new Error(`Failed to decrypt file.`);
        }
      }
    }

    result.manifest = manifest;
    return result;
  }

  // Gist 不支持删除历史记录！我们直接返回 false 表示删除失败即可！
  async deleteFile(path: string): Promise<boolean> {
    return false;
  }
}
