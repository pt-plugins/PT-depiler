/**
 * 使用 ws + rpc-secret 形式访问，
 * 原因在于如果发送metadata的话，使用 http 会空返回，
 * 但是允许用户填入 http:// 开头的地址
 */
import {
  AddTorrentOptions,
  CustomPathDescription,
  Torrent,
  TorrentClient,
  TorrentClientBaseConfig,
  TorrentClientMetaData,
  TorrentFilterRules,
  TorrentState
} from '@/shared/interfaces/btclients'
import urljoin from 'url-join'
import axios from 'axios'
import { Buffer } from 'buffer'
import { v4 as uuidv4 } from 'uuid'

export const clientConfig: TorrentClientBaseConfig = {
  type: 'Aria2',
  name: 'Aria2',
  uuid: 'eea06ce1-3f86-4b9f-a411-f39d97ce8462',
  address: 'http://localhost:6800/jsonrpc',
  password: '',
  timeout: 60 * 1e3
}

export const clientMetaData: TorrentClientMetaData = {
  description: 'Aria2是一款自由、跨平台命令行界面的下载管理器',
  warning: [
    '使用 WebSocket + `rpc-secret` 形式连接，请设置好 `rpc-secret` 配置项',
    '不支持使用用户名+密码的认证方式'
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description: CustomPathDescription
    }
  }
}

type METHODS = 'aria2.addUri' | 'aria2.addTorrent' | 'aria2.getPeers' | 'aria2.addMetalink' | 'aria2.remove' | 'aria2.pause' | 'aria2.forcePause' | 'aria2.pauseAll' | 'aria2.forcePauseAll' | 'aria2.unpause' | 'aria2.unpauseAll' | 'aria2.forceRemove' | 'aria2.changePosition' | 'aria2.tellStatus' | 'aria2.getUris' | 'aria2.getFiles' | 'aria2.getServers' | 'aria2.tellActive' | 'aria2.tellWaiting' | 'aria2.tellStopped' | 'aria2.getOption' | 'aria2.changeUri' | 'aria2.changeOption' | 'aria2.getGlobalOption' | 'aria2.changeGlobalOption' | 'aria2.purgeDownloadResult' | 'aria2.removeDownloadResult' | 'aria2.getVersion' | 'aria2.getSessionInfo' | 'aria2.shutdown' | 'aria2.forceShutdown' | 'aria2.getGlobalStat' | 'aria2.saveSession' | 'system.multicall' | 'system.listMethods' | 'system.listNotifications'

type multiCallParams = {
  methodName: METHODS,
  params: any[]
}[]

interface jsonRPCResponse <Data> {
  id: string,
  jsonrpc: '2.0',
  result: Data,
  error?: {code: number, message: string}
}

interface rawTask {
  bitfield: string,
  completedLength: number,
  connections: `${1 | 0}`,
  dir: string,
  downloadSpeed: number,
  files: {
    completedLength: number,
    index:number,
    length: number,
    path: string,
    selected: string,
    uris: {
      status:string,
      url: string
    }[]
  }[],
  gid: string,
  numPieces: number,
  pieceLength: number,
  status: 'active' | // active for currently downloading/seeding downloads.
    'waiting' | // waiting for downloads in the queue; download is not started.
    'paused' | // paused for paused downloads.
    'error' | // error for downloads that were stopped because of error.
    'complete' | // complete for stopped and completed downloads.
    'removed', // removed for the downloads removed by user.
  totalLength: number,
  uploadLength: number,
  uploadSpeed: number,

  // If it is a bittorrent
  bittorrent?: {
    announceList: string[][],
    comment: string,
    creationDate: number,
    info: {
      name: string,
    },
    mode: 'single'|'multi'
  }
  infoHash?: string,
  seeder?: string,
  numSeeders?: number
}

function parseRawTorrent (rawTask: rawTask): Torrent {
  const progress = (rawTask.completedLength / rawTask.totalLength) || 0
  let state = TorrentState.unknown
  switch (rawTask.status) {
    case 'active':
      state = progress >= 100 ? TorrentState.seeding : TorrentState.downloading
      break

    case 'error':
    case 'removed':
      state = TorrentState.error
      break

    case 'complete':
    case 'paused':
      state = TorrentState.paused
      break

    case 'waiting':
      state = TorrentState.queued
      break
  }

  return {
    id: rawTask.gid,
    infoHash: rawTask.infoHash!,
    name: rawTask.bittorrent!.info.name,
    progress,
    isCompleted: progress >= 100,
    ratio: (rawTask.uploadLength / rawTask.totalLength) || 0,
    dateAdded: 0, // Aria2 不返回添加时间
    savePath: rawTask.dir,
    state,
    totalSize: Number(rawTask.totalLength),
    totalUploaded: Number(rawTask.uploadLength),
    totalDownloaded: Number(rawTask.completedLength),
    uploadSpeed: Number(rawTask.uploadSpeed),
    downloadSpeed: Number(rawTask.downloadSpeed)
  } as Torrent
}

export default class Aria2 implements TorrentClient {
  readonly version = 'v0.1.0';
  readonly config: TorrentClientBaseConfig;

  private _wsClient: WebSocket;

  constructor (options: Partial<TorrentClientBaseConfig>) {
    this.config = { ...clientConfig, ...options }

    // 修正服务器地址
    let address = this.config.address
    if (address.indexOf('jsonrpc') === -1) {
      address = urljoin(address, '/jsonrpc')
    }
    this.config.address = address

    // https -> wss , http -> ws
    this._wsClient = new WebSocket(address.replace(/^http/, 'ws'))
  }

  private async methodSend <T> (methodName: METHODS, params: any[] = []): Promise<jsonRPCResponse<T>> {
    return new Promise((resolve, reject) => {
      let postParams
      if (methodName === 'system.multicall') {
        (params as multiCallParams).forEach(x => {
          x.params = [`token:${this.config.password}`, ...x.params]
        })

        postParams = [params]
      } else {
        postParams = [`token:${this.config.password}`, ...params]
      }

      const msgId = uuidv4()

      this._wsClient.addEventListener('message', (event) => {
        const data: jsonRPCResponse<T> = JSON.parse(event.data)
        if (data.id === msgId) { // 保证消息一致性
          resolve(data)
        } else if (data.error) {
          reject(new Error(data.error?.message || 'WS ERROR'))
        }
      })

      this._wsClient.send(JSON.stringify({ method: methodName, id: msgId, params: postParams }))
    })
  }

  async ping (): Promise<boolean> {
    try {
      const { result: pingData } = await this.methodSend<{ version: string, enabledFeatures: string[] }>('aria2.getVersion')
      return pingData.version.includes('.')
    } catch (e) {
      return false
    }
  }

  async addTorrent (url: string, options: Partial<AddTorrentOptions> = {}): Promise<boolean> {
    const addOption: any = {
      pause: options.addAtPaused ?? false
    }

    if (options.savePath) {
      addOption.dir = options.savePath
    }

    let method: 'aria2.addUri' | 'aria2.addTorrent'
    let params: any
    if (url.startsWith('magnet:') || !options.localDownload) {
      // 链接 add_torrent_url
      method = 'aria2.addUri'
      params = [[url], addOption]
    } else { // 文件 add_torrent_file
      method = 'aria2.addTorrent'

      const req = await axios.get(url, {
        responseType: 'arraybuffer'
      }) // FIXME 使用统一的种子文件获取方法获取
      const metainfo = Buffer.from(req.data, 'binary').toString('base64')
      params = [metainfo, [], addOption]
    }

    try {
      await this.methodSend<string>(method, params)
      return true
    } catch (e) {
      return false
    }
  }

  async getAllTorrents (): Promise<Torrent[]> {
    const torrents: Torrent[] = []
    const { result: tasks } = await this.methodSend<[[rawTask[]], [rawTask[]], [rawTask[]]]>(
      'system.multicall', [
        { methodName: 'aria2.tellActive', params: [] },
        { methodName: 'aria2.tellWaiting', params: [0, 1000] },
        { methodName: 'aria2.tellStopped', params: [0, 1000] }
      ] as multiCallParams)

    tasks.forEach(task => {
      task[0].forEach(rawTask => {
        // 注意，我们只筛选bittorrent种子，对于其他类型的task，我们不做筛选
        if (rawTask.bittorrent) {
          torrents.push(parseRawTorrent(rawTask))
        }
      })
    })

    return torrents
  }

  async getTorrent (id: string): Promise<Torrent> {
    const { result: task } = await this.methodSend<rawTask>('aria2.tellStatus', [id])
    return parseRawTorrent(task)
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

  async pauseTorrent (id: string): Promise<boolean> {
    await this.methodSend<string>('aria2.pause', [id])
    return true
  }

  async removeTorrent (id: string, removeData: boolean | undefined): Promise<boolean> {
    await this.methodSend<string>('aria2.remove', [id])
    await this.methodSend<'OK'>('aria2.removeDownloadResult', [id])
    return true
  }

  async resumeTorrent (id: any): Promise<boolean> {
    await this.methodSend<string>('aria2.unpause', [id])
    return true
  }
}
