/**
 * @see https://github.com/bittorrent/webui/blob/master/webui.js
 * @see https://github.com/bittorrent/webui/wiki/Web-UI-API
 */
import {
  AbstractBittorrentClient,
  CAddTorrentOptions,
  CTorrent,
  TorrentClientConfig,
  TorrentClientMetaData,
  CTorrentState,
  CAddTorrentResult,
} from "../types";
import urlJoin from "url-join";
import axios from "axios";
import { extractMagnetHash, getRemoteTorrentFile } from "../utils";

export const clientConfig: TorrentClientConfig = {
  type: "uTorrent",
  name: "µTorrent",
  address: "http://127.0.0.1:8080/gui/",
  username: "admin",
  password: "",
  timeout: 60 * 1e3,
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description:
    "μTorrent 是一个小巧强劲，全功能，用C++编写，支持Windows、Mac OS X和GNU/Linux平台的免费BitTorrent客户端。",
  warning: [
    "由于 µTorrent Web API 接口不统一，当前仅支持 µTorrent Windows 版本，Mac 版本测试不可用，其他系统未知。",
    "使用前请确认 WebUI 已安装并开启",
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description:
        "仅支持 µTorrent 3.x.x 及以上版本；<br /><br />1. 在 µTorrent 的 设置 -> 高级 -> 网页界面 添加一个下载目录，如：D:\\download\\ <br />2. 在助手里添加目录列表（仅支持相对路径），如：music\\ <br />3. 最终数据的保存目录为：D:\\download\\music\\",
    },
    DefaultAutoStart: {
      allowed: true,
    },
  },
};

const STATE_STARTED = 1;
const STATE_CHECKING = 2;
const STATE_ERROR = 16;
const STATE_PAUSED = 32;
const STATE_QUEUED = 64;

/**
 * torrent list, its a huge tuple
 */
type TorrentData = [
  HASH: string, // HASH (string)
  STATUS: number, // STATUS* (integer)
  NAME: string, // NAME (string)
  SIZE: number, // SIZE (integer in bytes)
  PROGRESS: number, // PERCENT PROGRESS (integer in per mils)
  DOWNLOADED: number, // DOWNLOADED (integer in bytes)
  UPLOADED: number, // UPLOADED (integer in bytes)
  RATIO: number, // RATIO (integer in per mils)
  UPSPEED: number, // UPLOAD SPEED (integer in bytes per second)
  DOWNSPEED: number, // DOWNLOAD SPEED (integer in bytes per second)
  ETA: number, // ETA (integer in seconds)
  LABEL: string, // LABEL (string)
  PEERS_CONNECTED: number, // PEERS CONNECTED (integer)
  PEERS_SWARM: number, // PEERS IN SWARM (integer)
  SEEDS_CONNECTED: number, // SEEDS CONNECTED (integer)
  SEEDS_SWARM: number, // SEEDS IN SWARM (integer)
  AVAILABILITY: number, // AVAILABILITY (integer in 1/65536ths)
  QUEUE_POSITION: number, // TORRENT QUEUE ORDER (integer)
  REMAINING: number, // REMAINING (integer in bytes)
  DOWNLOAD_URL: string,
  RSS_FEED_URL: string,
  STATUS_MESSAGE: string,
  STREAM_ID: string,
  DATE_ADDED: number,
  DATE_COMPLETED: number,
  APP_UPDATE_URL: string,
  SAVE_PATH: string,
  UNKNOWN: number,
  UNKNOWN: string,
  UNKNOWN: boolean,
];

interface BaseUtorrentResponse {
  build: number;
}

interface VersionResponse extends BaseUtorrentResponse {
  name: string;
  version: {
    device_id: string; // client
    engine_version: number; // 47178  == 'build'
    features: {
      device_pairing: {
        jsonp: number;
        supported_types: number[];
      };
      remote: number;
      settings_set: number;
    };
    major_version: number; // 3
    minor_version: number; // 6
    name: string; // uTorrent
    peer_id: string; // UT360S
    product_code: string; // client
    tiny_version: number; // 0
    ui_version: number; // 47178
    user_agent: string; // uTorrent/360S(47178)(client)
    version_date: string;
  };
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

// noinspection JSUnusedGlobalSymbols
export default class UTorrent extends AbstractBittorrentClient<TorrentClientConfig> {
  readonly version = "v0.0.1";

  readonly address: string;

  private _sid: string | null = null;

  constructor(options: Partial<TorrentClientConfig>) {
    super({ ...clientConfig, ...options });

    // 修正GUI地址
    this.address = this.config.address;
    if (this.address.indexOf("gui") === -1) {
      this.address = urlJoin(this.address, "/gui/"); // 注意，最后一个slashes一定要存在
    } else if (!/\/gui\/$/.exec(this.address)) {
      this.address = this.address + "/";
    }
  }

  private async getSessionId(): Promise<string> {
    if (this._sid === null) {
      await this.login();
    }
    return this._sid as string;
  }

  private async login(): Promise<boolean> {
    const req = await axios.get<string>("/token.html", {
      baseURL: this.address,
      params: {
        t: Date.now().toString(),
      },
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      timeout: this.config.timeout,
    });

    const match = />([^<]+)</.exec(req.data);
    if (match) {
      this._sid = match[match.length - 1];
      return true;
    }

    return false;
  }

  async ping(): Promise<boolean> {
    return await this.login();
  }

  protected async getClientVersionFromRemote(): Promise<string> {
    let version = "";
    try {
      // 对 ut > 3.x 可以直接使用 action=getversion 的接口获取版本信息
      const { version: versionResp } = await this.request<VersionResponse>("getversion");
      version = `${versionResp.major_version}.${versionResp.minor_version}.${versionResp.tiny_version}(${versionResp.engine_version})`;
    } catch (e) {
      const { build } = await this.request("getsettings"); // 这里其实用任意的 action 都可以
      version = `2.x(${build})`; // 对ut 2.x 只能通过 build 字段来判断版本，无法区分 2.x 的具体小版本
    }

    return version;
  }

  // 除"登录"和"添加种子"外的所有接口方法都走该方法
  async request<T extends BaseUtorrentResponse>(
    action: string,
    params: {
      [key: string]: any;
    } = {},
  ): Promise<T> {
    const _sid = await this.getSessionId();

    if (action) {
      params.action = action;
    }

    return (
      await axios.get<T>(this.address, {
        params: {
          token: _sid,
          t: Date.now().toString(),
          ...params,
        },
        responseType: "json",
        timeout: this.config.timeout,
      })
    ).data;
  }

  async addTorrent(url: string, options: Partial<CAddTorrentOptions> = {}): Promise<CAddTorrentResult> {
    const addResult = { success: false } as CAddTorrentResult;

    const _sid = await this.getSessionId();

    let formData: FormData | null = new FormData();
    const params: { [key: string]: any } = {
      // 注意： uTorrent 对参数顺序有要求，必须要按照下面顺序，否则会报 invalid request 错误
      token: _sid,
      action: "", // 空白占位，后面会覆写的
      download_dir: 0,
      path: options.savePath ? options.savePath : "",
    };

    let torrentInfoHash: string | null;
    if (url.startsWith("magnet:") || !options.localDownload) {
      formData = null;
      params.action = "add-url";
      params.s = url;

      torrentInfoHash = extractMagnetHash(url);
    } else {
      params.action = "add-file";
      const torrent = await getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption || {}),
      });

      torrentInfoHash = torrent.info?.infoHash;

      formData.append("torrent_file", torrent.metadata.blob(), torrent.name);
    }

    await axios.post<BaseUtorrentResponse>(this.address, formData, {
      params: params,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      timeout: this.config.timeout,
    });

    if (torrentInfoHash) {
      // 添加种子后，根据本地获取的 infoHash 值设置对应属性
      if (options.addAtPaused) {
        await this.pauseTorrent(torrentInfoHash);
      }

      if (options.label) {
        await this.setTorrentProp(torrentInfoHash, {
          s: "label",
          v: options.label,
        });
      }

      if (options.uploadSpeedLimit && options.uploadSpeedLimit > 0) {
        // Upload speed limit in bytes/sec for uTorrent
        await this.setTorrentProp(torrentInfoHash, {
          s: "ulrate",
          v: options.uploadSpeedLimit * 1024 * 1024,
        });
      }
    }

    addResult.success = true;
    return addResult;
  }

  async getAllTorrents(): Promise<CTorrent[]> {
    const req = await this.request<TorrentListResponse>("", {
      list: 1,
    });

    return req.torrents.map((torrent: TorrentData) => {
      const torrentState: number = torrent[1];
      const progress: number = torrent[4] / 100;
      const done = progress >= 100;
      const isCompleted = progress >= 100;

      let state = CTorrentState.unknown;
      if (torrentState & STATE_PAUSED) {
        state = CTorrentState.paused;
      } else if (torrentState & STATE_STARTED) {
        if (done) {
          state = CTorrentState.seeding;
        } else {
          state = CTorrentState.downloading;
        }
      } else if (torrentState & STATE_CHECKING) {
        state = CTorrentState.checking;
      } else if (torrentState & STATE_ERROR) {
        state = CTorrentState.error;
      } else if (torrentState & STATE_QUEUED) {
        state = CTorrentState.queued;
      } else if (done) {
        state = CTorrentState.paused;
      } else {
        state = CTorrentState.paused;
      }

      return {
        id: torrent[0].toLowerCase(),
        infoHash: torrent[0],
        name: torrent[2],
        state,
        dateAdded: torrent[23],
        isCompleted,
        progress,
        label: torrent[11],
        savePath: torrent[26],
        totalSize: torrent[3],
        ratio: torrent[7] / 1000,
        uploadSpeed: torrent[8],
        downloadSpeed: torrent[9],
        totalUploaded: torrent[6],
        totalDownloaded: torrent[5],
        raw: torrent,
        clientId: this.config.id,
      } as CTorrent;
    }) as CTorrent[];
  }

  private async setTorrentProp(id: string, props: Record<string, string | number>): Promise<boolean> {
    await this.request<BaseUtorrentResponse>("setprops", {
      hash: id,
      ...props,
    });
    return true;
  }

  // 注意：uTorrent的pause, resume, remove均直接返回true，因为接口没返回具体成功没成功
  async pauseTorrent(id: string): Promise<boolean> {
    await this.request<BaseUtorrentResponse>("pause", { hash: id });
    return true;
  }

  async resumeTorrent(id: string): Promise<boolean> {
    await this.request<BaseUtorrentResponse>("start", { hash: id });
    return true;
  }

  async removeTorrent(id: string, removeData: boolean = true): Promise<boolean> {
    const action = removeData ? "removedatatorrent" : "removetorrent";
    await this.request<BaseUtorrentResponse>(action, { hash: id });
    return true;
  }
}
