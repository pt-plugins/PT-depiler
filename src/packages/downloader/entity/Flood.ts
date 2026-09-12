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
  CTorrentFile,
  CTorrentFileSelection,
  CTorrentPeer,
  CTorrentTracker,
  CTrackerState,
  TorrentFilePriority,
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
    FileList: {
      allowed: true,
    },
    FilePriority: {
      allowed: true,
    },
    PeerList: {
      allowed: true,
    },
    TrackerList: {
      allowed: true,
    },
    TrackerManage: {
      allowed: true,
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

  private async requestCore<T>(
    url: string,
    config: AxiosRequestConfig = {},
    skipAuthRetry = false,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.sessionedAxios.request<T>({
        baseURL: this.config.address,
        url,
        timeout: this.config.timeout,
        ...config,
      });
    } catch (e) {
      // not authenticated or token expired
      if ((e as AxiosError).response?.status === 401 && !skipAuthRetry) {
        if (await this.login()) {
          return await this.requestCore<T>(url, config, true);
        }
      }

      throw e;
    }
  }

  private async request<T>(endpoint: FloodApiEndpoint, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.requestCore<T>(FloodApiEndpointMap[endpoint], config);
  }

  // 直接按路径请求（用于包含 hash 的动态路由，如 contents / details / trackers）
  private async requestUrl<T>(path: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.requestCore<T>(path, config);
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

  async getTorrentTrackers(torrent: CTorrent): Promise<string[]> {
    const trackers = await this.getTorrentTrackersDetail(torrent);
    return trackers.map((tracker) => tracker.url);
  }

  // ─────────────────────────────────────────────
  // 文件级 / peers / tracker（jesec/flood API）
  // ─────────────────────────────────────────────

  private getTorrentHash(torrent: string | CTorrent): string {
    if (typeof torrent === "string") {
      return torrent;
    }
    return (torrent.infoHash ?? torrent.id) as string;
  }

  // 文件列表: GET /api/torrents/{hash}/contents
  override async getTorrentFiles(torrent: string | CTorrent): Promise<CTorrentFile[]> {
    const req = await this.requestUrl<
      Array<{
        index: number;
        path: string;
        filename: string;
        percentComplete: number;
        priority: number; // 0=Don't Download, 1=Normal, 2=High
        sizeBytes: number;
      }>
    >(`/api/torrents/${this.getTorrentHash(torrent)}/contents`);

    return (req.data ?? []).map((file) => {
      const priority = mapFloodFilePriority(file.priority);
      return {
        index: file.index,
        name: file.filename,
        path: file.path,
        size: file.sizeBytes,
        progress: file.percentComplete,
        priority,
        wanted: priority !== "skip",
        raw: file,
      };
    });
  }

  // 文件优先级/选择: PATCH /api/torrents/{hash}/contents（一次只能一个 priority，按优先级分组）
  override async setTorrentFilePriority(
    torrent: string | CTorrent,
    selections: CTorrentFileSelection[],
  ): Promise<boolean> {
    if (selections.length === 0) {
      return true;
    }
    const hash = this.getTorrentHash(torrent);

    const grouped = new Map<number, number[]>();
    for (const { index, priority } of selections) {
      const floodPriority = mapTorrentFilePriorityToFlood(priority);
      const indices = grouped.get(floodPriority) ?? [];
      indices.push(index);
      grouped.set(floodPriority, indices);
    }

    for (const [priority, indices] of grouped) {
      await this.requestUrl(`/api/torrents/${hash}/contents`, {
        method: "patch",
        data: { indices, priority },
      });
    }
    return true;
  }

  // peer 列表: GET /api/torrents/{hash}/details
  override async getTorrentPeers(torrent: string | CTorrent): Promise<CTorrentPeer[]> {
    const req = await this.requestUrl<{
      peers?: Array<{
        address: string;
        clientVersion?: string;
        completedPercent?: number;
        country?: string;
        downloadRate?: number;
        isEncrypted?: boolean;
        isIncoming?: boolean;
        uploadRate?: number;
      }>;
    }>(`/api/torrents/${this.getTorrentHash(torrent)}/details`);

    return (req.data?.peers ?? []).map((peer) => ({
      ip: peer.address,
      client: peer.clientVersion,
      progress: peer.completedPercent ?? 0,
      downloadSpeed: peer.downloadRate ?? 0,
      uploadSpeed: peer.uploadRate ?? 0,
      encrypted: peer.isEncrypted,
      incoming: peer.isIncoming,
      country: peer.country,
      flags: [],
      raw: peer,
    }));
  }

  // tracker 列表（带状态）: GET /api/torrents/{hash}/details（trackers 仅 url/type，无状态信息）
  override async getTorrentTrackersDetail(torrent: string | CTorrent): Promise<CTorrentTracker[]> {
    const req = await this.requestUrl<{
      trackers?: Array<{
        url: string;
        type?: number; // 1=http, 2=udp, 3=dht
      }>;
    }>(`/api/torrents/${this.getTorrentHash(torrent)}/details`);

    return (req.data?.trackers ?? []).map((tracker, index) => ({
      url: tracker.url,
      tier: index,
      status: CTrackerState.unknown,
      enabled: true,
      raw: tracker,
    }));
  }

  // 新增 tracker: PATCH /api/torrents/trackers（全量替换，先读后加）
  override async addTorrentTracker(torrent: string | CTorrent, url: string): Promise<boolean> {
    const hash = this.getTorrentHash(torrent);
    const urls = (await this.getTorrentTrackersDetail(hash)).map((tracker) => tracker.url);
    if (urls.includes(url)) {
      return true;
    }
    urls.push(url);
    await this.requestUrl("/api/torrents/trackers", { method: "patch", data: { hashes: [hash], trackers: urls } });
    return true;
  }

  // 删除 tracker: PATCH /api/torrents/trackers（全量替换，先读后删）
  override async removeTorrentTracker(torrent: string | CTorrent, url: string): Promise<boolean> {
    const hash = this.getTorrentHash(torrent);
    const trackers = await this.getTorrentTrackersDetail(hash);
    const urls = trackers.filter((tracker) => tracker.url !== url).map((tracker) => tracker.url);
    if (urls.length === trackers.length) {
      return true;
    }
    await this.requestUrl("/api/torrents/trackers", { method: "patch", data: { hashes: [hash], trackers: urls } });
    return true;
  }
}

// flood 文件优先级: 0=Don't Download, 1=Normal, 2=High
function mapFloodFilePriority(priority: number): TorrentFilePriority {
  switch (priority) {
    case 0:
      return "skip";
    case 2:
      return "high";
    case 1:
    default:
      return "normal";
  }
}

function mapTorrentFilePriorityToFlood(priority: TorrentFilePriority): number {
  switch (priority) {
    case "skip":
      return 0;
    case "high":
    case "highest":
      return 2;
    case "low":
    case "normal":
    default:
      return 1;
  }
}
