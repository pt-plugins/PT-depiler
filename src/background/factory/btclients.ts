import { clientType, TorrentClient, TorrentClientBaseConfig, TorrentClientMetaData } from '@/interfaces/btclients'
import Deluge, { defaultDelugeConfig, DelugeMetaData } from '@/background/btclients/Deluge'
import QBittorrent, { defaultQbittorrentConfig, QbittorrentMetaData } from '@/background/btclients/qBittorrent'
import Transmission, { defaultTransmissionConfig, TransmissionMetaData } from '@/background/btclients/Transmission'
import SynologyDownloadStation, {
  defaultSynologyDownloadStationConfig,
  synologyDownloadStationMetaData
} from '@/background/btclients/synologyDownloadStation'
import UTorrent, { defaultUTorrentConfig, UTorrentMetaData } from '@/background/btclients/uTorrent'
import RuTorrent, { defaultRuTorrentClientConfig, RuTorrentMetaData } from '@/background/btclients/ruTorrent'
import Flood, { defaultFloodConfig, FloodMetaData } from '@/background/btclients/Flood'

export const supportClientType: {
  [client in clientType]: { config: TorrentClientBaseConfig; metadata: TorrentClientMetaData }
} = {
  deluge: { config: defaultDelugeConfig, metadata: DelugeMetaData },
  qbittorrent: { config: defaultQbittorrentConfig, metadata: QbittorrentMetaData },
  transmission: { config: defaultTransmissionConfig, metadata: TransmissionMetaData },
  synologyDownloadStation: { config: defaultSynologyDownloadStationConfig, metadata: synologyDownloadStationMetaData },
  utorrent: { config: defaultUTorrentConfig, metadata: UTorrentMetaData },
  ruTorrent: { config: defaultRuTorrentClientConfig, metadata: RuTorrentMetaData },
  flood: { config: defaultFloodConfig, metadata: FloodMetaData }
}

export default function (config: TorrentClientBaseConfig): TorrentClient {
  switch (config.type) {
    case 'deluge':
      return new Deluge(config)
    case 'qbittorrent':
      return new QBittorrent(config)
    case 'transmission':
      return new Transmission(config)
    case 'synologyDownloadStation':
      return new SynologyDownloadStation(config)
    case 'utorrent':
      return new UTorrent(config)
    case 'ruTorrent':
      return new RuTorrent(config)
    case 'flood':
      return new Flood(config)
  }
}
