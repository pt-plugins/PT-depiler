/**
 * CookieCloud是一个和自架服务器同步Cookie的小工具，可以将浏览器的Cookie及Local storage同步到手机和云端，它内置端对端加密。
 * homepage: https://github.com/easychen/CookieCloud
 *
 * 我们可以利用它的API来作为一个简单的备份服务器。
 * 需要配置：
 *   - url: CookieCloud 服务器地址
 *   - uuid: 你在该 CookieCloud 的身份识别信息，注意，插件仅同步已添加站点的cookies，所以尽量和该 CookieCloud 上使用的其他 uuid 不同
 *   - password: CookieCloud 下用于加解密的密码，
 * 注意：
 *  1. CookieCloud 不支持历史记录，所以 list 方法只返回当前的情况
 *  2. CookieCloud 不支持删除记录，当调用 delete 时，我们会更新服务器数据为 { cookie_data: {} }
 *  3. 我们不向 CookieCloud 提供 local_storage_data，实际上 我们提交的数据格式为 { cookie_data, ptd_data, metadata }
 *     这样可以 在为其他需要 CookieCloud 支持的环境提供直接支持的同时，存储插件独有的数据
 *  4. 使用公用 CookieCloud 可能存在数据丢失、泄露的风险，同时 CookieCloud Server 也有备份文件大小的限制
 */

import CryptoJS from "crypto-js";
import axios, { AxiosRequestConfig } from "axios";
import AbstractBackupServer from "../AbstractBackupServer.ts";
import type {
  IBackupConfig,
  IBackupData,
  IBackupFileInfo,
  IBackupFileListOption,
  IBackupFileManifest,
  IBackupMetadata,
} from "../type.ts";

interface CookieCloudConfig extends IBackupConfig {
  config: {
    address: string;
    uuid: string;
    password: string;
    headers: string;
  };
}

export const serverConfig: CookieCloudConfig = {
  name: "CookieCloud",
  type: "CookieCloud",
  config: { address: "https://cookiecloud.example.com/", uuid: "", password: "", headers: "" },
};

export const serverMetaData: IBackupMetadata<CookieCloudConfig> = {
  description:
    "CookieCloud是一个和自架服务器同步Cookie的小工具，可以将浏览器的Cookie同步到手机和云端，它内置端对端加密。",
  requiredField: [
    { name: "地址", key: "address", type: "string" },
    {
      name: "UUID",
      key: "uuid",
      type: "string",
      description: "CookieCloud 的身份识别信息，建议不与其他已使用的UUID相同",
    },
    { name: "密码", key: "password", type: "string", description: "CookieCloud 后端强制加密，且不使用全局加密的密钥" },
    {
      name: "Headers",
      key: "headers",
      type: "strings",
      description: "CookieCloud 的鉴权 Headers，如果没有，请留空。如果有，则一行一个，格式为 key: value",
    },
  ],
};

interface ICookieCloudFile {
  cookie_data: Record<string, chrome.cookies.Cookie[]>;
  local_storage_data: {};
  ptd_data: Omit<IBackupData, "manifest" | "cookies">;
  metadata: {
    fileName: string;
    path: string;
    time: number;
    size: "N/A";
    manifest?: IBackupFileManifest;
  };
}

export default class CookieCloud extends AbstractBackupServer<CookieCloudConfig> {
  protected version = "0.0.1";

  override get encryptionKey() {
    return this.userConfig.password!;
  }

  private async request<T>(url: string, config: AxiosRequestConfig = {}) {
    const headers = {
      ...(config.headers ?? {}),
      "Content-Type": "application/json",
    };

    if (this.userConfig.headers?.trim().length > 0) {
      let extraHeaderPairs = this.userConfig.headers?.trim().split("\n");
      extraHeaderPairs.forEach((extraHeaderPair, index) => {
        let extraHeaderPairKV = String(extraHeaderPair).split(":");
        if (extraHeaderPairKV?.length > 1) {
          // @ts-ignore
          headers[extraHeaderPairKV[0]] = extraHeaderPairKV[1];
        }
      });
    }

    return axios.request<T>({
      baseURL: this.userConfig.address,
      url,
      ...config,
      headers,
    });
  }

  public async ping(): Promise<boolean> {
    try {
      const pingResp = await this.request<string>("", { responseType: "text" });
      return pingResp.data?.includes("Hello World!API ROOT =") || false;
    } catch (e) {
      console?.warn(e);
    }
    return false;
  }

  public async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    const fileData: ICookieCloudFile = {
      cookie_data: {},
      local_storage_data: {}, // 我们不支持 local_storage_data
      ptd_data: {},
      metadata: {
        manifest: file.manifest as IBackupFileManifest,
        fileName,
        path: "",
        time: new Date().getTime(),
        size: "N/A",
      },
    };

    // 将 file.cookie 转换为 CookieCloud 需要的格式
    if (file.cookies) {
      fileData.cookie_data = file.cookies;
      delete file.cookies; // 删除原有的 file.cookies 以免重复存储
    }
    delete file.manifest; // 删除 manifest 以免重复存储
    fileData.ptd_data = file; // 其他的数据直接放在 ptd_data 里

    // 按照 CookieCloud 的流程对数据进行加密
    const theKey = CryptoJS.MD5(`${this.userConfig.uuid}-${this.userConfig.password}`).toString().substring(0, 16);
    const encryptedFileData = CryptoJS.AES.encrypt(JSON.stringify(fileData), theKey).toString();

    try {
      const updateResp = await this.request<{ action: "done" | "error" }>("/update", {
        method: "POST",
        data: { uuid: this.userConfig.uuid, encrypted: encryptedFileData },
      });
      return updateResp.data.action === "done";
    } catch (e) {}

    return false;
  }

  public async deleteFile(path: string): Promise<boolean> {
    return await this.addFile("", { cookie: {} }); // 直接更新数据为 { cookie_data: {} }
  }

  public async getFile(path: string): Promise<IBackupData> {
    const fileResp = await this.request<{ encrypted: string }>(`/get/${this.userConfig.uuid}`);
    if (fileResp.data?.encrypted) {
      const theKey = CryptoJS.MD5(`${this.userConfig.uuid}-${this.userConfig.password}`).toString().substring(0, 16);
      const decrypted = CryptoJS.AES.decrypt(fileResp.data.encrypted, theKey).toString(CryptoJS.enc.Utf8);
      const parsed = JSON.parse(decrypted) as ICookieCloudFile;

      const retFile = parsed.ptd_data as IBackupData;
      retFile.cookies = parsed.cookie_data;
      retFile.manifest = parsed.metadata?.manifest;
      retFile.metadata = parsed.metadata;

      // 尝试从响应头中解出 CookieCloud 的备份大小
      retFile.metadata.size = parseInt(fileResp.headers?.["content-length"] ?? "0") || "N/A";

      return retFile;
    }

    throw new Error("No data found");
  }

  public async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const list = [] as IBackupFileInfo[];

    const file = await this.getFile("");
    if (file.metadata) {
      list.push({
        filename: file.metadata.fileName,
        path: "",
        time: file.metadata.time,
        size: "N/A",
      });
    }

    return list;
  }
}
