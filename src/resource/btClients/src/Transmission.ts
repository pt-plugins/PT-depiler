/**
 * TODO 注意，获取可用空间 的功能尚未实现
 */
import {
  CAddTorrentOptions, CustomPathDescription,
  CTorrent,
  TorrentClientConfig,
  TorrentClientMetaData,
  CTorrentFilterRules, CTorrentState
} from '../types';
import urljoin from 'url-join';
import axios, { AxiosResponse } from 'axios';
import AbstractBittorrentClient from '@/resource/btClients/AbstractBittorrentClient';

export const clientConfig: TorrentClientConfig = {
  type: 'Transmission',
  name: 'Transmission',
  uuid: '1cc694ef-7f64-4882-b33a-b578a76fd35c',
  address: 'http://localhost:9091/',
  username: '',
  password: '',
  timeout: 60 * 1e3
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: 'Transmission 是一个跨平台的BitTorrent客户端，特点是硬件资源消耗极少，界面极度精简',
  warning: [
    '默认情况下，系统会请求 http://ip:port/transmission/rpc 这个路径，如果无法连接，请确认 `settings.json` 文件的 `rpc-url` 值；详情可参考：https://github.com/ronggang/PT-Plugin-Plus/issues/32'
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description: CustomPathDescription
    }
  }
};

// 这里只写出了部分我们需要的
interface rawTorrent {
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
  labels: string[],
  rateDownload: number,
  rateUpload: number,
  /**
   * Byte count of all data you've ever uploaded for this torrent.
   */
  uploadedEver: number,
  /**
   * Byte count of all the non-corrupt data you've ever downloaded for this torrent. If you deleted the files and downloaded a second time, this will be 2*totalSize.
   */
  downloadedEver: number,
}

interface TransmissionBaseResponse {
  arguments: any;
  result: 'success' | string;
  tag?: number
}

interface TransmissionTorrentGetResponse extends TransmissionBaseResponse {
  arguments: {
    torrents: rawTorrent[]
  }
}

interface AddTorrentResponse extends TransmissionBaseResponse {
  arguments: {
    'torrent-added': {
      id: number;
      hashString: string;
      name: string;
    };
  };
}

type TransmissionTorrentIds = number | Array<number | string> | 'recently-active'

type TransmissionRequestMethod =
  'session-get' | 'session-stats' |
  'torrent-get' | 'torrent-add' | 'torrent-start' | 'torrent-stop' | 'torrent-remove' | 'torrent-set'

interface TransmissionAddTorrentOptions {
  'download-dir': string,
  filename: string,
  metainfo: string,
  paused: boolean,
}

interface TransmissionTorrentFilterRules extends CTorrentFilterRules {
  ids?: TransmissionTorrentIds;
}

interface TransmissionArguments {

}

interface TransmissionTorrentBaseArguments extends TransmissionArguments {
  ids?: TransmissionTorrentIds
}

type TransmissionTorrentsField =
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

interface TransmissionTorrentGetArguments extends TransmissionTorrentBaseArguments {
  fields: TransmissionTorrentsField[]
}

interface TransmissionTorrentRemoveArguments extends TransmissionTorrentBaseArguments {
  'delete-local-data'?: boolean
}

// noinspection JSUnusedGlobalSymbols
export default class Transmission extends AbstractBittorrentClient<TorrentClientConfig> {
  readonly version = 'v0.1.0'

  private readonly torrentRequestFields : TransmissionTorrentsField[] = [
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

  // 实例真实使用的rpc地址
  private readonly address: string;

  private sessionId : string = '';

  constructor (options: Partial<TorrentClientConfig> = {}) {
    super({ ...clientConfig, ...options });

    // 修正服务器地址
    let address = this.config.address;
    if (address.indexOf('rpc') === -1) {
      address = urljoin(address, '/transmission/rpc');
    }
    this.address = address;
  }

  async addTorrent (url: string, options: Partial<CAddTorrentOptions> = {}): Promise<boolean> {
    const addTorrentOptions : Partial<TransmissionAddTorrentOptions> = {
      paused: options.addAtPaused ?? false
    };

    if (options.localDownload) {
      const torrent = await this.getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption || {})
      });

      addTorrentOptions.metainfo = torrent.metadata.base64;
    } else {
      addTorrentOptions.filename = url;
    }

    if (options.savePath) {
      addTorrentOptions['download-dir'] = options.savePath;
    }

    try {
      const { data } = await this.request<AddTorrentResponse>('torrent-add', addTorrentOptions);

      // Transmission 3.0 以上才支持label
      if (options.label) {
        try {
          const torrentId = data.arguments['torrent-added'].id;
          await this.request('torrent-set', { ids: torrentId, label: [options.label] });
        } catch (e) {}
      }

      return data.result === 'success';
    } catch (e) {
      return false;
    }
  }

  async getAllTorrents (): Promise<CTorrent[]> {
    return await this.getTorrentsBy({});
  }

  override async getTorrentsBy (filter: TransmissionTorrentFilterRules): Promise<CTorrent[]> {
    const args: TransmissionTorrentGetArguments = {
      fields: this.torrentRequestFields
    };

    if (filter.ids) {
      args.ids = filter.ids;
    }

    const { data } = await this.request<TransmissionTorrentGetResponse>('torrent-get', args);

    let returnTorrents: CTorrent[] = data.arguments.torrents.map(torrent => {
      let state = CTorrentState.unknown;
      if (torrent.status === 6) {
        state = CTorrentState.seeding;
      } else if (torrent.status === 4) {
        state = CTorrentState.downloading;
      } else if (torrent.status === 0) {
        state = CTorrentState.paused;
      } else if (torrent.status === 2) {
        state = CTorrentState.checking;
      } else if (torrent.status === 3 || torrent.status === 5) {
        state = CTorrentState.queued;
      }

      return {
        id: torrent.id,
        infoHash: torrent.hashString,
        name: torrent.name,
        progress: torrent.percentDone,
        isCompleted: torrent.leftUntilDone < 1,
        ratio: torrent.uploadRatio,
        dateAdded: torrent.addedDate,
        savePath: torrent.downloadDir,
        label: torrent.labels && torrent.labels.length ? torrent.labels[0] : undefined,
        state: state,
        totalSize: torrent.totalSize,
        uploadSpeed: torrent.rateUpload,
        downloadSpeed: torrent.rateDownload,
        totalUploaded: torrent.uploadedEver,
        totalDownloaded: torrent.downloadedEver
      } as CTorrent;
    });

    if (filter.complete) {
      returnTorrents = returnTorrents.filter((t:CTorrent) => t.isCompleted);
    }

    return returnTorrents;
  }

  async pauseTorrent (id: any): Promise<any> {
    const args: TransmissionTorrentBaseArguments = {
      ids: id
    };
    await this.request('torrent-stop', args);
    return true;
  }

  async ping (): Promise<boolean> {
    try {
      const { data } = await this.request<TransmissionBaseResponse>('session-get');
      return data.result === 'success';
    } catch (e) {
      return false;
    }
  }

  async removeTorrent (id: number, removeData: boolean | undefined): Promise<boolean> {
    const args:TransmissionTorrentRemoveArguments = {
      ids: id,
      'delete-local-data': removeData
    };
    await this.request('torrent-remove', args);
    return true;
  }

  async resumeTorrent (id: any): Promise<boolean> {
    const args: TransmissionTorrentBaseArguments = {
      ids: id
    };
    await this.request('torrent-start', args);
    return true;
  }

  async request <T> (method:TransmissionRequestMethod, args: any = {}): Promise<AxiosResponse<T>> {
    try {
      return await axios.post<T>(this.address, {
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
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        this.sessionId = error.response.headers['x-transmission-session-id']; // lower cased header in axios
        return await this.request<T>(method, args);
      } else {
        throw error;
      }
    }
  }
}
