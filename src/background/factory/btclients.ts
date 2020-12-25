import { TorrentClient, TorrentClientConfig, TorrentClientMetaData } from '@/interfaces/btclients'
import Deluge, { defaultDelugeConfig, DelugeMetaData } from '@/background/btclients/deluge'

export const supportClientType: {
  [client: string]: { config: TorrentClientConfig; metadata: TorrentClientMetaData }
} = {
  deluge: {
    config: defaultDelugeConfig,
    metadata: DelugeMetaData
  }
}

export default function (config: TorrentClientConfig): TorrentClient {
  switch (config.type) {
    case 'deluge':
    default:
      return new Deluge(config)
  }
}
