/**
 * @see https://github.com/qbittorrent/qBittorrent/wiki/Web-API-Documentation
 *
 * 注意，因为使用大驼峰命名的形式，所以qBittorrent在各变量命名中均写成 QBittorrent
 */
import {
  AbstractBittorrentClient,
  CAddTorrentOptions,
  CustomPathDescription,
  CTorrent,
  TorrentClientConfig,
  TorrentClientMetaData,
  CTorrentFilterRules,
  CTorrentState,
  TorrentClientStatus,
  CAddTorrentResult,
} from "../types";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import urlJoin from "url-join";
import { getRemoteTorrentFile } from "../utils";
import { merge } from "es-toolkit";

/**
 * 定义一个 前缀，用于标识 qBittorrent 的分类
 * 如果用户传入的 savePath 中包含了这个前缀，则认为是 qBittorrent 的分类
 * 则设置 autoTMM = true & category = savePath.replace(category_prefix, "")
 */
const category_prefix = "category:";

export const clientConfig: TorrentClientConfig = {
  type: "qBittorrent",
  name: "qBittorrent",
  address: "http://localhost:9091/",
  username: "",
  password: "",
  timeout: 60 * 1e3,
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: "qBittorrent是一个跨平台的自由BitTorrent客户端，其图形用户界面是由Qt所写成的。",
  warning: [
    "当前仅支持 qBittorrent v4.1+",
    "由于浏览器限制，需要禁用 qBittorrent 的『启用跨站请求伪造(CSRF)保护』功能才能正常使用",
    "注意：由于 qBittorrent 验证机制限制，第一次测试连接成功后，后续测试无论密码正确与否都会提示成功。",
  ],
  feature: {
    CustomPath: {
      allowed: true,
      description:
        CustomPathDescription +
        `（ qBittorrent 额外支持以 "${category_prefix}" 前缀的分类作为下载目录，当使用该前缀时，请在 qBittorrent 中预设分类信息。）`,
    },
    DefaultAutoStart: {
      allowed: true,
    },
  },
  advanceAddTorrentOptions: [
    {
      name: "自动管理模式",
      key: "autoTMM",
      type: "boolean",
      defaultValue: false,
      description: `当使用 "${category_prefix}" 前缀的分类作为下载目录，会自动启用`,
    },
    { name: "跳过哈希校验", key: "skip_checking", type: "boolean", defaultValue: false },
    { name: "顺序下载", key: "sequentialDownload", type: "boolean", defaultValue: false },
    { name: "先下载首尾文件块", key: "firstLastPiecePrio", type: "boolean", defaultValue: false },
  ],
} as const;

const QBittorrentAdvanceAddTorrentOptionsBooleanKey = clientMetaData
  .advanceAddTorrentOptions!.filter((x) => x.type === "boolean")
  .map((x) => x.key) as ["autoTMM", "skip_checking", "sequentialDownload", "firstLastPiecePrio"];
type TQBittorrentAdvanceAddTorrentOptionsBooleanKey = (typeof QBittorrentAdvanceAddTorrentOptionsBooleanKey)[number];
type TQBittorrentAdvanceAddTorrentOptionsKey = TQBittorrentAdvanceAddTorrentOptionsBooleanKey | string;

type TrueFalseStr = "true" | "false";

enum QbittorrentTorrentState {
  Error = "error", // Some error occurred, applies to paused torrents
  PausedUP = "pausedUP", // Torrent is paused and has finished downloading
  PausedDL = "pausedDL", // Torrent is paused and has NOT finished downloading
  QueuedUP = "queuedUP", // Queuing is enabled and torrent is queued for upload
  QueuedDL = "queuedDL", // Queuing is enabled and torrent is queued for download
  Uploading = "uploading", // Torrent is being seeded and data is being transferred
  StalledUP = "stalledUP", // Torrent is being seeded, but no connection were made
  CheckingUP = "checkingUP", // Torrent has finished downloading and is being checked; this status also applies to preallocation (if enabled) and checking resume data on qBt startup
  CheckingDL = "checkingDL", // Same as checkingUP, but torrent has NOT finished downloading
  Downloading = "downloading", // Torrent is being downloaded and data is being transferred
  StalledDL = "stalledDL", // Torrent is being downloaded, but no connection were made
  ForcedDL = "forcedDL", // Torrent is forced to downloading to ignore queue limit
  ForcedUP = "forcedUP", // Torrent is forced to uploading and ignore queue limit
  MetaDL = "metaDL", // Torrent has just started downloading and is fetching metadata
  Allocating = "allocating", // Torrent is allocating disk space for download
  QueuedForChecking = "queuedForChecking",
  CheckingResumeData = "checkingResumeData", // Checking resume data on qBt startup
  Moving = "moving", // Torrent is moving to another location
  Unknown = "unknown", // Unknown status
  MissingFiles = "missingFiles", // Torrent data files is missing
}

interface rawTorrent {
  name: string; // Torrent name
  hash: string;
  magnet_uri: string;
  added_on: number; // datetime in seconds
  size: number; // Torrent size
  progress: number; // Torrent progress
  dlspeed: number; // Torrent download speed (bytes/s)
  upspeed: number; // Torrent upload speed (bytes/s)
  priority: number; // Torrent priority (-1 if queuing is disabled)
  num_seeds: number; // Torrent seeds connected to
  num_complete: number; // Torrent seeds in the swarm
  num_leechs: number; // Torrent leechers connected to
  num_incomplete: number; // Torrent leechers in the swarm
  ratio: number; // Torrent share ratio
  eta: number; // Torrent ETA
  state: QbittorrentTorrentState; // Torrent state
  seq_dl: boolean; // Torrent sequential download state
  f_l_piece_prio: boolean; // Torrent first last piece priority state
  completion_on: number; // Torrent copletion datetime in seconds
  tracker: string; // Torrent tracker
  dl_limit: number; // Torrent download limit
  up_limit: number; // Torrent upload limit
  downloaded: number; // Amount of data downloaded
  uploaded: number; // Amount of data uploaded
  downloaded_session: number; // Amount of data downloaded since program open
  uploaded_session: number; // Amount of data uploaded since program open
  amount_left: number; // Amount of data left to download
  save_path: string; // Torrent save path
  completed: number; // Amount of data completed
  max_ratio: number; // Upload max share ratio
  max_seeding_time: number; // Upload max seeding time
  ratio_limit: number; // Upload share ratio limit
  seeding_time_limit: number; // Upload seeding time limit
  seen_complete: number; // Indicates the time when the torrent was last seen complete/whole
  last_activity: number; // Last time when a chunk was downloaded/uploaded
  total_size: number; // Size including unwanted data

  time_active: number;

  category: string; // Category name
}

interface QbittorrentTorrent extends CTorrent<rawTorrent> {
  id: string;
}

type QbittorrentTorrentFilters =
  | "all"
  | "downloading"
  | "completed"
  | "paused"
  | "active"
  | "inactive"
  | "resumed"
  | "stalled"
  | "stalled_uploading"
  | "stalled_downloading";

interface QbittorrentTorrentFilterRules extends CTorrentFilterRules {
  hashes?: string | string[];
  filter?: QbittorrentTorrentFilters;
  category?: string;
  sort?: string;
  offset?: number;
  reverse?: boolean | TrueFalseStr;
}

interface rawSyncMaindata {
  rid: number;
  full_update?: boolean;
  torrents?: Record<string, rawTorrent>;
  torrents_removed?: string[];
  categories?: Record<string, { name: string; savePath: string }>;
  categories_removed?: string[];
  tags?: string[];
  tags_removed?: string[];
  server_state?: Record<string, string | number | boolean>;
}

const convertMaps: [string, keyof TorrentClientStatus][] = [
  ["dl_info_data", "dlData"],
  ["dl_info_speed", "dlSpeed"],
  ["up_info_data", "upData"],
  ["up_info_speed", "upSpeed"],
];

function normalizePieces(pieces: string | string[], joinBy: string = "|"): string {
  if (Array.isArray(pieces)) {
    return pieces.join(joinBy);
  }
  return pieces;
}

// noinspection JSUnusedGlobalSymbols
export default class QBittorrent extends AbstractBittorrentClient<TorrentClientConfig> {
  readonly version = "v0.1.0";

  isLogin: boolean | null = null;
  private syncData: rawSyncMaindata = { rid: 0 };
  private lastSyncTimestamp: number = 0;

  constructor(options: Partial<TorrentClientConfig> = {}) {
    super({ ...clientConfig, ...options });
  }

  async ping(): Promise<boolean> {
    try {
      const pong = await this.login();
      this.isLogin = pong.data === "Ok.";
      return this.isLogin;
    } catch (e) {
      return false;
    }
  }

  protected async getClientVersionFromRemote(): Promise<string> {
    const { data: version } = await this.request<string>("/app/version");
    const { data: webApiVersion } = await this.request<string>("/app/webapiVersion");
    return `${version} (${webApiVersion})`;
  }

  override async getClientStatus(): Promise<TorrentClientStatus> {
    const retStatus: TorrentClientStatus = await super.getClientStatus();
    const { server_state } = await this.getSyncData();

    for (const [key, convertKey] of convertMaps) {
      if (server_state?.[key]) {
        retStatus[convertKey] = Number(server_state[key]);
      }
    }

    return retStatus as TorrentClientStatus;
  }

  override async getClientFreeSpace(): Promise<number> {
    const syncData = await this.getSyncData();
    return syncData.server_state?.["free_space_on_disk"] as number;
  }

  // qbt 默认Session时长 3600s，一次登录应该足够进行所有操作
  async login(): Promise<AxiosResponse> {
    const form = new FormData();
    form.append("username", this.config.username);
    form.append("password", this.config.password);

    return await axios.post(urlJoin(this.config.address, "/api/v2", "/auth/login"), form, {
      timeout: this.config.timeout,
      withCredentials: true,
    });
  }

  private async request<T>(path: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    if (this.isLogin === null) {
      await this.ping();
    }

    return await axios.request<T>({
      baseURL: this.config.address,
      url: urlJoin("/api/v2", path),
      timeout: this.config.timeout,
      ...config,
    });
  }

  private async getSyncData(fullSync: boolean = false) {
    if (Date.now() > this.lastSyncTimestamp + 15e3) {
      const { data } = await this.request<rawSyncMaindata>("/sync/maindata", {
        params: { rid: fullSync ? 0 : this.syncData.rid },
      });

      this.lastSyncTimestamp = Date.now();
      this.syncData = data.full_update ? data : merge(this.syncData, data);

      if (this.syncData.torrents && this.syncData.torrents_removed) {
        this.syncData.torrents_removed.forEach((hash) => delete this.syncData.torrents![hash]);
        delete this.syncData.torrents_removed;
      }

      if (this.syncData.categories && this.syncData.categories_removed) {
        this.syncData.categories_removed.forEach((cat) => delete this.syncData.categories![cat]);
        delete this.syncData.categories_removed;
      }

      if (this.syncData.tags && this.syncData.tags_removed) {
        this.syncData.tags_removed.forEach((removeTag) => {
          const tagIndex = this.syncData.tags!.findIndex((tag) => {
            return tag === removeTag;
          });
          if (tagIndex !== -1) {
            this.syncData.tags!.splice(tagIndex, 1);
          }
        });
        delete this.syncData.tags_removed;
      }
    }

    return this.syncData;
  }

  async addTorrent(url: string, options: Partial<CAddTorrentOptions> = {}): Promise<CAddTorrentResult> {
    const addResult = { success: false } as CAddTorrentResult;

    const formData = new FormData();
    const advanceAddTorrentOptions = (options.advanceAddTorrentOptions ?? {}) as Record<
      TQBittorrentAdvanceAddTorrentOptionsKey,
      any
    >;

    // 处理链接
    if (url.startsWith("magnet:") || !options.localDownload) {
      formData.append("urls", url);
    } else {
      const torrent = await getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption || {}),
      });

      formData.append("torrents", torrent.metadata.blob(), torrent.name);
    }

    // 将通用字段转成qbt字段
    if (options.savePath) {
      // 如果是 qBittorrent 的分类，则设置 autoTMM = true & category = savePath.replace(category_prefix, "")
      if (options.savePath.startsWith(category_prefix)) {
        advanceAddTorrentOptions.autoTMM = true; // 开启自动管理
        formData.append("category", options.savePath.replace(category_prefix, "")); // 分类名称
      } else {
        formData.append("savepath", options.savePath); // Download folder
      }
    }

    if (options.label) {
      formData.append("tags", options.label); // Tags for the torrent
    }

    if (options.addAtPaused) {
      // 同时发送新旧两个参数，让 qBittorrent 自动选择识别
      // qBittorrent < 5.1.0 使用 'paused' 参数
      formData.append("paused", options.addAtPaused ? "true" : "false");
      // qBittorrent 5.1.0+ 使用 'stopped' 参数
      formData.append("stopped", options.addAtPaused ? "true" : "false");
    }

    if (options.uploadSpeedLimit && options.uploadSpeedLimit > 0) {
      // Upload speed limit in bytes/sec, -1 means no limit
      formData.append("upLimit", (options.uploadSpeedLimit * 1024 * 1024).toString());
    }

    // 处理高级选项（Boolean类型）
    for (const key of QBittorrentAdvanceAddTorrentOptionsBooleanKey) {
      if (advanceAddTorrentOptions[key] === true) {
        formData.append(key, "true");
      }
    }

    const res = await this.request<"Ok." | "Fails.">("/torrents/add", {
      method: "post",
      data: formData,
    });

    addResult.success = res.data === "Ok.";
    if (!addResult.success) {
      addResult.message = res.data;
      return addResult;
    }

    return addResult;
  }

  async getAllTorrents(): Promise<QbittorrentTorrent[]> {
    const { torrents } = await this.getSyncData();
    return Object.entries(torrents!).map(([hash, torrent]) => {
      let state = CTorrentState.unknown;

      switch (torrent.state) {
        case QbittorrentTorrentState.ForcedDL:
        case QbittorrentTorrentState.Downloading:
        case QbittorrentTorrentState.MetaDL:
        case QbittorrentTorrentState.StalledDL:
          state = CTorrentState.downloading;
          break;
        case QbittorrentTorrentState.Allocating:
          // state = 'stalledDL';
          state = CTorrentState.queued;
          break;
        case QbittorrentTorrentState.ForcedUP:
        case QbittorrentTorrentState.Uploading:
        case QbittorrentTorrentState.StalledUP:
          state = CTorrentState.seeding;
          break;
        case QbittorrentTorrentState.PausedDL:
          state = CTorrentState.paused;
          break;
        case QbittorrentTorrentState.PausedUP:
          // state = 'completed';
          state = CTorrentState.paused;
          break;
        case QbittorrentTorrentState.QueuedDL:
        case QbittorrentTorrentState.QueuedUP:
          state = CTorrentState.queued;
          break;
        case QbittorrentTorrentState.CheckingDL:
        case QbittorrentTorrentState.CheckingUP:
        case QbittorrentTorrentState.QueuedForChecking:
        case QbittorrentTorrentState.CheckingResumeData:
        case QbittorrentTorrentState.Moving:
          state = CTorrentState.checking;
          break;
        case QbittorrentTorrentState.Error:
        case QbittorrentTorrentState.Unknown:
        case QbittorrentTorrentState.MissingFiles:
          state = CTorrentState.error;
          break;
        default:
          break;
      }

      const isCompleted = torrent.progress === 1;

      return {
        id: hash,
        infoHash: hash,
        name: torrent.name,
        state,
        dateAdded: torrent.added_on,
        isCompleted,
        progress: torrent.progress * 100,
        label: torrent.category,
        savePath: torrent.save_path,
        totalSize: torrent.total_size,
        ratio: torrent.ratio,
        uploadSpeed: torrent.upspeed,
        downloadSpeed: torrent.dlspeed,
        totalUploaded: torrent.uploaded,
        totalDownloaded: torrent.downloaded,
        raw: torrent,
        clientId: this.config.id,
      } as QbittorrentTorrent;
    });
  }

  // 注意方法虽然支持一次对多个种子进行操作，但仍建议每次均只操作一个种子
  async pauseTorrent(hashes: string | string[] | "all"): Promise<boolean> {
    const params = {
      hashes: hashes === "all" ? "all" : normalizePieces(hashes),
    };
    await this.request("/torrents/pause", { params });
    return true;
  }

  // 注意方法虽然支持一次对多个种子进行操作，但仍建议每次均只操作一个种子
  async removeTorrent(hashes: string | string[] | "all", removeData: boolean = false): Promise<boolean> {
    const params = {
      hashes: hashes === "all" ? "all" : normalizePieces(hashes),
      removeData,
    };
    await this.request("/torrents/delete", { params });
    return true;
  }

  // 注意方法虽然支持一次对多个种子进行操作，但仍建议每次均只操作一个种子
  async resumeTorrent(hashes: string | string[] | "all"): Promise<any> {
    const params = {
      hashes: hashes === "all" ? "all" : normalizePieces(hashes),
    };
    await this.request("/torrents/resume", { params });
    return true;
  }

  private async getClientCategories(): Promise<Record<string, { name: string; savePath: string }>> {
    const { data: categories } =
      await this.request<Record<string, { name: string; savePath: string }>>("/torrents/categories");
    return categories;
  }

  public override async getClientPaths(): Promise<string[]> {
    const savePaths: string[] = await super.getClientPaths();
    const categories = await this.getClientCategories();

    return [...Object.keys(categories).map((cat) => category_prefix + cat), ...savePaths].filter(Boolean);
  }

  // 获取客户端中的已有的标签
  public override async getClientLabels(): Promise<string[]> {
    const { data } = await this.request<string[]>("/torrents/tags");
    return data;
  }
}
