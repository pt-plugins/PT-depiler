import {
  clientType,
  clientTypeList,
  TorrentClient,
  TorrentClientBaseConfig,
  TorrentClientMetaData
} from '@/interfaces/btclients'

// noinspection JSUnusedGlobalSymbols
export default class BtClientFactory {
  private initializedClient: {
    [uuid: string]: TorrentClient
  } = {}

  static isValidClient (type: clientType): boolean {
    return clientTypeList.includes(type)
  }

  private static async dynamicImport (type: clientType) {
    return await import(
      /* webpackChunkName: "lib/btclients/[request]" */
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

  public async create (config: TorrentClientBaseConfig): Promise<TorrentClient> {
    const module = await BtClientFactory.dynamicImport(config.type)
    const Client = module.default
    // @ts-ignore
    return new Client(config)
  }

  // noinspection JSUnusedGlobalSymbols
  public async getClient (config: TorrentClientBaseConfig): Promise<TorrentClient> {
    if (!(config.uuid in this.initializedClient)) {
      this.initializedClient[config.uuid] = await this.create(config)
    }
    return this.initializedClient[config.uuid]
  }
}
