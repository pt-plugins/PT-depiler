/**
 * @see https://github.com/bittorrent/webui/blob/master/webui.js
 * @see https://github.com/bittorrent/webui/wiki/Web-UI-API
 */
import {
  AddTorrentOptions,
  Torrent,
  TorrentClient,
  TorrentClientConfig,
  TorrentClientMetaData, TorrentFilterRules, TorrentState
} from '@/interfaces/btclients'
import urljoin from 'url-join'
import axios from 'axios'

export const defaultUTorrentConfig: TorrentClientConfig = {
  type: 'utorrent',
  name: 'µTorrent',
  uuid: '74bcc281-244f-4bf1-9013-eebb0a833d32',
  address: 'http://127.0.0.1:8080/gui/',
  username: 'admin',
  password: '',
  timeout: 60 * 1e3
}

export const UTorrentMetaData: TorrentClientMetaData = {
  description: 'μTorrent 是一个小巧强劲，全功能，用C++编写，支持Windows、Mac OS X和GNU/Linux平台的免费BitTorrent客户端。',
  warning: [
    '由于 µTorrent Web API 接口不统一，当前仅支持 µTorrent Windows 版本，Mac 版本测试不可用，其他系统未知。',
    '使用前请确认 WebUI 已安装并开启'
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description: '仅支持 µTorrent 3.x.x 及以上版本；<br /><br />1. 在 µTorrent 的 设置 -> 高级 -> 网页界面 添加一个下载目录，如：D:\\download\\ <br />2. 在助手里添加目录列表（仅支持相对路径），如：music\\ <br />3. 最终数据的保存目录为：D:\\download\\music\\'
    }
  }
}

const STATE_STARTED = 1
const STATE_CHECKING = 2
const STATE_ERROR = 16
const STATE_PAUSED = 32
const STATE_QUEUED = 64

/**
 * torrent list, its a huge tuple
 * HASH (string)
 * STATUS* (integer)
 * NAME (string)
 * SIZE (integer in bytes)
 * PERCENT PROGRESS (integer in per mils)
 * DOWNLOADED (integer in bytes)
 * UPLOADED (integer in bytes)
 * RATIO (integer in per mils)
 * UPLOAD SPEED (integer in bytes per second)
 * DOWNLOAD SPEED (integer in bytes per second)
 * ETA (integer in seconds)
 * LABEL (string)
 * PEERS CONNECTED (integer)
 * PEERS IN SWARM (integer)
 * SEEDS CONNECTED (integer)
 * SEEDS IN SWARM (integer)
 * AVAILABILITY (integer in 1/65536ths)
 * TORRENT QUEUE ORDER (integer)
 * REMAINING (integer in bytes)
 */
type TorrentData = [
  string,
  number,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  string,
  string,
  string,
  string,
  number,
  number,
  string,
  string,
  number,
  string,
  boolean,
];

interface BaseUtorrentResponse {
  build: number;
}

interface TorrentListResponse extends BaseUtorrentResponse {
  torrents: TorrentData[];
  /**
   * array of types containing label name and count
   */
  label: [string, number][];
  /**
   * CACHE ID
   */
  torrentc: string;
  rssfeeds: any[];
  rssfilters: any[];
}

export default class UTorrent implements TorrentClient {
  readonly version = 'v0.0.1';
  readonly config: TorrentClientConfig;

  readonly address: string;

  private _sid: string | null = null;

  constructor (options: Partial<TorrentClientConfig>) {
    this.config = { ...defaultUTorrentConfig, ...options }

    // 修正GUI地址
    this.address = this.config.address
    if (this.address.indexOf('gui') === -1) {
      this.address = urljoin(this.address, '/gui/') // 注意，最后一个slashes一定要存在
    } else if (!/\/gui\/$/.exec(this.address)) {
      this.address = this.address + '/'
    }
  }

  private async getSessionId ():Promise<string> {
    if (this._sid === null) {
      await this.login()
    }
    return this._sid as string
  }

  private async login (): Promise<boolean> {
    const loginUri = urljoin(this.address, '/token.html')

    const req = await axios.get(loginUri, {
      params: {
        t: Date.now().toString()
      },
      auth: {
        username: this.config.username,
        password: this.config.password
      },
      timeout: this.config.timeout
    })

    const match = />([^<]+)</.exec(req.data)
    if (match) {
      this._sid = match[match.length - 1]
      return true
    }

    return false
  }

  async ping (): Promise<boolean> {
    return await this.login()
  }

  // 除"登录"和"添加种子"外的所有接口方法都走该方法
  async request<T extends object> (action: string, params: {
    [key: string]: any
  } = {}): Promise<T> {
    const _sid = await this.getSessionId()

    if (action) {
      params.action = action
    }

    return (await axios.get(this.address, {
      params: {
        token: _sid,
        t: Date.now().toString(),
        ...params
      },
      responseType: 'json',
      timeout: this.config.timeout
    })).data
  }

  async addTorrent (url: string, options: Partial<AddTorrentOptions> = {}): Promise<boolean> {
    const _sid = await this.getSessionId()

    let formData: FormData | null = new FormData()
    const params: {[key: string]: any} = {
      download_dir: 0,
      token: _sid,
      path: options.savePath ? options.savePath : ''
    }

    if (url.startsWith('magnet:') || !options.localDownload) {
      formData = null
      params.action = 'add-url'
      params.s = url
    } else if (options.localDownload) {
      params.action = 'add-file'
      const req = await axios.get(url, {
        responseType: 'blob'
      })
      formData.append('torrent_file', req.data, 'file.torrent')
    }

    await axios.post(this.address, formData, {
      params: params,
      auth: {
        username: this.config.username,
        password: this.config.password
      },
      timeout: this.config.timeout
    })

    // TODO 增加 options.addAtPaused 支持

    return true
  }

  async getAllTorrents (): Promise<Torrent[]> {
    const req = await this.request<TorrentListResponse>('', {
      list: 1
    })

    return req.torrents.map((torrent: TorrentData) => {
      const torrentState: number = torrent[1]
      const progress: number = torrent[4] / 100
      const done = progress >= 100
      const isCompleted = progress >= 100

      let state = TorrentState.unknown
      if (torrentState & STATE_PAUSED) {
        state = TorrentState.paused
      } else if (torrentState & STATE_STARTED) {
        if (done) {
          state = TorrentState.seeding
        } else {
          state = TorrentState.downloading
        }
      } else if (torrentState & STATE_CHECKING) {
        state = TorrentState.checking
      } else if (torrentState & STATE_ERROR) {
        state = TorrentState.error
      } else if (torrentState & STATE_QUEUED) {
        state = TorrentState.queued
      } else if (done) {
        state = TorrentState.paused
      } else {
        state = TorrentState.paused
      }

      return {
        id: torrent[0].toLowerCase(),
        infoHash: torrent[0],
        name: torrent[2],
        state,
        dateAdded: new Date(torrent[23] * 1e3).toISOString(),
        isCompleted,
        progress,
        label: torrent[11],
        savePath: torrent[26],
        totalSize: torrent[3],
        ratio: torrent[7] / 1000,
        uploadSpeed: torrent[8],
        downloadSpeed: torrent[9],
        totalUploaded: torrent[6],
        totalDownloaded: torrent[5]
      } as Torrent
    }) as Torrent[]
  }

  async getTorrent (id: any): Promise<Torrent> {
    return (await this.getTorrentsBy({ ids: id }))[0]
  }

  async getTorrentsBy (filter: TorrentFilterRules): Promise<Torrent[]> {
    let torrentList = await this.getAllTorrents()
    if (filter.ids) {
      const filterIds : string[] = typeof filter.ids === 'string' ? [filter.ids] : filter.ids
      torrentList = torrentList.filter(t => filterIds.includes(t.id as string))
    }

    if (filter.complete) {
      torrentList = torrentList.filter(t => t.isCompleted)
    }

    return torrentList
  }

  // 注意：uTorrent的pause, resume, remove均直接返回true，因为接口没返回具体成功没成功
  async pauseTorrent (id: string): Promise<boolean> {
    await this.request<BaseUtorrentResponse>('pause', {
      hash: id
    })
    return true
  }

  async resumeTorrent (id: string): Promise<boolean> {
    await this.request<BaseUtorrentResponse>('start', {
      hash: id
    })
    return true
  }

  async removeTorrent (id: string, removeData: boolean = true): Promise<boolean> {
    const action = removeData ? 'removedatatorrent' : 'removetorrent'
    await this.request<BaseUtorrentResponse>(action, {
      hash: id
    })
    return true
  }
}
