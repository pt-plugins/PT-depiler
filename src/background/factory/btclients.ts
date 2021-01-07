import {
  clientType,
  clientTypeList,
  TorrentClient,
  TorrentClientBaseConfig,
  TorrentClientMetaData
} from '@/shared/interfaces/btclients'
import Container from '@/shared/class/container'

// noinspection JSUnusedGlobalSymbols
class BtClientFactory extends Container {
  static isValidClient (type: clientType): boolean {
    return clientTypeList.includes(type)
  }

  private static async dynamicImport (type: clientType) {
    return await import(
      /* webpackChunkName: "lib/btclients/[request]" */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default", "clientConfig", "clientMetaData"] */
      `@/background/btclients/${type}`) as {
      default: TorrentClient,
      clientConfig: TorrentClientBaseConfig,
      clientMetaData: TorrentClientMetaData
    }
  }

  public async getDefaultClientConfig (type: clientType) {
    const module = await BtClientFactory.dynamicImport(type)
    return module.clientConfig
  }

  public async getClientMetaData (type: clientType) {
    const module = await BtClientFactory.dynamicImport(type)
    return module.clientMetaData
  }

  // noinspection JSUnusedGlobalSymbols
  public async getClient (config: TorrentClientBaseConfig): Promise<TorrentClient> {
    return await this.resolveObject<TorrentClient>(`client-${config.uuid}`, async () => {
      const module = await BtClientFactory.dynamicImport(config.type)
      const Client = module.default
      // @ts-ignore
      return new Client(config)
    })
  }
}

export default new BtClientFactory()
