import AbstractBittorrentClient from './AbstractBittorrentClient';
import * as types from './types';
export { AbstractBittorrentClient, types };

// 动态生成 btClient 列表
const requireContext = require.context('./clients/', true, /\.ts$/);
const clientTypeMap: Record<string, string> = { }; // { Aria2: './Aria2.ts' }

requireContext.keys().forEach(value => {
  const clientKey = value.replace(/^\.\//, '').replace(/\.ts$/, '');
  clientTypeMap[clientKey] = value;
});

export const clientTypeList = Object.keys(clientTypeMap);

// 从 requireContext 中获取对应模块
export function getClientModule (type: string): {
  default: AbstractBittorrentClient,
  clientConfig: types.BittorrentClientBaseConfig,
  clientMetaData: types.TorrentClientMetaData
} {
  return requireContext(clientTypeMap[type]);
}

export function getClientDefaultConfig (type: string) {
  return getClientModule(type).clientConfig;
}

export function getClientMetaData (type: string) {
  return getClientModule(type).clientMetaData;
}

const clientInstanceCache: Record<string, AbstractBittorrentClient> = {};

export function getClient (config: types.BittorrentClientBaseConfig & {uuid?: string}): AbstractBittorrentClient {
  let clientInstance;
  if (config.uuid && clientInstanceCache[`client-${config.uuid}`]) {
    clientInstance = clientInstanceCache[`client-${config.uuid}`];
  } else {
    const { default: Client } = getClientModule(config.type);

    // @ts-ignore
    clientInstance = new Client(config);
    if (config.uuid) {
      clientInstanceCache[`client-${config.uuid}`] = clientInstance;
    }
  }

  return clientInstance;
}
