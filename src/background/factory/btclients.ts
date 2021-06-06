import {
  BittorrentClientBaseConfig,
  TorrentClientMetaData
} from '@/resource/btClients/types';
import Container from '@/shared/class/container';
import AbstractBittorrentClient from '@/resource/btClients/AbstractBittorrentClient';

// 动态生成 btClient 列表
export const clientTypeList =
  require.context('@/resource/btClients/src/', true, /\.ts$/, 'weak')
    .keys()
    .filter(value => !/Abstract/.test(value))
    .map(value => {
      return value.replace(/^\.\//, '').replace(/\.ts$/, '');
    });

// noinspection JSUnusedGlobalSymbols
class BtClientFactory extends Container {
  public readonly clientTypeList = clientTypeList;

  public isValidClient (type: string): boolean {
    return clientTypeList.includes(type);
  }

  public async dynamicImport (type: string) {
    return await import(
      /* webpackChunkName: "lib/btclients/[request]" */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default", "clientConfig", "clientMetaData"] */
      `@/resource/btClients/src/${type}`) as {
      default: AbstractBittorrentClient,
      clientConfig: BittorrentClientBaseConfig,
      clientMetaData: TorrentClientMetaData
    };
  }

  public async getClientDefaultConfig (type: string) {
    const module = await this.dynamicImport(type);
    return module.clientConfig;
  }

  public async getClientMetaData (type: string) {
    const module = await this.dynamicImport(type);
    return module.clientMetaData;
  }

  // noinspection JSUnusedGlobalSymbols
  public async getClient (config: BittorrentClientBaseConfig): Promise<AbstractBittorrentClient> {
    return await this.resolveObject<AbstractBittorrentClient>(`client-${config.uuid}`, async () => {
      const { default: Client } = await this.dynamicImport(config.type);
      // @ts-ignore
      return new Client(config);
    });
  }
}

export default new BtClientFactory();
