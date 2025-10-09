import { AuthType, createClient, type FileStat, type WebDAVClient } from "webdav";

import AbstractBackupServer from "../AbstractBackupServer.ts";
import { localSort } from "../utils";
import type { IBackupConfig, IBackupData, IBackupFileInfo, IBackupFileListOption, IBackupMetadata } from "../type";

interface WebDAVConfig extends IBackupConfig {
  config: {
    address: string;
    loginName: string;
    loginPwd: string;
    digest?: boolean;
  };
}

export const serverConfig: WebDAVConfig = {
  name: "WebDAV",
  type: "WebDAV",
  config: { address: "http://127.0.0.1/webdav", loginName: "", loginPwd: "", digest: false },
};

export const serverMetaData: IBackupMetadata<WebDAVConfig> = {
  description: "WebDAV 是一种基于 HTTP 协议的文件传输协议，支持文件存储和共享功能。",
  requiredField: [
    { name: "地址", key: "address", type: "string" },
    { name: "用户名", key: "loginName", type: "string" },
    { name: "密码", key: "loginPwd", type: "string" },
    { name: "Digest", key: "digest", type: "boolean" },
  ],
};

export default class WebDAV extends AbstractBackupServer<WebDAVConfig> {
  protected version = "1.0.0";

  private server?: WebDAVClient;

  private getServer(): WebDAVClient {
    if (!this.server) {
      this.server = createClient(this.userConfig.address, {
        username: this.userConfig.loginName,
        password: this.userConfig.loginPwd,
        authType: this.userConfig.digest ? AuthType.Digest : undefined,
      });
    }
    return this.server;
  }

  async ping(): Promise<boolean> {
    try {
      await this.getServer().getDirectoryContents("/");
      return true;
    } catch {}
    return false;
  }

  async list(options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const retFileList: IBackupFileInfo[] = [];

    const fileList = (await this.getServer().getDirectoryContents("/", {
      glob: "*.zip",
    })) as FileStat[];
    fileList.forEach((item) => {
      retFileList.push({
        filename: item.basename,
        path: item.filename,
        size: item.size,
        time: +new Date(item.lastmod),
      } as IBackupFileInfo);
    });

    return localSort(retFileList, options);
  }

  async addFile(fileName: string, file: IBackupData): Promise<boolean> {
    const fileBlob = await this.backupDataToJSZipBlob(file);
    const fileBuffer = (await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = function () {
        resolve(this.result as ArrayBuffer);
      };
      fr.readAsArrayBuffer(fileBlob);
    })) as ArrayBuffer;

    return await this.getServer().putFileContents(fileName, fileBuffer);
  }

  async getFile(path: string): Promise<IBackupData> {
    const fileBuffer = await this.getServer().getFileContents(`/${path}`);
    const data = new Blob([fileBuffer as ArrayBuffer]);

    return await this.jsZipBlobToBackupData(data);
  }

  async deleteFile(path: string): Promise<boolean> {
    await this.getServer().deleteFile(`/${path}`);
    return true;
  }
}
