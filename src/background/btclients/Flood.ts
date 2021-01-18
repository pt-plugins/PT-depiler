/**
 *
 * 注意：Flood目前有两个分支，且部分路由存在差异
 *  - https://github.com/Flood-UI/flood/tree/master/server/routes  (legacy)
 *  - https://github.com/jesec/flood/tree/master/server/routes/api
 *
 * 实现时应尽可能同时匹配到两个
 */

import {
  AddTorrentOptions, CustomPathDescription,
  Torrent,
  TorrentClient,
  TorrentClientConfig,
  TorrentClientMetaData,
  TorrentFilterRules,
  TorrentState
} from '@/shared/interfaces/btclients'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import urljoin from 'url-join'
import { intersection } from 'lodash-es'
import { Buffer } from 'buffer'

export const clientConfig: TorrentClientConfig = {
  type: 'Flood',
  name: 'Flood',
  uuid: '9831970f-6c10-4b02-a3a0-eb07062e5e69',
  address: 'http://172.0.0.1:3000',
  username: '',
  password: '',
  timeout: 60 * 1e3
}

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: 'Flood 是 ruTorrent 的另一款基于Node的Web前端面板，界面美观，加载速度快',
  warning: [
    '同时兼容 Flood 原版以及 jesec修改版',
    '如果当前已登录Flood面板，请退出登陆后再做连接性测试',
    '目前无法准确获得Flood的种子操作（添加、启动、暂停、删除）是否成功。'
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description: CustomPathDescription
    }
  }
}

type FloodApiType = 'legacy' | 'jesec'
type FloodApiEndpoint = 'verify' | 'authenticate'
  | 'connection-test'
  | 'getTorrents'
  | 'addTorrentByUrl' | 'addTorrentByFile'
  | 'startTorrent' | 'stopTorrent' | 'deleteTorrent'

const FloodApiEndpointMap: {
  [key in FloodApiType]: {
    [key in FloodApiEndpoint]: string
  }
} = {
  jesec: {
    verify: '/api/auth/verify',
    authenticate: '/api/auth/authenticate',
    'connection-test': '/api/client/connection-test',
    getTorrents: '/api/torrents',
    addTorrentByUrl: '/api/torrents/add-urls',
    addTorrentByFile: '/api/torrents/add-files',
    startTorrent: '/api/torrents/start',
    stopTorrent: '/api/torrents/stop',
    deleteTorrent: '/api/torrents/delete'
  },
  legacy: {
    verify: '/auth/verify',
    authenticate: '/auth/authenticate',
    'connection-test': '/api/client/connection-test',
    getTorrents: '', // Legacy使用EventSource获取，故此处留空即可
    addTorrentByUrl: '/api/client/add',
    addTorrentByFile: '/api/client/add-files',
    startTorrent: '/api/client/start',
    stopTorrent: '/api/client/stop',
    deleteTorrent: '/api/client/torrents/delete'
  }
}

/**
 * 原版的种子情况需要使用 EventSource获取
 * 通过获取
 *
 * @param path
 * @param event
 */
function legacyActivityStreamWrapper (path: string, event: string): Promise<any> {
  return new Promise<any>((resolve) => {
    const sse = new EventSource(path)
    sse.addEventListener(event, (evt: any) => {
      resolve(evt.data)
      sse.close()
    })
  })
}

type TorrentStatus = ''
  | 'checking' | 'seeding' | 'complete' | 'downloading' | 'stopped' | 'error' | 'inactive' | 'active'
  // Legacy
  | 'ch' | 'sd' | 'p' | 'c' | 'd' | 'ad' | 'au' | 's' | 'e' | 'i' | 'a';

enum TorrentPriority {
  DO_NOT_DOWNLOAD = 0,
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
}

interface TorrentProperties {
  bytesDone: number;
  dateAdded: number;
  dateCreated: number;
  directory: string;
  downRate: number;
  downTotal: number;
  // Torrent ETA (seconds), -1 means infinity
  eta: number;
  // Upper-case hash of info section of the torrent
  hash: string;
  isComplete: boolean;
  isPrivate: boolean;
  // If initial seeding mode (aka super seeding) is enabled
  isInitialSeeding: boolean;
  // If sequential download is enabled
  isSequential: boolean;
  message: string;
  name: string;
  peersConnected: number;
  peersTotal: number;
  percentComplete: number;
  priority: TorrentPriority;
  ratio: number;
  seedsConnected: number;
  seedsTotal: number;
  sizeBytes: number;
  status: TorrentStatus[];
  tags: Array<string>;
  trackerURIs: Array<string>;
  upRate: number;
  upTotal: number;
}

interface TorrentList {
  [hash: string]: TorrentProperties;
}

interface TorrentListSummaryResponse {
  id: number;
  torrents: TorrentList;
}

// noinspection JSUnusedGlobalSymbols
export default class Flood implements TorrentClient {
  readonly version = 'v0.0.1';
  readonly config: TorrentClientConfig;

  private apiType?: FloodApiType;

  constructor (options: Partial<TorrentClientConfig> = {}) {
    this.config = { ...clientConfig, ...options }
  }

  private async getEndPointType (): Promise<FloodApiType> {
    if (this.apiType == null) {
      try {
        await axios.get(FloodApiEndpointMap.legacy.verify, {
          baseURL: this.config.address,
          timeout: this.config.timeout
        })
        this.apiType = 'legacy'
      } catch (error) {
        this.apiType = 'jesec'
      }
    }
    return this.apiType as FloodApiType
  }

  private async getEndPointUrl (endpoint: FloodApiEndpoint): Promise<string> {
    const endPointType = await this.getEndPointType()
    return FloodApiEndpointMap[endPointType][endpoint]
  }

  async request (endpoint: FloodApiEndpoint, config: AxiosRequestConfig = {}): Promise<AxiosResponse> {
    const endPointUrl = await this.getEndPointUrl(endpoint)

    try {
      return await axios.request({
        baseURL: this.config.address,
        url: endPointUrl,
        timeout: this.config.timeout,
        ...config
      })
    } catch (e) {
      // not authenticated or token expired
      if ((e as AxiosError).response?.status === 401 && endpoint !== 'authenticate') {
        if (await this.login()) {
          return await this.request(endpoint, config)
        }
      }

      throw e
    }
  }

  private async login (): Promise<boolean> {
    try {
      const req = await this.request('authenticate', {
        method: 'post',
        data: {
          username: this.config.username,
          password: this.config.password
        }
      })

      return req.data.success === true
    } catch (e) {
      return false
    }
  }

  async ping (): Promise<boolean> {
    try {
      const req = await this.request('connection-test')
      return (req.data as { isConnect: boolean }).isConnect
    } catch (e) {
      return false
    }
  }

  async addTorrent (url: string, options: Partial<AddTorrentOptions> = {}): Promise<boolean> {
    let postData: any = {
      destination: '',
      tags: []
    }

    if (options.savePath) {
      postData.destination = options.savePath
    }

    if (options.addAtPaused) {
      postData.start = !options.addAtPaused
    }

    if (options.label) {
      postData.tags = [options.label]
    }

    // 处理链接
    if (url.startsWith('magnet:') || !options.localDownload) {
      postData.urls = [url]

      await this.request('addTorrentByUrl', {
        method: 'post',
        data: postData
      })
    } else {
      const endPointType = await this.getEndPointType()
      if (endPointType === 'jesec') {
        const req = await axios.get(url, {
          responseType: 'arraybuffer'
        })
        postData.files = [Buffer.from(req.data, 'binary').toString('base64')]
      } else {
        const formData = new FormData()

        Object.keys(postData).forEach(key => {
          const value = postData[key]
          formData.append(key, value)
        })

        const req = await axios.get(url, {
          responseType: 'blob'
        })
        formData.append('torrents', req.data, 'file.torrent')
        postData = formData // 覆写postData
      }

      await this.request('addTorrentByFile', {
        method: 'post',
        data: postData
      })
    }

    return true
  }

  async getAllTorrents (): Promise<Torrent[]> {
    const endPointType = await this.getEndPointType()

    let rawTorrents: TorrentList
    if (endPointType === 'legacy') {
      await this.ping()

      const r = await legacyActivityStreamWrapper(
        urljoin(this.config.address, '/api/activity-stream'),
        'TORRENT_LIST_FULL_UPDATE'
      )

      rawTorrents = JSON.parse(r) as TorrentList // Example: https://pastebin.com/cCNsMRdx
    } else {
      const req = await this.request('getTorrents')
      const reqData: TorrentListSummaryResponse = req.data
      rawTorrents = reqData.torrents
    }

    return Object.keys(rawTorrents).map((infoHash:string) => {
      const rawTorrent = rawTorrents[infoHash]

      let state = TorrentState.unknown

      if (intersection(rawTorrent.status, ['downloading', 'd', 'ad']).length > 0) {
        state = TorrentState.downloading
      } else if (intersection(rawTorrent.status, ['seeding', 'sd', 'au']).length > 0) {
        state = TorrentState.seeding
      } else if (intersection(rawTorrent.status, ['stopped', 'p', 's']).length > 0) {
        state = TorrentState.paused
      } else if (intersection(rawTorrent.status, ['ch', 'checking']).length > 0) {
        state = TorrentState.checking
      } else if (intersection(rawTorrent.status, ['error', 'e']).length > 0) {
        state = TorrentState.error
      }

      return {
        id: infoHash.toLowerCase(),
        infoHash,
        name: rawTorrent.name,
        dateAdded: new Date(rawTorrent.dateAdded * 1000).toISOString(),
        state,
        isCompleted: rawTorrent.isComplete,
        progress: rawTorrent.percentComplete,
        label: rawTorrent.tags && rawTorrent.tags.length > 1 ? rawTorrent.tags[0] : undefined,
        savePath: rawTorrent.directory,
        totalSize: rawTorrent.sizeBytes,
        ratio: rawTorrent.ratio,
        uploadSpeed: rawTorrent.upRate,
        downloadSpeed: rawTorrent.downRate,
        totalUploaded: rawTorrent.upTotal,
        totalDownloaded: rawTorrent.downTotal
      } as Torrent
    }) as Torrent[]
  }

  async getTorrent (id: any): Promise<Torrent> {
    return (await this.getTorrentsBy({ ids: id }))[0]
  }

  async getTorrentsBy (filter: TorrentFilterRules): Promise<Torrent[]> {
    let torrents = await this.getAllTorrents()
    if (filter.ids) {
      const filterIds = Array.isArray(filter.ids) ? filter.ids : [filter.ids]
      torrents = torrents.filter(t => {
        return filterIds.includes(t.infoHash)
      })
    }

    if (filter.complete) {
      torrents = torrents.filter(t => t.isCompleted)
    }

    return torrents
  }

  async pauseTorrent (id: any): Promise<boolean> {
    await this.request('stopTorrent', {
      method: 'post',
      data: {
        hashes: [id]
      }
    })
    return true
  }

  async resumeTorrent (id: any): Promise<boolean> {
    await this.request('startTorrent', {
      method: 'post',
      data: {
        hashes: [id]
      }
    })
    return true
  }

  async removeTorrent (id: any, removeData: boolean = false): Promise<boolean> {
    const endPointType = await this.getEndPointType()
    const hashFieldKey = endPointType === 'jesec' ? 'hashes' : 'hash'

    const postData: any = { deleteData: removeData }
    postData[hashFieldKey] = [id]

    await this.request('deleteTorrent', {
      method: 'post',
      data: postData
    })

    return true
  }
}
