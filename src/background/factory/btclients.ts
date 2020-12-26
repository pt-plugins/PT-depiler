import { TorrentClient, TorrentClientConfig, TorrentClientMetaData } from '@/interfaces/btclients'
import Deluge, { defaultDelugeConfig, DelugeMetaData } from '@/background/btclients/deluge'
import Qbittorrent, { defaultQbittorrentConfig, QbittorrentMetaData } from '@/background/btclients/qbittorrent'

export const supportClientType: {
  [client :string /** FIXME in clientType */]: { config: TorrentClientConfig; metadata: TorrentClientMetaData }
} = {
  deluge: { config: defaultDelugeConfig, metadata: DelugeMetaData },
  qbittorrent: { config: defaultQbittorrentConfig, metadata: QbittorrentMetaData }
}

export default function (config: TorrentClientConfig): TorrentClient {
  switch (config.type) {
    case 'deluge':
      return new Deluge(config)
    case 'qbittorrent':
      return new Qbittorrent(config)
    default: // FIXME
      return new Deluge(config)
  }
}
