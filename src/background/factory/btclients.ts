import { clientType, TorrentClient, TorrentClientConfig, TorrentClientMetaData } from '@/interfaces/btclients'
import Deluge, { defaultDelugeConfig, DelugeMetaData } from '@/background/btclients/deluge'
import Qbittorrent, { defaultQbittorrentConfig, QbittorrentMetaData } from '@/background/btclients/qbittorrent'
import Transmission, { defaultTransmissionConfig, TransmissionMetaData } from '@/background/btclients/transmission'
import SynologyDownloadStation, {
  defaultSynologyDownloadStationConfig,
  synologyDownloadStationMetaData
} from '@/background/btclients/synologyDownloadStation'

export const supportClientType: {
  [client in clientType]: { config: TorrentClientConfig; metadata: TorrentClientMetaData }
} = {
  deluge: { config: defaultDelugeConfig, metadata: DelugeMetaData },
  qbittorrent: { config: defaultQbittorrentConfig, metadata: QbittorrentMetaData },
  transmission: { config: defaultTransmissionConfig, metadata: TransmissionMetaData },
  synologyDownloadStation: { config: defaultSynologyDownloadStationConfig, metadata: synologyDownloadStationMetaData }
}

export default function (config: TorrentClientConfig): TorrentClient {
  switch (config.type) {
    case 'deluge':
      return new Deluge(config)
    case 'qbittorrent':
      return new Qbittorrent(config)
    case 'transmission':
      return new Transmission(config)
    case 'synologyDownloadStation':
      return new SynologyDownloadStation(config)
    default: // FIXME
      return new Deluge(config)
  }
}
