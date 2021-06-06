/**
 * @see https://github.com/Novik/ruTorrent/blob/master/php/addtorrent.php
 * @see https://github.com/Rhilip/PT-Plugin/blob/master/src/script/client.js#L477_L543
 */
import {
  CAddTorrentOptions, CustomPathDescription,
  CTorrent,
  TorrentClientConfig,
  TorrentClientMetaData,
  CTorrentState
} from '../types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AbstractBittorrentClient from '@/resource/btClients/AbstractBittorrentClient';

export const clientConfig: TorrentClientConfig = {
  type: 'ruTorrent',
  name: 'ruTorrent',
  uuid: 'b2d09b95-20b4-4d79-8858-b5eb81f20ddf',
  address: 'https://myrut.com/rutorrent',
  username: 'admin',
  password: '',
  timeout: 60 * 1e3
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: 'rTorrent 的一款基于PHP的Web前端面板',
  feature: {
    CustomPath: {
      allowed: true,
      description: CustomPathDescription
    }
  }
};

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
  const v = (val == null) ? 0 : parseInt(val + '');
  return (isNaN(v) ? 0 : v);
}

// noinspection JSUnusedGlobalSymbols
export default class RuTorrent extends AbstractBittorrentClient<TorrentClientConfig> {
  readonly version = 'v0.0.1';

  constructor (options: Partial<TorrentClientConfig> = {}) {
    super({ ...clientConfig, ...options });
  }

  async request <T> (config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return await axios.request({
      baseURL: this.config.address,
      auth: {
        username: this.config.username,
        password: this.config.password
      },
      timeout: this.config.timeout,
      ...config
    });
  }

  async requestHttpRpc<T> (data: any = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'post', url: '/plugins/httprpc/action.php', data });
  }

  /**
   * 鉴于ruTorrent请求 `php/getplugins.php` 页面获取信息为js格式，不好处理，
   * 故考虑请求 `/php/getsettings.php` 页面，如果返回json格式的信息则说明可连接
   */
  async ping (): Promise<boolean> {
    try {
      await this.request({
        url: '/php/getsettings.php',
        responseType: 'json'
      });
    } catch (e) {
      return false;
    }
    return true;
  }

  async addTorrent (url: string, options: Partial<CAddTorrentOptions> = {}): Promise<boolean> {
    let postData: URLSearchParams | FormData;
    if (url.startsWith('magnet:') || !options.localDownload) {
      postData = new URLSearchParams();
      postData.append('url', url);
    } else {
      postData = new FormData();

      const torrent = await this.getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption || {})
      });

      postData.append('torrent_file', torrent.metadata.blob, torrent.name);
    }

    postData.append('json', '1'); // 让ruTorrent返回json
    // postData.append('fast_resume', '1') // 快速恢复，默认禁用

    if (options.savePath) {
      postData.append('dir_edit', options.savePath);
    }

    if (options.addAtPaused) {
      postData.append('torrents_start_stopped', '1');
    }

    if (options.label) {
      postData.append('label', options.label);
    }

    const { data } = await this.request<{ result: 'Success' | 'Failed' | 'FailedFile' }>({
      method: 'post',
      url: '/php/addtorrent.php',
      data: postData
    });

    return data.result === 'Success';
  }

  async getAllTorrents (): Promise<CTorrent[]> {
    const postData = new URLSearchParams({ model: 'list' });
    const { data } = await this.requestHttpRpc<ListResponse>(postData);

    return Object.keys(data.t).map((infoHash:string) => {
      const rawTorrent = data.t[infoHash];

      const isOpen = iv(rawTorrent[0]);
      const isHashChecking = iv(rawTorrent[1]);
      const getState = iv(rawTorrent[3]);
      const getHashing = iv(rawTorrent[23]);
      const isActive = iv(rawTorrent[28]);
      const torrentMsg = rawTorrent[30];

      const chunksProcessing = (isHashChecking === 0) ? iv(rawTorrent[6]) : iv(rawTorrent[24]);
      const TorrentDone = Math.floor(chunksProcessing / iv(rawTorrent[7]) * 1000);
      const isCompleted = TorrentDone >= 1000;

      const basePath = rawTorrent[25];
      const basePathPos = basePath.lastIndexOf('/');
      const savePath = (basePath.substring(basePathPos + 1) === rawTorrent[4]) ? basePath.substring(0, basePathPos) : basePath;

      let state = CTorrentState.unknown;
      if (isOpen !== 0) {
        if ((getState === 0) || (isActive === 0)) {
          state = CTorrentState.paused;
        } else {
          // eslint-disable-next-line eqeqeq
          state = isCompleted ? CTorrentState.seeding : CTorrentState.downloading;
        }
      } else if (getHashing !== 0) {
        state = CTorrentState.queued;
      } else if (isHashChecking !== 0) {
        state = CTorrentState.checking;
      } else if (torrentMsg.length && torrentMsg !== 'Tracker: [Tried all trackers.]') {
        state = CTorrentState.error;
      }

      return {
        id: infoHash.toLowerCase(),
        infoHash,
        name: rawTorrent[4],
        state,
        dateAdded: parseInt(rawTorrent[21]),
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
      } as CTorrent;
    });
  }

  async pauseTorrent (id: any): Promise<boolean> {
    const postData = new URLSearchParams({ mode: 'pause', hash: id.toUpperCase() });
    await this.requestHttpRpc(postData);
    return true;
  }

  async removeTorrent (id: any, removeData: boolean = false): Promise<boolean> {
    const upId = id.toUpperCase();

    let postData: string | URLSearchParams;
    if (removeData) {
      postData = `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>system.multicall</methodName><params><param><value><array><data><value><struct><member><name>methodName</name><value><string>d.custom5.set</string></value></member><member><name>params</name><value><array><data><value><string>${upId}</string></value><value><string>1</string></value></data></array></value></member></struct></value><value><struct><member><name>methodName</name><value><string>d.delete_tied</string></value></member><member><name>params</name><value><array><data><value><string>${upId}</string></value></data></array></value></member></struct></value><value><struct><member><name>methodName</name><value><string>d.erase</string></value></member><member><name>params</name><value><array><data><value><string>${upId}</string></value></data></array></value></member></struct></value></data></array></value></param></params></methodCall>`;
    } else {
      postData = new URLSearchParams({ mode: 'remove', hash: upId });
    }

    await this.requestHttpRpc(postData);
    return true;
  }

  async resumeTorrent (id: string): Promise<boolean> {
    const postData = new URLSearchParams({ mode: 'post', hash: id.toUpperCase() });
    await this.requestHttpRpc(postData);
    return true;
  }
}
