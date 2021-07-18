import {
  IBackupConfig,
  IBackupFileInfo,
  IBackupFileListOption,
  IBackupMetadata,
  IBackupServer
} from '../type';
import { localSort } from '../utils';
import { FileStat, WebDAVClient } from 'webdav/web/types';
import { AuthType, createClient } from 'webdav/web';

interface WebDAVConfig extends IBackupConfig {
  config: {
    loginName: string;
    loginPwd: string;
    digest?: boolean;
  }
}

export const serverConfig: WebDAVConfig = {
  id: '23fa6008-6f95-4c67-b124-9bdad71f9a73',
  name: 'WebDAV',
  type: 'WebDAV',
  address: 'http://127.0.0.1/webdav',
  config: { loginName: '', loginPwd: '', digest: false }
};

export const serverMetaData: IBackupMetadata<WebDAVConfig> = {
  requiredField: [
    { name: '用户名', key: 'loginName', type: 'string' },
    { name: '密码', key: 'loginPwd', type: 'string' },
    { name: 'Digest', key: 'digest', type: 'boolean' }
  ]
};

export default class WebDAV implements IBackupServer<WebDAVConfig> {
  config: WebDAVConfig;
  private server: WebDAVClient;

  constructor (config: WebDAVConfig) {
    this.config = config;

    const { config: options } = config;

    this.server = createClient(config.address, {
      username: options.loginName,
      password: options.loginPwd,
      authType: options.digest ? AuthType.Digest : undefined
    });
  }

  async ping (): Promise<boolean> {
    try {
      await this.server.getDirectoryContents('/');
      return true;
    } catch { }
    return false;
  }

  async list (options: IBackupFileListOption = {}): Promise<IBackupFileInfo[]> {
    const retFileList: IBackupFileInfo[] = [];

    const fileList = await this.server.getDirectoryContents('/', { glob: '*.zip' }) as FileStat[];
    fileList.forEach(item => {
      retFileList.push({
        filename: item.basename,
        path: item.filename,
        size: item.size,
        time: +new Date(item.lastmod)
      } as IBackupFileInfo);
    });

    return localSort(retFileList, options);
  }

  async addFile (fileName: string, file: Blob): Promise<boolean> {
    const fileBuffer = await (new Promise(resolve => {
      const fr = new FileReader();
      fr.onload = function () {
        resolve(this.result as ArrayBuffer);
      };
      fr.readAsArrayBuffer(file);
    })) as ArrayBuffer;

    return await this.server.putFileContents(fileName, fileBuffer);
  }

  async getFile (path: string): Promise<Blob> {
    const fileBuffer = await this.server.getFileContents(`/${path}`);
    return new Blob([fileBuffer as Buffer]);
  }

  async deleteFile (path: string): Promise<boolean> {
    await this.server.deleteFile(`/${path}`);
    return true;
  }
}
