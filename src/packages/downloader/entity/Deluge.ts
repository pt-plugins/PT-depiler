/**
 * @see https://deluge.readthedocs.io/en/latest/reference/webapi.html
 */
import {
  CAddTorrentOptions,
  CustomPathDescription,
  CTorrent,
  DownloaderBaseConfig,
  TorrentClientMetaData,
  CTorrentFilterRules,
  CTorrentState,
  TorrentClientStatus,
  AbstractBittorrentClient,
  CAddTorrentResult,
  TorrentSpeedLimit,
  CTorrentFile,
  CTorrentFileSelection,
  CTorrentPeer,
  CTorrentTracker,
  CTrackerState,
  TorrentFilePriority,
} from "../types";
import urlJoin from "url-join";
import axios from "axios";
import { getRemoteTorrentFile } from "../utils";

export const clientConfig: DownloaderBaseConfig = {
  type: "Deluge",
  name: "Deluge",
  address: "http://localhost:8112/",
  password: "",
  timeout: 60 * 1e3,
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: "Deluge 是一个通过PyGTK建立图形界面的BitTorrent客户端",
  warning: [
    "仅支持Deluge Web，非Deluge Daemon的直接支持，具体原因请见 issue #207",
    "注意：由于 Deluge 验证机制限制，第一次测试连接成功后，后续测试无论密码正确与否都会提示成功。",
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
      allowed: true,
    },
    Queue: {
      allowed: false,
    },
    SpeedLimit: {
      allowed: true,
    },
    Label: {
      allowed: true,
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
  // refs: https://github.com/deluge-torrent/deluge/blob/6ec1479cdbbfed269844041d1001de657594d6da/deluge/core/torrent.py#L121-L148
  advanceAddTorrentOptions: [
    {
      name: "自动管理",
      key: "auto_managed",
      type: "boolean",
      defaultValue: false,
      description: "Set torrent to auto managed mode, i.e. will be started or queued automatically.",
    },
    {
      name: "完成后自动移动",
      key: "move_completed",
      type: "boolean",
      defaultValue: false,
      description: "Move the torrent when downloading has finished.",
    },
    {
      name: "预分配存储",
      key: "pre_allocate_storage",
      type: "boolean",
      defaultValue: false,
      description: "When adding the torrent should all files be pre-allocated.",
    },
    {
      name: "先下载首尾文件块",
      key: "prioritize_first_last_pieces",
      type: "boolean",
      defaultValue: false,
      description: "Prioritize the first and last pieces of the torrent.",
    },
    {
      name: "达到分享率时自动删除",
      key: "remove_at_ratio",
      type: "boolean",
      defaultValue: false,
      description: "Remove torrent when ratio is reached.",
    },
    {
      name: "发种模式",
      key: "seed_mode",
      type: "boolean",
      defaultValue: false,
      description: "Assume that all files are present for this torrent (Only used when adding a torent).",
    },
    {
      name: "顺序下载",
      key: "sequential_download",
      type: "boolean",
      defaultValue: false,
      description: "Download the pieces of the torrent in order.",
    },
    {
      name: "超级做种模式",
      key: "super_seeding",
      type: "boolean",
      defaultValue: false,
      description: "Enable super seeding/initial seeding.",
    },
  ],
};

const DelugeAdvanceAddTorrentOptionsBooleanKey = clientMetaData
  .advanceAddTorrentOptions!.filter((x) => x.type === "boolean")
  .map((x) => x.key) as [
  "auto_managed",
  "move_completed",
  "pre_allocate_storage",
  "prioritize_first_last_pieces",
  "remove_at_ratio",
  "seed_mode",
  "sequential_download",
  "super_seeding",
];
type TDelugeAdvanceAddTorrentOptionsBooleanKey = (typeof DelugeAdvanceAddTorrentOptionsBooleanKey)[number];
type TDelugeAdvanceAddTorrentOptionsKey = TDelugeAdvanceAddTorrentOptionsBooleanKey | string;

type DelugeMethod =
  | "auth.login"
  | "web.update_ui"
  | "core.get_torrents_status"
  | "core.add_torrent_url"
  | "core.add_torrent_file"
  | "core.get_free_space"
  | "core.get_session_status"
  | "core.remove_torrent"
  | "core.pause_torrent"
  | "core.resume_torrent"
  | "core.force_recheck"
  | "core.set_torrent_options"
  | "core.set_torrent_file_priorities"
  | "core.set_torrent_trackers"
  | "daemon.info"
  | "core.get_libtorrent_version"
  | "label.set_torrent";

interface DelugeDefaultResponse<T = any> {
  /**
   * mostly usless id that increments with every request
   */
  id: number;
  error: null | string;
  result: T;
}

// Deluge 文件优先级: 0=Ignore, 1=Normal, 2=High, 5=Highest（无 low）
function mapDelugeFilePriority(priority: number): TorrentFilePriority {
  switch (priority) {
    case 0:
      return "skip";
    case 2:
      return "high";
    case 5:
      return "highest";
    case 1:
    default:
      return "normal";
  }
}

function mapTorrentFilePriorityToDeluge(priority: TorrentFilePriority): number {
  switch (priority) {
    case "skip":
      return 0;
    case "high":
      return 2;
    case "highest":
      return 5;
    case "low":
    case "normal":
    default:
      return 1;
  }
}

// Deluge tracker_status 为自由文本，按关键词归一化
function mapDelugeTrackerState(status: string | undefined): { state: CTrackerState; message?: string } {
  const text = status ?? "";
  const lower = text.toLowerCase();
  if (lower.includes("error")) {
    return { state: CTrackerState.error, message: status };
  }
  if (lower.includes("updating")) {
    return { state: CTrackerState.updating, message: status };
  }
  if (lower.includes("disabled")) {
    return { state: CTrackerState.disabled, message: status };
  }
  if (text.length === 0) {
    return { state: CTrackerState.unknown };
  }
  return { state: CTrackerState.working, message: status };
}

type DelugeTorrentField =
  | "comment"
  | "active_time"
  | "is_seed"
  | "hash"
  | "upload_payload_rate"
  | "move_completed_path"
  | "private"
  | "total_payload_upload"
  | "paused"
  | "seed_rank"
  | "seeding_time"
  | "max_upload_slots"
  | "prioritize_first_last"
  | "distributed_copies"
  | "download_payload_rate"
  | "message"
  | "num_peers"
  | "max_download_speed"
  | "max_connections"
  | "compact"
  | "ratio"
  | "total_peers"
  | "total_size"
  | "total_wanted"
  | "state"
  | "file_priorities"
  | "max_upload_speed"
  | "remove_at_ratio"
  | "tracker"
  | "save_path"
  | "progress"
  | "time_added"
  | "tracker_host"
  | "total_uploaded"
  | "files"
  | "total_done"
  | "num_pieces"
  | "tracker_status"
  | "total_seeds"
  | "move_on_completed"
  | "next_announce"
  | "stop_at_ratio"
  | "file_progress"
  | "move_completed"
  | "piece_length"
  | "all_time_download"
  | "move_on_completed_path"
  | "num_seeds"
  | "peers"
  | "name"
  | "trackers"
  | "total_payload_download"
  | "is_auto_managed"
  | "seeds_peers_ratio"
  | "queue"
  | "num_files"
  | "eta"
  | "stop_ratio"
  | "is_finished"
  | "label"; // if they don't have the label plugin it shouldn't fail

interface DelugeRawTorrent {
  hash: string;
  name: string;
  progress: number;
  ratio: number;
  time_added: number;
  save_path: string;
  label?: string;
  state: "Downloading" | "Seeding" | "Active" | "Paused" | "Queued" | "Checking" | "Error";
  total_size: number;
  upload_payload_rate: number;
  download_payload_rate: number;
  total_uploaded: number;
  total_done: number;
  trackers?: Array<{ url: string; tier: number }>;
}

interface DelugeTorrentFilterRules extends CTorrentFilterRules {
  hash?: string;
  state?: string;
}

// noinspection JSUnusedGlobalSymbols
export default class Deluge extends AbstractBittorrentClient {
  readonly version = "v0.1.0";

  private readonly address: string;
  private _msgId: number;
  private isLogin = false;

  private torrentRequestField: DelugeTorrentField[] = [
    "hash",
    "name",
    "progress",
    "ratio",
    "time_added",
    "save_path",
    "label",
    "state",
    "total_size",
    "trackers",
  ];

  constructor(options: Partial<DownloaderBaseConfig>) {
    super({ ...clientConfig, ...options });
    this._msgId = 0;

    // 修正服务器地址
    let address = this.config.address;
    if (address.indexOf("json") === -1) {
      address = urlJoin(address, "/json");
    }
    this.address = address;
  }

  async ping(): Promise<boolean> {
    return await this.login();
  }

  protected async getClientVersionFromRemote(): Promise<string> {
    const version = await this.request<string>("daemon.info");
    const ltVersion = await this.request<string>("core.get_libtorrent_version");
    return `${version} (lt ${ltVersion})`;
  }

  override async getClientStatus(): Promise<TorrentClientStatus> {
    const statusKeys = ["download_rate", "upload_rate", "total_download", "total_upload"] as const;
    const statusData = await this.request<Record<(typeof statusKeys)[number], number>>("core.get_session_status", [
      statusKeys,
    ]);

    return {
      upSpeed: statusData.upload_rate,
      dlSpeed: statusData.download_rate,
      upData: statusData.total_upload,
      dlData: statusData.total_download,
    };
  }

  override async getClientFreeSpace(): Promise<number> {
    return await this.request<number>("core.get_free_space");
  }

  async addTorrent(url: string, options: Partial<CAddTorrentOptions> = {}): Promise<CAddTorrentResult> {
    const addResult = { success: false } as CAddTorrentResult;

    const delugeOptions: any = {
      add_paused: options.addAtPaused ?? false,
    };
    const advanceAddTorrentOptions = (options.advanceAddTorrentOptions ?? {}) as Record<
      TDelugeAdvanceAddTorrentOptionsKey,
      any
    >;

    if (options.savePath) {
      delugeOptions.download_location = options.savePath;
    }

    if (options.uploadSpeedLimit && options.uploadSpeedLimit > 0) {
      // Upload speed limit in KB/s for Deluge
      delugeOptions.max_upload_speed = options.uploadSpeedLimit * 1024;
    }

    // 处理高级选项（Boolean类型）
    for (const key of DelugeAdvanceAddTorrentOptionsBooleanKey) {
      if (advanceAddTorrentOptions[key] === true) {
        delugeOptions[key] = advanceAddTorrentOptions[key];
      }
    }

    // 由于Deluge添加链接和种子的方法名不一样，分开处理
    let method: "core.add_torrent_file" | "core.add_torrent_url";
    let params: any;
    if (url.startsWith("magnet:") || !options.localDownload) {
      // 链接 add_torrent_url
      method = "core.add_torrent_url";
      params = [url, delugeOptions];
    } else {
      // 文件 add_torrent_file
      method = "core.add_torrent_file";

      const torrent = await getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption || {}),
      });

      params = ["", torrent.metadata.base64(), delugeOptions];
    }

    try {
      const result = await this.request<any>(method, params);
      if (result !== null && options.label) {
        try {
          const torrentHash = result[0][1];
          await this.request("label.set_torrent", [torrentHash, options.label]);
        } catch (e) {} // 即使失败了也没关系
      }

      addResult.success = result !== null;

      if (!addResult.success) {
        addResult.message = result;
      }
    } catch (e) {}

    return addResult;
  }

  async getAllTorrents(): Promise<CTorrent<DelugeRawTorrent>[]> {
    return await this.getTorrentsBy({});
  }

  override async getTorrentsBy(filter: DelugeTorrentFilterRules): Promise<CTorrent<DelugeRawTorrent>[]> {
    if (filter.ids) {
      filter.hash = filter.ids;
      delete filter.ids;
    }

    if (filter.complete) {
      filter.state = "Seeding";
      delete filter.complete;
    }

    const torrents = await this.request<Record<string, DelugeRawTorrent>>("core.get_torrents_status", [
      filter,
      this.torrentRequestField,
    ]);

    return Object.values(torrents).map((torrent) => {
      // normalize state to enum
      let state = CTorrentState.unknown;
      if (Object.keys(CTorrentState).includes(torrent.state.toLowerCase())) {
        state = CTorrentState[torrent.state.toLowerCase() as keyof typeof CTorrentState];
      }

      return {
        id: torrent.hash,
        infoHash: torrent.hash,
        isCompleted: torrent.progress >= 100,
        dateAdded: torrent.time_added,
        name: torrent.name,
        progress: torrent.progress,
        ratio: torrent.ratio,
        savePath: torrent.save_path,
        state,
        totalSize: torrent.total_size,
        uploadSpeed: torrent.upload_payload_rate,
        downloadSpeed: torrent.download_payload_rate,
        totalUploaded: torrent.total_uploaded,
        totalDownloaded: torrent.total_done,
        raw: torrent,
        clientId: this.config.id,
      } as CTorrent<DelugeRawTorrent>;
    });
  }

  async pauseTorrent(id: any): Promise<boolean> {
    try {
      return await this.request<boolean>("core.pause_torrent", [id]);
    } catch (e) {
      return false;
    }
  }

  async removeTorrent(id: string, removeData = false): Promise<boolean> {
    try {
      return await this.request<boolean>("core.remove_torrent", [id, removeData]);
    } catch (e) {
      return false;
    }
  }

  async resumeTorrent(id: any): Promise<boolean> {
    try {
      return await this.request<boolean>("core.resume_torrent", [id]);
    } catch (e) {
      return false;
    }
  }

  async getTorrentTrackers(torrent: CTorrent): Promise<string[]> {
    let rawTrackers: Array<{ url: string; tier: number }>;
    if (typeof torrent === "object" && Array.isArray(torrent.raw?.trackers)) {
      rawTrackers = torrent.raw.trackers;
    } else {
      const hash = torrent.infoHash || (torrent.id as string);
      const result = await this.request<Record<string, Required<DelugeRawTorrent>>>("core.get_torrents_status", [
        { hash },
        ["trackers"],
      ]);

      const torrentData = Object.values(result)[0];
      rawTrackers = torrentData?.trackers;
    }

    if (!rawTrackers) return [];

    return rawTrackers.map((t) => t.url);
  }

  // 重新校验种子
  override async recheckTorrent(id: any): Promise<boolean> {
    try {
      return await this.request<boolean>("core.force_recheck", [id]);
    } catch (e) {
      return false;
    }
  }

  // 设置单个种子的速度限制（单位 KiB/s，0 表示不限速；Deluge 使用 KiB/s，-1 表示不限速）
  override async setTorrentSpeedLimit(id: any, limits: TorrentSpeedLimit): Promise<boolean> {
    try {
      const options: Record<string, number> = {};
      if (typeof limits.download !== "undefined") {
        options.max_download_speed = limits.download > 0 ? limits.download : -1;
      }
      if (typeof limits.upload !== "undefined") {
        options.max_upload_speed = limits.upload > 0 ? limits.upload : -1;
      }
      return await this.request<boolean>("core.set_torrent_options", [id, options]);
    } catch (e) {
      return false;
    }
  }

  // 设置单个种子的标签
  override async setTorrentLabel(id: any, label: string): Promise<boolean> {
    try {
      return await this.request<boolean>("label.set_torrent", [id, label]);
    } catch (e) {
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // 文件级 / peers / tracker 管理（Deluge WebAPI）
  // ─────────────────────────────────────────────

  private getTorrentHash(torrent: string | CTorrent): string {
    if (typeof torrent === "string") {
      return torrent;
    }
    return (torrent.infoHash || (torrent.id as string)) as string;
  }

  // 文件列表: core.get_torrents_status fields files/file_progress/file_priorities
  override async getTorrentFiles(torrent: string | CTorrent): Promise<CTorrentFile[]> {
    const hash = this.getTorrentHash(torrent);
    const result = await this.request<Record<string, any>>("core.get_torrents_status", [
      { hash },
      ["files", "file_progress", "file_priorities"],
    ]);
    const torrentData: any = Object.values(result)[0];
    const files: Array<{ index: number; path: string; size: number }> = torrentData?.files ?? [];
    const fileProgress: number[] = torrentData?.file_progress ?? [];
    const filePriorities: number[] = torrentData?.file_priorities ?? [];

    return files.map((file, index) => {
      const priority = mapDelugeFilePriority(filePriorities[index] ?? 1);
      return {
        index: file.index ?? index,
        name: file.path.split(/[/\\]/).pop() || file.path,
        path: file.path,
        size: file.size,
        progress: (fileProgress[index] ?? 0) * 100,
        priority,
        wanted: priority !== "skip",
        raw: { file, progress: fileProgress[index], priority: filePriorities[index] },
      };
    });
  }

  // 文件优先级/选择: core.set_torrent_file_priorities（全量数组，先读后改）
  override async setTorrentFilePriority(
    torrent: string | CTorrent,
    selections: CTorrentFileSelection[],
  ): Promise<boolean> {
    if (selections.length === 0) {
      return true;
    }
    const hash = this.getTorrentHash(torrent);

    const result = await this.request<Record<string, { file_priorities?: number[] }>>("core.get_torrents_status", [
      { hash },
      ["file_priorities"],
    ]);
    const priorities = (Object.values(result)[0]?.file_priorities ?? []).slice();

    for (const selection of selections) {
      if (selection.index >= 0 && selection.index < priorities.length) {
        priorities[selection.index] = mapTorrentFilePriorityToDeluge(selection.priority);
      }
    }

    try {
      await this.request<boolean>("core.set_torrent_file_priorities", [hash, priorities]);
      return true;
    } catch (e) {
      return false;
    }
  }

  // peer 列表: core.get_torrents_status fields peers
  override async getTorrentPeers(torrent: string | CTorrent): Promise<CTorrentPeer[]> {
    const hash = this.getTorrentHash(torrent);
    const result = await this.request<Record<string, any>>("core.get_torrents_status", [{ hash }, ["peers"]]);
    const peers: Array<{
      client?: string;
      country?: string;
      down_speed?: number;
      encrypted?: boolean;
      ip?: string;
      port?: number;
      progress?: number; // 0-1
      seed?: boolean;
      up_speed?: number;
    }> = Object.values(result)[0]?.peers ?? [];

    return peers
      .filter((peer) => !!peer.ip)
      .map((peer) => ({
        ip: peer.ip!,
        port: peer.port,
        client: peer.client,
        progress: (peer.progress ?? 0) * 100,
        downloadSpeed: peer.down_speed ?? 0,
        uploadSpeed: peer.up_speed ?? 0,
        encrypted: peer.encrypted,
        preferred: peer.seed,
        country: peer.country,
        raw: peer,
      }));
  }

  // tracker 列表（带状态）: core.get_torrents_status fields trackers/tracker_status
  override async getTorrentTrackersDetail(torrent: string | CTorrent): Promise<CTorrentTracker[]> {
    const hash = this.getTorrentHash(torrent);
    const result = await this.request<Record<string, any>>("core.get_torrents_status", [
      { hash },
      ["trackers", "tracker_status"],
    ]);
    const torrentData: any = Object.values(result)[0];
    const trackers: Array<{ url: string; tier: number }> = torrentData?.trackers ?? [];
    const trackerStatus: string | undefined = torrentData?.tracker_status;

    return trackers.map((tracker) => {
      const { state, message } = mapDelugeTrackerState(trackerStatus);
      return {
        url: tracker.url,
        tier: tracker.tier ?? 0,
        status: state,
        statusMessage: message,
        enabled: state !== CTrackerState.disabled,
        raw: tracker,
      };
    });
  }

  // 新增 tracker: core.set_torrent_trackers（全量替换，先读后加）
  override async addTorrentTracker(torrent: string | CTorrent, url: string): Promise<boolean> {
    const hash = this.getTorrentHash(torrent);
    const current = await this.getTorrentTrackersDetail(hash);
    if (current.some((t) => t.url === url)) {
      return true;
    }

    const nextTier = current.length ? Math.max(...current.map((t) => t.tier)) + 1 : 0;
    await this.request<boolean>("core.set_torrent_trackers", [
      hash,
      [...current.map((t) => ({ url: t.url, tier: t.tier })), { url, tier: nextTier }],
    ]);
    return true;
  }

  // 删除 tracker: core.set_torrent_trackers（全量替换，先读后删）
  override async removeTorrentTracker(torrent: string | CTorrent, url: string): Promise<boolean> {
    const hash = this.getTorrentHash(torrent);
    const current = await this.getTorrentTrackersDetail(hash);
    const rest = current.filter((t) => t.url !== url);
    if (rest.length === current.length) {
      return true;
    }

    await this.request<boolean>("core.set_torrent_trackers", [hash, rest.map((t) => ({ url: t.url, tier: t.tier }))]);
    return true;
  }

  private async login(): Promise<boolean> {
    try {
      this.isLogin = await this.request<boolean>("auth.login", [this.config.password]);
      return this.isLogin;
    } catch (e) {
      return false;
    }
  }

  private async request<T>(method: DelugeMethod, params: any[] = []): Promise<T> {
    // 防止循环调用
    if (!this.isLogin && method !== "auth.login") {
      await this.login();
    }

    const {
      data: { result },
    } = await axios.post<DelugeDefaultResponse<T>>(
      this.address,
      {
        id: this._msgId++,
        method: method,
        params: params,
      },
      {
        responseType: "json",
      },
    );
    return result;
  }
}
