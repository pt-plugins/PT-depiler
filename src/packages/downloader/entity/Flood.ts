/**
 * Flood（jesec 分支）客户端
 * @see https://github.com/jesec/flood/tree/master/server/routes/api
 *
 * 注意：不再兼容 Flood-UI/flood（legacy）分支。
 */

import {
  AbstractBittorrentClient,
  CAddTorrentOptions,
  CustomPathDescription,
  CTorrent,
  TorrentClientConfig,
  TorrentClientMetaData,
  CTorrentState,
  TorrentClientStatus,
  CAddTorrentResult,
} from "../types";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getRemoteTorrentFile } from "../utils";

export const clientConfig: TorrentClientConfig = {
  type: "Flood",
  name: "Flood",
  address: "http://127.0.0.1:3000",
  username: "",
  password: "",
  timeout: 60 * 1e3,
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: "Flood 是 ruTorrent 的另一款基于Node的Web前端面板，界面美观，加载速度快",
  warning: [
    "仅支持 jesec/flood 分支（https://github.com/jesec/flood）",
    "如果当前已登录Flood面板，请退出登陆后再做连接性测试",
    "目前无法准确获得Flood的种子操作（添加、启动、暂停、删除）是否成功。",
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description: CustomPathDescription,
    },
    DefaultAutoStart: {
      allowed: true,
    },
    Recheck: {
      allowed: false,
    },
    Queue: {
      allowed: false,
    },
    SpeedLimit: {
      allowed: false,
    },
    Label: {
      allowed: false,
    },
    BypassCSRF: {
      allowed: false,
    },
    // TODO(Phase 3): 实现文件/peers/tracker API（jesec）后翻 true
    FileList: {
      allowed: false,
    },
    FilePriority: {
      allowed: false,
    },
    PeerList: {
      allowed: false,
    },
    TrackerList: {
      allowed: false,
    },
    TrackerManage: {
      allowed: false,
    },
  },
};

type FloodApiEndpoint =
  | "verify"
  | "authenticate"
  | "connection-test"
  | "getTorrents"
  | "addTorrentByUrl"
  | "addTorrentByFile"
  | "startTorrent"
  | "stopTorrent"
  | "deleteTorrent";

const FloodApiEndpointMap: { [key in FloodApiEndpoint]: string } = {
  verify: "/api/auth/verify",
  authenticate: "/api/auth/authenticate",
  "connection-test": "/api/client/connection-test",
  getTorrents: "/api/torrents",
  addTorrentByUrl: "/api/torrents/add-urls",
  addTorrentByFile: "/api/torrents/add-files",
  startTorrent: "/api/torrents/start",
  stopTorrent: "/api/torrents/stop",
  deleteTorrent: "/api/torrents/delete",
};

type TorrentStatus =
  "" | "checking" | "seeding" | "complete" | "downloading" | "stopped" | "error" | "inactive" | "active";

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
  // jesec 新版已移除该字段，改为通过 bytesDone/sizeBytes 或 status 推导
  isComplete?: boolean;
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
  tags: string[];
  trackerURIs: string[];
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
export default class Flood extends AbstractBittorrentClient {
  readonly version = "v0.0.1";

  /**
   * Flood 的认证依赖登录后下发的 jwt 会话 Cookie（httpOnly, SameSite=strict），
   * 因此必须复用同一个开启 withCredentials 的 axios 实例，否则登录成功后 Cookie 无法留存，
   * 后续请求全部 401。扩展已声明全量 host permission，跨域携带 Cookie 不受 SameSite 限制。
   */
  private readonly sessionedAxios = axios.create({ withCredentials: true });

  constructor(options: Partial<TorrentClientConfig> = {}) {
    super({ ...clientConfig, ...options });
  }

  private async request<T>(endpoint: FloodApiEndpoint, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    try {
      return await this.sessionedAxios.request<T>({
        baseURL: this.config.address,
        url: FloodApiEndpointMap[endpoint],
        timeout: this.config.timeout,
        ...config,
      });
    } catch (e) {
      // not authenticated or token expired
      if ((e as AxiosError).response?.status === 401 && endpoint !== "authenticate") {
        if (await this.login()) {
          return await this.request(endpoint, config);
        }
      }

      throw e;
    }
  }

  private async login(): Promise<boolean> {
    try {
      const req = await this.request<{ success: boolean }>("authenticate", {
        method: "post",
        data: {
          username: this.config.username,
          password: this.config.password,
        },
      });

      return req.data.success;
    } catch (e) {
      return false;
    }
  }

  async ping(): Promise<boolean> {
    try {
      const req = await this.request("connection-test");
      // jesec 现为 { isConnected }（早期为 { isConnect }），两者兼容读取
      const data = req.data as { isConnected?: boolean; isConnect?: boolean };
      return data.isConnected ?? data.isConnect ?? false;
    } catch (e) {
      return false;
    }
  }

  protected async getClientVersionFromRemote(): Promise<string> {
    return ""; // TODO
  }

  async addTorrent(url: string, options: Partial<CAddTorrentOptions> = {}): Promise<CAddTorrentResult> {
    const addResult = { success: false } as CAddTorrentResult;

    let postData: any = { destination: "", tags: [] };

    if (options.savePath) {
      postData.destination = options.savePath;
    }

    if (options.addAtPaused) {
      postData.start = !options.addAtPaused;
    }

    if (options.label) {
      postData.tags = [options.label];
    }

    // Note: Flood does not support upload speed limit during torrent addition
    // The uploadSpeedLimit parameter is not implemented as it's not supported by the API

    // 处理链接
    try {
      if (url.startsWith("magnet:") || !options.localDownload) {
        postData.urls = [url];

        await this.request("addTorrentByUrl", {
          method: "post",
          data: postData,
        });
      } else {
        const torrent = await getRemoteTorrentFile({
          url,
          ...(options.localDownloadOption || {}),
        });

        postData.files = [torrent.metadata.base64()];

        await this.request("addTorrentByFile", {
          method: "post",
          data: postData,
        });
      }

      addResult.success = true;
    } catch (e) {
      // 将失败原因带回给调用方（会写入下载历史），避免静默失败无法排查
      addResult.message = e instanceof Error ? e.message : String(e);
    }

    return addResult;
  }

  async getAllTorrents(): Promise<CTorrent<TorrentProperties>[]> {
    const req = await this.request<TorrentListSummaryResponse>("getTorrents");
    const rawTorrents = req.data.torrents;

    return Object.keys(rawTorrents).map((infoHash: string) => {
      const rawTorrent = rawTorrents[infoHash];

      const statusInclude = (judge: TorrentStatus[]): boolean => {
        return judge.some((s) => rawTorrent.status.includes(s));
      };

      let state = CTorrentState.unknown;
      if (statusInclude(["downloading"])) {
        state = CTorrentState.downloading;
      } else if (statusInclude(["seeding"])) {
        state = CTorrentState.seeding;
      } else if (statusInclude(["stopped"])) {
        state = CTorrentState.paused;
      } else if (statusInclude(["complete"])) {
        // jesec 的完成种子只带 complete 状态（不再提供 isComplete 字段），归入做种
        state = CTorrentState.seeding;
      } else if (statusInclude(["checking"])) {
        state = CTorrentState.checking;
      } else if (statusInclude(["error"])) {
        state = CTorrentState.error;
      }

      return {
        id: infoHash.toLowerCase(),
        infoHash,
        name: rawTorrent.name,
        dateAdded: rawTorrent.dateAdded,
        state,
        isCompleted:
          rawTorrent.isComplete ?? (rawTorrent.bytesDone > 0 && rawTorrent.bytesDone >= rawTorrent.sizeBytes),
        progress: rawTorrent.percentComplete,
        label: rawTorrent.tags && rawTorrent.tags.length > 0 ? rawTorrent.tags[0] : undefined,
        savePath: rawTorrent.directory,
        totalSize: rawTorrent.sizeBytes,
        ratio: rawTorrent.ratio,
        uploadSpeed: rawTorrent.upRate,
        downloadSpeed: rawTorrent.downRate,
        totalUploaded: rawTorrent.upTotal,
        totalDownloaded: rawTorrent.downTotal,
        raw: rawTorrent,
        clientId: this.config.id,
      } as CTorrent<TorrentProperties>;
    }) as CTorrent<TorrentProperties>[];
  }

  async pauseTorrent(id: any): Promise<boolean> {
    await this.request("stopTorrent", {
      method: "post",
      data: {
        hashes: [id],
      },
    });
    return true;
  }

  async resumeTorrent(id: any): Promise<boolean> {
    await this.request("startTorrent", {
      method: "post",
      data: {
        hashes: [id],
      },
    });
    return true;
  }

  async removeTorrent(id: any, removeData: boolean = false): Promise<boolean> {
    await this.request("deleteTorrent", {
      method: "post",
      data: {
        hashes: [id],
        deleteData: removeData,
      },
    });

    return true;
  }

  async getTorrentTrackers(_torrent: CTorrent): Promise<string[]> {
    return [];
  }
}
