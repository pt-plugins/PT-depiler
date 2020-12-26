import {
  AddTorrentOptions,
  Torrent, TorrentClient,
  TorrentClientConfig,
  TorrentClientMetaData,
  TorrentFilterRules, TorrentState
} from '@/interfaces/btclients'
import urljoin from 'url-join'
import { Buffer } from 'buffer/'
import axios, { AxiosResponse } from 'axios'

export const defaultTransmissionConfig: TransmissionTorrentClientConfig = {
  type: 'transmission',
  name: 'Transmission',
  uuid: '69e8ecd29a96436cac6fc199c1abb846',
  address: 'http://localhost:9091/',
  username: '',
  password: '',
  timeout: 180 * 1e3
}

export const TransmissionMetaData: TorrentClientMetaData = {
  description: 'Transmission 是一个跨平台的BitTorrent客户端，特点是硬件资源消耗极少，界面极度精简',
  warning: [
    '默认情况下，系统会请求 http://ip:port/transmission/rpc 这个路径，如果无法连接，请确认 `settings.json` 文件的 `rpc-url` 值；详情可参考：https://github.com/ronggang/PT-Plugin-Plus/issues/32'
  ],
  allowCustomPath: true,
  pathDescription: '当前目录列表配置是指定硬盘上的绝对路径，如 /volume1/music/'
}

// TODO 注意，获取可用空间 的功能尚未实现
export default class Transmission implements TorrentClient {
  readonly version = 'v0.1.0'
  readonly config: TransmissionTorrentClientConfig;

  // 实例真实使用的rpc地址
  private readonly address: string;

  private sessionId : string = '';

  constructor (options: Partial<TransmissionTorrentClientConfig> = {}) {
    this.config = { ...defaultTransmissionConfig, ...options }

    // 修正服务器地址
    let address = this.config.address
    if (address.indexOf('rpc') === -1) {
      address = urljoin(address, '/transmission/rpc')
    }
    this.address = address
  }

  async addTorrent (url: string, options: Partial<TransmissionAddTorrentOptions> = {}): Promise<boolean> {
    if (options.localDownload) {
      const req = await axios.get(url, {
        responseType: 'arraybuffer'
      })
      options.metainfo = Buffer.from(req.data, 'binary').toString('base64')
    } else {
      options.filename = url
    }
    delete options.localDownload

    if (options.savePath) {
      options['download-dir'] = options.savePath
      delete options.savePath
    }

    // Transmission 3.0 以上才支持label
    if (options.label) {
      delete options.label
    }

    options.paused = options.addAtPaused
    delete options.addAtPaused
    try {
      const resp = await this.request('torrent-add', options)
      const data: AddTorrentResponse = resp.data
      return data.result === 'success'
    } catch (e) {
      return false
    }
  }

  async getAllTorrents (): Promise<TransmissionTorrent[]> {
    return await this.getTorrentsBy({})
  }

  async getTorrent (id: number | string): Promise<TransmissionTorrent> {
    const torrents = await this.getTorrentsBy({
      ids: [id]
    })
    return torrents[0]
  }

  async getTorrentsBy (filter: TransmissionTorrentFilterRules): Promise<TransmissionTorrent[]> {
    const args: TransmissionTorrentGetArguments = {
      fields: [
        'addedDate',
        'id',
        'hashString',
        'isFinished',
        'name',
        'percentDone',
        'uploadRatio',
        'downloadDir',
        'status',
        'totalSize',
        'leftUntilDone',
        'labels'
      ]
    }

    if (filter.ids) {
      args.ids = filter.ids
    }

    const resp = await this.request('torrent-get', args)
    const data:TransmissionTorrentGetResponse = resp.data
    let returnTorrents = data.arguments.torrents.map(s => this._normalizeTorrent(s))

    if (filter.complete) {
      returnTorrents = returnTorrents.filter(s => s.isCompleted)
    }

    return returnTorrents
  }

  async pauseTorrent (id: any): Promise<any> {
    const args: TransmissionTorrentBaseArguments = {
      ids: id
    }
    await this.request('torrent-stop', args)
    return true
  }

  async ping (): Promise<boolean> {
    try {
      const resp = await this.request('session-get')
      const data: TransmissionBaseResponse = resp.data
      return data.result === 'success'
    } catch (e) {
      return false
    }
  }

  async removeTorrent (id: number, removeData: boolean | undefined): Promise<boolean> {
    const args:TransmissionTorrentRemoveArguments = {
      ids: id,
      'delete-local-data': removeData
    }
    await this.request('torrent-remove', args)
    return true
  }

  async resumeTorrent (id: any): Promise<boolean> {
    const args: TransmissionTorrentBaseArguments = {
      ids: id
    }
    await this.request('torrent-start', args)
    return true
  }

  async request (method:TransmissionRequestMethod, args: any = {}): Promise<AxiosResponse> {
    try {
      return await axios.post(this.address, {
        method: method,
        arguments: args
      }, {
        auth: {
          username: this.config.username,
          password: this.config.password
        },
        headers: {
          'X-Transmission-Session-Id': this.sessionId
        },
        timeout: this.config.timeout
      })
    } catch (error) {
      if (error.response && error.response.status === 409) {
        this.sessionId = error.response.headers['x-transmission-session-id'] // lower cased header in axios
        return await this.request(method, args)
      } else {
        throw error
      }
    }
  }

  _normalizeTorrent (torrent: rawTorrent): TransmissionTorrent {
    const dateAdded = new Date(torrent.addedDate * 1000).toISOString()

    let state = TorrentState.unknown
    if (torrent.status === 6) {
      state = TorrentState.seeding
    } else if (torrent.status === 4) {
      state = TorrentState.downloading
    } else if (torrent.status === 0) {
      state = TorrentState.paused
    } else if (torrent.status === 2) {
      state = TorrentState.checking
    } else if (torrent.status === 3 || torrent.status === 5) {
      state = TorrentState.queued
    }

    return {
      id: torrent.id,
      infoHash: torrent.hashString,
      name: torrent.name,
      progress: torrent.percentDone,
      isCompleted: torrent.leftUntilDone < 1,
      ratio: torrent.uploadRatio,
      dateAdded: dateAdded,
      savePath: torrent.downloadDir,
      label: torrent.labels && torrent.labels.length ? torrent.labels[0] : undefined,
      state: state,
      totalSize: torrent.totalSize
    }
  }
}

export interface TransmissionBaseResponse {
  arguments: any;
  result: 'success' | string;
  tag?: number
}

export interface TransmissionTorrentGetResponse extends TransmissionBaseResponse {
  arguments: {
    torrents: rawTorrent[]
  }
}

export interface AddTorrentResponse extends TransmissionBaseResponse {
  arguments: {
    'torrent-added': {
      id: number;
      hashString: string;
      name: string;
    };
  };
}

export type TransmissionTorrentIds = number | Array<number | string> | 'recently-active'

export type TransmissionRequestMethod =
  'session-get' | 'session-stats' |
  'torrent-get' | 'torrent-add' | 'torrent-start' | 'torrent-stop' | 'torrent-remove'

export interface TransmissionAddTorrentOptions extends AddTorrentOptions {
  'download-dir': string,
  filename: string,
  metainfo: string,
  paused: boolean,

}

export interface TransmissionTorrent extends Torrent {
  id: number | string;
}

export interface TransmissionTorrentFilterRules extends TorrentFilterRules {
  ids?: TransmissionTorrentIds;
}

export interface TransmissionArguments {

}

export interface TransmissionTorrentBaseArguments extends TransmissionArguments {
  ids?: TransmissionTorrentIds
}

export interface TransmissionTorrentGetArguments extends TransmissionTorrentBaseArguments {
  fields: TransmissionTorrentsField[]
}

export interface TransmissionTorrentRemoveArguments extends TransmissionTorrentBaseArguments {
  'delete-local-data'?: boolean
}

export interface TransmissionTorrentClientConfig extends TorrentClientConfig {
  username: string;
  password: string;
}

// 这里只写出了部分我们需要的
export interface rawTorrent {
  addedDate: number,
  id: number,
  hashString: string,
  isFinished: boolean,
  name: string,
  percentDone: number,
  uploadRatio: number,
  downloadDir: string,
  status: number,
  totalSize: number,
  leftUntilDone: number,
  labels: string[]
}

export type TransmissionTorrentsField =
  'activityDate'
  | 'addedDate'
  | 'bandwidthPriority'
  | 'comment'
  | 'corruptEver'
  | 'creator'
  | 'dateCreated'
  | 'desiredAvailable'
  | 'doneDate'
  | 'downloadDir'
  | 'downloadedEver'
  | 'downloadLimit'
  | 'downloadLimited'
  | 'editDate'
  | 'error'
  | 'errorString'
  | 'eta'
  | 'etaIdle'
  | 'files'
  | 'fileStats'
  | 'hashString'
  | 'haveUnchecked'
  | 'haveValid'
  | 'honorsSessionLimits'
  | 'id'
  | 'isFinished'
  | 'isPrivate'
  | 'isStalled'
  | 'labels'
  | 'leftUntilDone'
  | 'magnetLink'
  | 'manualAnnounceTime'
  | 'maxConnectedPeers'
  | 'metadataPercentComplete'
  | 'name'
  | 'peer-limit'
  | 'peers'
  | 'peersConnected'
  | 'peersFrom'
  | 'peersGettingFromUs'
  | 'peersSendingToUs'
  | 'percentDone'
  | 'pieces'
  | 'pieceCount'
  | 'pieceSize'
  | 'priorities'
  | 'queuePosition'
  | 'rateDownload (B/s)'
  | 'rateUpload (B/s)'
  | 'recheckProgress'
  | 'secondsDownloading'
  | 'secondsSeeding'
  | 'seedIdleLimit'
  | 'seedIdleMode'
  | 'seedRatioLimit'
  | 'seedRatioMode'
  | 'sizeWhenDone'
  | 'startDate'
  | 'status'
  | 'trackers'
  | 'trackerStats'
  | 'totalSize'
  | 'torrentFile'
  | 'uploadedEver'
  | 'uploadLimit'
  | 'uploadLimited'
  | 'uploadRatio'
  | 'wanted'
  | 'webseeds'
  | 'webseedsSendingToUs'
