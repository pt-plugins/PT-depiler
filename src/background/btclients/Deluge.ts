/**
 * @see https://deluge.readthedocs.io/en/develop/reference/index.html
 */
import {
  AddTorrentOptions,
  Torrent,
  TorrentClient,
  TorrentClientBaseConfig, TorrentClientMetaData,
  TorrentFilterRules, TorrentState
} from '@/interfaces/btclients'
import urljoin from 'url-join'
import { Buffer } from 'buffer'
import axios, { AxiosResponse } from 'axios'

// 定义最基础的配置信息
export const defaultDelugeConfig: TorrentClientBaseConfig = {
  type: 'deluge',
  name: 'Deluge',
  uuid: '4e97f300-0a69-4c5b-ba8b-c0ac7031607e',
  address: 'http://localhost:8112/',
  password: '',
  timeout: 60 * 1e3
}

// 定义Deluge的介绍文字
export const DelugeMetaData: TorrentClientMetaData = {
  description: 'Deluge 是一个通过PyGTK建立图形界面的BitTorrent客户端',
  warning: [
    '仅支持Deluge Web，非Deluge Daemon的直接支持，具体原因请见 issue #207',
    '注意：由于 Deluge 验证机制限制，第一次测试连接成功后，后续测试无论密码正确与否都会提示成功。'
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description: '当前目录列表配置是指定硬盘上的绝对路径，如 /volume1/music/ 或 D:\\download\\music\\'
    }
  }
}

type DelugeMethod =
  'auth.login' | 'web.update_ui' | 'core.get_torrents_status' |
  'core.add_torrent_url' | 'core.add_torrent_file' |
  'core.remove_torrent' | 'core.pause_torrent' | 'core.resume_torrent'

interface DelugeDefaultResponse {
  /**
   * mostly usless id that increments with every request
   */
  id: number;
  error: null | string;
  result: any;
}

type DelugeTorrentField =
  'comment'
  | 'active_time'
  | 'is_seed'
  | 'hash'
  | 'upload_payload_rate'
  | 'move_completed_path'
  | 'private'
  | 'total_payload_upload'
  | 'paused'
  | 'seed_rank'
  | 'seeding_time'
  | 'max_upload_slots'
  | 'prioritize_first_last'
  | 'distributed_copies'
  | 'download_payload_rate'
  | 'message'
  | 'num_peers'
  | 'max_download_speed'
  | 'max_connections'
  | 'compact'
  | 'ratio'
  | 'total_peers'
  | 'total_size'
  | 'total_wanted'
  | 'state'
  | 'file_priorities'
  | 'max_upload_speed'
  | 'remove_at_ratio'
  | 'tracker'
  | 'save_path'
  | 'progress'
  | 'time_added'
  | 'tracker_host'
  | 'total_uploaded'
  | 'files'
  | 'total_done'
  | 'num_pieces'
  | 'tracker_status'
  | 'total_seeds'
  | 'move_on_completed'
  | 'next_announce'
  | 'stop_at_ratio'
  | 'file_progress'
  | 'move_completed'
  | 'piece_length'
  | 'all_time_download'
  | 'move_on_completed_path'
  | 'num_seeds'
  | 'peers'
  | 'name'
  | 'trackers'
  | 'total_payload_download'
  | 'is_auto_managed'
  | 'seeds_peers_ratio'
  | 'queue'
  | 'num_files'
  | 'eta'
  | 'stop_ratio'
  | 'is_finished'
  | 'label' // if they don't have the label plugin it shouldn't fail

interface DelugeRawTorrent {
  hash: string,
  name: string,
  progress: number,
  ratio: number,
  'time_added': number,
  'save_path': string,
  label?: string,
  state: 'Downloading' | 'Seeding' | 'Active' | 'Paused' | 'Queued' | 'Checking' | 'Error',
  'total_size': number,
  'upload_payload_rate': number,
  'download_payload_rate': number,
  'total_uploaded': number;
  'total_done': number;
}

interface DelugeTorrentFilterRules extends TorrentFilterRules {
  hash?: string,
  state?: string
}

interface DelugeBooleanStatus extends DelugeDefaultResponse {
  result: boolean;
}

// 定义Deluge的实例
export default class Deluge implements TorrentClient {
  readonly version = 'v0.1.0';
  readonly config: TorrentClientBaseConfig;

  private readonly address: string;
  private _msgId: number;
  private isLogin: boolean = false

  private torrentRequestField: DelugeTorrentField[]= [
    'hash',
    'name',
    'progress',
    'ratio',
    'time_added',
    'save_path',
    'label',
    'state',
    'total_size'
  ]

  constructor (options: Partial<TorrentClientBaseConfig>) {
    this.config = { ...defaultDelugeConfig, ...options }
    this._msgId = 0

    // 修正服务器地址
    let address = this.config.address
    if (address.indexOf('json') === -1) {
      address = urljoin(address, '/json')
    }
    this.address = address
  }

  async ping (): Promise<boolean> {
    return await this.login()
  }

  async addTorrent (url: string, options: Partial<AddTorrentOptions> = {}): Promise<boolean> {
    const delugeOptions = {
      add_paused: false
    }

    if (options.addAtPaused) {
      delugeOptions.add_paused = options.addAtPaused
    }
    if (options.savePath) {
      // @ts-ignore
      delugeOptions.download_location = options.savePath
    }

    // 由于Deluge添加链接和种子的方法名不一样，分开处理
    let method: 'core.add_torrent_file' | 'core.add_torrent_url'
    let params: any
    if (options.localDownload) { // 文件 add_torrent_file
      method = 'core.add_torrent_file'

      // FIXME 使用统一的种子文件获取方法获取
      const req = await axios.get(url, {
        responseType: 'arraybuffer'
      })
      const metainfo = Buffer.from(req.data, 'binary').toString('base64')
      params = ['', metainfo, delugeOptions]
    } else { // 链接 add_torrent_url
      method = 'core.add_torrent_url'
      params = [url, delugeOptions]
    }

    try {
      const res = await this.request(method, params)
      const data: DelugeDefaultResponse = res.data
      return data.result !== null
    } catch (e) {
      return false
    }
  }

  async getAllTorrents (): Promise<Torrent[]> {
    return await this.getTorrentsBy({})
  }

  async getTorrent (id: string): Promise<Torrent> {
    return (await this.getTorrentsBy({ ids: id }))[0]
  }

  async getTorrentsBy (filter: DelugeTorrentFilterRules): Promise<Torrent[]> {
    if (filter.ids) {
      filter.hash = filter.ids
      delete filter.ids
    }

    if (filter.complete) {
      filter.state = 'Seeding'
      delete filter.complete
    }

    const req = await this.request('core.get_torrents_status', [
      filter,
      this.torrentRequestField
    ])

    const data: DelugeDefaultResponse = req.data

    // @ts-ignore
    return Object.values(data.result).map((torrent: DelugeRawTorrent) => {
      const dateAdded = new Date(torrent.time_added * 1000).toISOString()
      // normalize state to enum
      let state = TorrentState.unknown
      if (Object.keys(TorrentState).includes(torrent.state.toLowerCase())) {
        state = TorrentState[torrent.state.toLowerCase() as keyof typeof TorrentState]
      }

      return {
        dateAdded: dateAdded,
        id: torrent.hash,
        infoHash: torrent.hash,
        isCompleted: torrent.progress >= 100,
        name: torrent.name,
        progress: torrent.progress,
        ratio: torrent.ratio,
        savePath: torrent.save_path,
        state: state,
        totalSize: torrent.total_size,
        uploadSpeed: torrent.upload_payload_rate,
        downloadSpeed: torrent.download_payload_rate,
        totalUploaded: torrent.total_uploaded,
        totalDownloaded: torrent.total_done
      } as Torrent
    })
  }

  async pauseTorrent (id: any): Promise<boolean> {
    try {
      const req = await this.request('core.pause_torrent', [id])
      const data: DelugeBooleanStatus = req.data
      return data.result
    } catch (e) {
      return false
    }
  }

  async removeTorrent (id: string, removeData: boolean = false): Promise<boolean> {
    try {
      const req = await this.request('core.remove_torrent', [id, removeData])
      const data: DelugeBooleanStatus = req.data
      return data.result
    } catch (e) {
      return false
    }
  }

  async resumeTorrent (id: any): Promise<boolean> {
    try {
      const req = await this.request('core.resume_torrent', [id])
      const data: DelugeBooleanStatus = req.data
      return data.result
    } catch (e) {
      return false
    }
  }

  private async login (): Promise<boolean> {
    try {
      const res = await this.request('auth.login', [this.config.password])
      const data: DelugeBooleanStatus = res.data
      this.isLogin = data.result
      return this.isLogin
    } catch (e) {
      return false
    }
  }

  private async request (method: DelugeMethod, params: any[]): Promise<AxiosResponse> {
    // 防止循环调用
    if (!this.isLogin && method !== 'auth.login') {
      await this.login()
    }

    return await axios.post(this.address, {
      id: this._msgId++,
      method: method,
      params: params
    }, {
      headers: {
        'content-type': 'application/json'
      }
    })
  }
}
