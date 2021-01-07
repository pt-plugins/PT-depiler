/**
 * @see https://github.com/Novik/ruTorrent/blob/master/php/addtorrent.php
 * @see https://github.com/Rhilip/PT-Plugin/blob/master/src/script/client.js#L477_L543
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
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getRandomInt } from '@/shared/utils/common'

export const clientConfig: TorrentClientConfig = {
  type: 'ruTorrent',
  name: 'ruTorrent',
  uuid: 'b2d09b95-20b4-4d79-8858-b5eb81f20ddf',
  address: 'https://myrut.com/rutorrent',
  username: 'admin',
  password: '',
  timeout: 60 * 1e3
}

export const clientMetaData: TorrentClientMetaData = {
  description: 'rTorrent 的一款基于PHP的Web前端面板',
  feature: {
    CustomPath: {
      allowed: true,
      description: CustomPathDescription
    }
  }
}

type torrentData = [
  string, // is_open
  string, // is_hash_checking
  string, // is_hash_checked
  string, // get_state
  string, // torrent_name
  string, // torrent_size
  string, // get_completed_chunks
  string, // get_size_chunks
  string, // torrent_downloaded
  string, // torrent_uploaded
  string, // ratio
  string, // torrent_ul
  string, // torrent_dl
  string, // get_chunk_size
  string, // torrent_label
  string, // peers_actual
  string, // get_peers_not_connected
  string, // get_peers_connected
  string, // seeds_actual
  string, // remaining
  string, // priority
  string, // state_changed
  string, // skip_total
  string, // get_hashing
  string, // get_hashed_chunks
  string, // base_path
  string, // created
  string, // tracker_focus
  string, // is_active
  string, // torrent_msg
  string, // torrent_comment
  string, // free_diskspace
  string, // private
  string, // multi_file
]

interface ListResponse {
  t: {
    [infoHash: string]: torrentData
  },
  cid: number
}

function iv (val: string | null) {
  const v = (val == null) ? 0 : parseInt(val + '')
  return (isNaN(v) ? 0 : v)
}

export default class RuTorrent implements TorrentClient {
  readonly version = 'v0.0.1';
  readonly config: TorrentClientConfig;

  constructor (options: Partial<TorrentClientConfig> = {}) {
    this.config = { ...clientConfig, ...options }
  }

  async request (config: AxiosRequestConfig = {}): Promise<AxiosResponse> {
    return await axios.request({
      baseURL: this.config.address,
      auth: {
        username: this.config.username,
        password: this.config.password
      },
      timeout: this.config.timeout,
      ...config
    })
  }

  /**
   * 鉴于ruTorrent请求 `php/getplugins.php` 页面获取信息为js格式，不好处理，
   * 故考虑请求 `/php/getsettings.php` 页面，如果返回json格式的信息则说明可连接
   */
  async ping (): Promise<boolean> {
    try {
      await this.request({
        method: 'get',
        url: '/php/getsettings.php',
        responseType: 'json'
      })
    } catch (e) {
      return false
    }
    return true
  }

  async addTorrent (url: string, options: Partial<AddTorrentOptions> = {}): Promise<boolean> {
    let postData: URLSearchParams | FormData
    if (url.startsWith('magnet:') || !options.localDownload) {
      postData = new URLSearchParams()
      postData.append('url', url)
    } else {
      postData = new FormData()

      // FIXME 使用统一函数获取种子文件
      const req = await axios.get(url, {
        responseType: 'blob'
      })

      postData.append('torrent_file', req.data, String(getRandomInt(0, 4096)) + '.torrent')
    }

    postData.append('json', '1') // 让ruTorrent返回json
    // postData.append('fast_resume', '1') // 快速恢复，禁用

    if (options.savePath) {
      postData.append('dir_edit', options.savePath)
    }

    if (options.addAtPaused) {
      postData.append('torrents_start_stopped', '1')
    }

    if (options.label) {
      postData.append('label', options.label)
    }

    const req = (await this.request({
      method: 'post',
      url: '/php/addtorrent.php',
      data: postData
    }))

    return req.data.result === 'Success'
  }

  async getAllTorrents (): Promise<Torrent[]> {
    const postData = new URLSearchParams()
    postData.append('mode', 'list')

    const req = await this.request({
      method: 'post',
      url: '/plugins/httprpc/action.php',
      data: postData
    })

    const data: ListResponse = req.data

    return Object.keys(data.t).map((infoHash:string) => {
      const rawTorrent = data.t[infoHash]

      const isOpen = iv(rawTorrent[0])
      const isHashChecking = iv(rawTorrent[1])
      const getState = iv(rawTorrent[3])
      const getHashing = iv(rawTorrent[23])
      const isActive = iv(rawTorrent[28])
      const torrentMsg = rawTorrent[30]

      const chunksProcessing = (isHashChecking === 0) ? iv(rawTorrent[6]) : iv(rawTorrent[24])
      const TorrentDone = Math.floor(chunksProcessing / iv(rawTorrent[7]) * 1000)
      const isCompleted = TorrentDone >= 1000

      const basePath = rawTorrent[25]
      const basePathPos = basePath.lastIndexOf('/')
      const savePath = (basePath.substring(basePathPos + 1) === rawTorrent[4]) ? basePath.substring(0, basePathPos) : basePath

      let state = TorrentState.unknown
      if (isOpen !== 0) {
        if ((getState === 0) || (isActive === 0)) {
          state = TorrentState.paused
        } else {
          // eslint-disable-next-line eqeqeq
          state = isCompleted ? TorrentState.seeding : TorrentState.downloading
        }
      } else if (getHashing !== 0) {
        state = TorrentState.queued
      } else if (isHashChecking !== 0) {
        state = TorrentState.checking
      } else if (torrentMsg.length && torrentMsg !== 'Tracker: [Tried all trackers.]') {
        state = TorrentState.error
      }

      return {
        id: infoHash.toLowerCase(),
        infoHash: infoHash,
        name: rawTorrent[4],
        state,
        dateAdded: new Date(parseInt(rawTorrent[21]) * 1000).toISOString(),
        isCompleted,
        progress: TorrentDone / 10,
        label: decodeURIComponent(rawTorrent[15]),
        savePath,
        totalSize: iv(rawTorrent[5]),
        ratio: iv(rawTorrent[10]),
        uploadSpeed: iv(rawTorrent[11]),
        downloadSpeed: iv(rawTorrent[12]),
        totalUploaded: iv(rawTorrent[9]),
        totalDownloaded: iv(rawTorrent[8])
      } as Torrent
    })
  }

  async getTorrent (id: any): Promise<Torrent> {
    return (await this.getTorrentsBy({ ids: id.toUpperCase() }))[0]
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
    const postData = new URLSearchParams()
    postData.append('mode', 'pause')
    postData.append('hash', id.toUpperCase())

    await this.request({
      method: 'post',
      url: '/plugins/httprpc/action.php',
      data: postData
    })
    return true
  }

  async removeTorrent (id: any, removeData: boolean = false): Promise<boolean> {
    const upId = id.toUpperCase()
    if (removeData) {
      await this.request({
        method: 'post',
        url: '/plugins/httprpc/action.php',
        data: `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>system.multicall</methodName><params><param><value><array><data><value><struct><member><name>methodName</name><value><string>d.custom5.set</string></value></member><member><name>params</name><value><array><data><value><string>${upId}</string></value><value><string>1</string></value></data></array></value></member></struct></value><value><struct><member><name>methodName</name><value><string>d.delete_tied</string></value></member><member><name>params</name><value><array><data><value><string>${upId}</string></value></data></array></value></member></struct></value><value><struct><member><name>methodName</name><value><string>d.erase</string></value></member><member><name>params</name><value><array><data><value><string>${upId}</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodCall>`
      })
    } else {
      const postData = new URLSearchParams()
      postData.append('mode', 'remove')
      postData.append('hash', upId)

      await this.request({
        method: 'post',
        url: '/plugins/httprpc/action.php',
        data: postData
      })
    }

    return true
  }

  async resumeTorrent (id: string): Promise<boolean> {
    const postData = new URLSearchParams()
    postData.append('mode', 'post')
    postData.append('hash', id.toUpperCase())

    await this.request({
      method: 'post',
      url: '/plugins/httprpc/action.php',
      data: postData
    })
    return true
  }
}
