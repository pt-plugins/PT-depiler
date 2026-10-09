/**
 * 使用 ws + rpc-secret 形式访问，
 * 原因在于如果发送metadata的话，使用 http 会空返回，
 * 但是允许用户填入 http:// 开头的地址
 */
import {
  CAddTorrentOptions,
  CustomPathDescription,
  CTorrent,
  DownloaderBaseConfig,
  TorrentClientMetaData,
  CTorrentState,
  TorrentClientStatus,
  AbstractBittorrentClient,
  CAddTorrentResult,
  TorrentQueueDirection,
  TorrentSpeedLimit,
  CTorrentFile,
  TorrentFilePriority,
} from "../types";
import { getRemoteTorrentFile } from "../utils";
import urlJoin from "url-join";

export const clientConfig: DownloaderBaseConfig = {
  type: "Aria2",
  name: "Aria2",
  address: "http://localhost:6800/jsonrpc",
  password: "",
  timeout: 60 * 1e3,
};

export const clientMetaData: TorrentClientMetaData = {
  description: "Aria2是一款自由、跨平台命令行界面的下载管理器",
  warning: ["使用 WebSocket + `rpc-secret` 形式连接，请设置好 `rpc-secret` 配置项", "不支持使用用户名+密码的认证方式"],
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
      allowed: true,
    },
    SpeedLimit: {
      allowed: true,
    },
    Label: {
      allowed: false,
    },
    BypassCSRF: {
      allowed: false,
    },
    // aria2 仅支持只读文件列表（无优先级/选择能力）
    FileList: {
      allowed: true,
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

type METHODS =
  | "aria2.addUri"
  | "aria2.addTorrent"
  | "aria2.getPeers"
  | "aria2.addMetalink"
  | "aria2.remove"
  | "aria2.pause"
  | "aria2.forcePause"
  | "aria2.pauseAll"
  | "aria2.forcePauseAll"
  | "aria2.unpause"
  | "aria2.unpauseAll"
  | "aria2.forceRemove"
  | "aria2.changePosition"
  | "aria2.tellStatus"
  | "aria2.getUris"
  | "aria2.getFiles"
  | "aria2.getServers"
  | "aria2.tellActive"
  | "aria2.tellWaiting"
  | "aria2.tellStopped"
  | "aria2.getOption"
  | "aria2.changeUri"
  | "aria2.changeOption"
  | "aria2.getGlobalOption"
  | "aria2.changeGlobalOption"
  | "aria2.purgeDownloadResult"
  | "aria2.removeDownloadResult"
  | "aria2.getVersion"
  | "aria2.getSessionInfo"
  | "aria2.shutdown"
  | "aria2.forceShutdown"
  | "aria2.getGlobalStat"
  | "aria2.saveSession"
  | "system.multicall"
  | "system.listMethods"
  | "system.listNotifications";

type multiCallParams = {
  methodName: METHODS;
  params: any[];
}[];

interface jsonRPCResponse<Data> {
  id: string;
  jsonrpc: "2.0";
  result: Data;
  error?: { code: number; message: string };
}

// 一条已发出、等待响应的 JSON-RPC 请求
interface IPendingRequest {
  resolve: (data: jsonRPCResponse<any>) => void;
  reject: (error: Error) => void;
  timer?: ReturnType<typeof setTimeout>;
}

interface rawTask {
  bitfield: string;
  completedLength: number;
  connections: `${1 | 0}`;
  dir: string;
  downloadSpeed: number;
  files: {
    completedLength: number;
    index: number;
    length: number;
    path: string;
    selected: string;
    uris: {
      status: string;
      url: string;
    }[];
  }[];
  gid: string;
  numPieces: number;
  pieceLength: number;
  status:
    | "active" // active for currently downloading/seeding downloads.
    | "waiting" // waiting for downloads in the queue; download is not started.
    | "paused" // paused for paused downloads.
    | "error" // error for downloads that were stopped because of error.
    | "complete" // complete for stopped and completed downloads.
    | "removed"; // removed for the downloads removed by user.
  totalLength: number;
  uploadLength: number;
  uploadSpeed: number;

  // If it is a bittorrent
  bittorrent?: {
    announceList: string[][];
    comment: string;
    creationDate: number;
    info: {
      name: string;
    };
    mode: "single" | "multi";
  };
  infoHash?: string;
  seeder?: string;
  numSeeders?: number;
}

export default class Aria2 extends AbstractBittorrentClient {
  readonly version = "v0.1.0";

  private _wsClient: WebSocket;
  private _msgId = 0;

  // 已发出但尚未收到响应的请求，按 JSON-RPC 的 id 索引（并发请求各自独立，不会相互串扰）
  private readonly _pendingRequests = new Map<string, IPendingRequest>();

  get msgId() {
    return this._msgId++;
  }

  constructor(options: Partial<DownloaderBaseConfig>) {
    super({ ...clientConfig, ...options });

    // 修正服务器地址
    let address = this.config.address;
    if (address.indexOf("jsonrpc") === -1) {
      address = urlJoin(address, "/jsonrpc");
    }
    this.config.address = address;

    // https -> wss , http -> ws
    this._wsClient = new WebSocket(address.replace(/^http/, "ws"));

    // 监听器只在实例化时注册一次，避免每次请求都 addEventListener 导致监听器泄漏
    this._wsClient.addEventListener("message", (event) => this.onSocketMessage(event));
    this._wsClient.addEventListener("close", () => this.rejectAllPendingRequests("Aria2 WebSocket closed"));
  }

  private onSocketMessage(event: MessageEvent) {
    let data: jsonRPCResponse<any>;
    try {
      data = JSON.parse(event.data as string);
    } catch {
      return; // 忽略无法解析的消息
    }

    const id = String(data.id);
    const pending = this._pendingRequests.get(id);
    if (!pending) {
      return; // 不是本实例发出的请求（或该请求已超时/已结束）
    }

    this._pendingRequests.delete(id);
    if (pending.timer) {
      clearTimeout(pending.timer);
    }

    if (data.error) {
      // 按 JSON-RPC 协议将错误响应作为异常抛出，错误信息即 aria2 返回的 message
      pending.reject(new Error(data.error.message || "WS ERROR"));
    } else {
      pending.resolve(data);
    }
  }

  private rejectAllPendingRequests(reason: string) {
    this._pendingRequests.forEach((pending) => {
      if (pending.timer) {
        clearTimeout(pending.timer);
      }
      pending.reject(new Error(reason));
    });
    this._pendingRequests.clear();
  }

  /**
   * WebSocket 处于 CONNECTING 状态时 send() 会抛 InvalidStateError，
   * 而实例创建后往往会立刻发起首个请求（如「检查连接性」的 ping），故这里先等待 socket 就绪
   */
  private async waitSocketReady(): Promise<void> {
    const ws = this._wsClient;
    if (ws.readyState === WebSocket.OPEN) {
      return;
    }
    if (ws.readyState !== WebSocket.CONNECTING) {
      throw new Error("Aria2 WebSocket is not open");
    }

    await new Promise<void>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | undefined;

      const cleanup = () => {
        ws.removeEventListener("open", onOpen);
        ws.removeEventListener("error", onError);
        ws.removeEventListener("close", onClose);
        if (timer) {
          clearTimeout(timer);
        }
      };
      const onOpen = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Aria2 WebSocket connection error"));
      };
      const onClose = () => {
        cleanup();
        reject(new Error("Aria2 WebSocket closed before open"));
      };

      ws.addEventListener("open", onOpen);
      ws.addEventListener("error", onError);
      ws.addEventListener("close", onClose);

      // 与请求超时语义保持一致：timeout 为 0 表示不超时
      const timeout = this.config.timeout ?? 0;
      if (timeout > 0) {
        timer = setTimeout(() => {
          cleanup();
          reject(new Error("Aria2 WebSocket connect timeout"));
        }, timeout);
      }
    });
  }

  private async methodSend<T>(methodName: METHODS, params: any[] = []): Promise<jsonRPCResponse<T>> {
    let postParams;
    if (methodName === "system.multicall") {
      (params as multiCallParams).forEach((x) => {
        x.params = [`token:${this.config.password}`, ...x.params];
      });

      postParams = [params];
    } else {
      postParams = [`token:${this.config.password}`, ...params];
    }

    const msgId = String(this.msgId);

    await this.waitSocketReady();

    return new Promise<jsonRPCResponse<T>>((resolve, reject) => {
      const pending: IPendingRequest = { resolve, reject };

      // timeout 为 0 表示不超时，与其余下载器 axios timeout 的语义保持一致
      const timeout = this.config.timeout ?? 0;
      if (timeout > 0) {
        pending.timer = setTimeout(() => {
          this._pendingRequests.delete(msgId);
          reject(new Error(`Aria2 WebSocket request timeout: ${methodName}`));
        }, timeout);
      }

      this._pendingRequests.set(msgId, pending);

      try {
        this._wsClient.send(
          JSON.stringify({
            method: methodName,
            id: msgId,
            params: postParams,
          }),
        );
      } catch (e) {
        // socket 未就绪等情况下 send() 会同步抛错
        this._pendingRequests.delete(msgId);
        if (pending.timer) {
          clearTimeout(pending.timer);
        }
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
  }

  async ping(): Promise<boolean> {
    try {
      const { result: pingData } = await this.methodSend<{
        version: string;
        enabledFeatures: string[];
      }>("aria2.getVersion");
      return pingData.version.includes(".");
    } catch (e) {
      return false;
    }
  }

  protected async getClientVersionFromRemote(): Promise<string> {
    const { result: versionData } = await this.methodSend<{
      version: string;
      enabledFeatures: string[];
    }>("aria2.getVersion");
    return versionData.version;
  }

  // Aria2 只能知道当前的传输速度，其他都不知道
  override async getClientStatus(): Promise<TorrentClientStatus> {
    const { result: statusData } = await this.methodSend<{
      downloadSpeed: string;
      uploadSpeed: string;
    }>("aria2.getGlobalStat");
    return {
      dlSpeed: Number(statusData.downloadSpeed),
      upSpeed: Number(statusData.uploadSpeed),
    };
  }

  async addTorrent(url: string, options: Partial<CAddTorrentOptions> = {}): Promise<CAddTorrentResult> {
    const addResult = { success: false } as CAddTorrentResult;

    const addOption: any = { pause: options.addAtPaused ?? false };

    if (options.savePath) {
      addOption.dir = options.savePath;
    }

    let method: "aria2.addUri" | "aria2.addTorrent";
    let params: any;
    if (url.startsWith("magnet:") || !options.localDownload) {
      // 链接 add_torrent_url
      method = "aria2.addUri";
      params = [[url], addOption];
    } else {
      // 文件 add_torrent_file
      method = "aria2.addTorrent";

      const torrent = await getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption ?? {}),
      });

      params = [torrent.metadata.base64(), [], addOption];
    }

    try {
      // 注意：methodSend 返回的是 JSON-RPC 响应信封，真正的 gid 在 result 中
      const { result: gid } = await this.methodSend<string>(method, params);
      addResult.id = gid;

      // 设置上传速度限制 - 必须在添加后使用 aria2.changeOption
      if (options.uploadSpeedLimit && options.uploadSpeedLimit > 0) {
        try {
          await this.methodSend("aria2.changeOption", [
            gid,
            {
              "max-upload-limit": `${options.uploadSpeedLimit * 1024}K`,
            },
          ]);
        } catch (e) {
          // 种子此时已经添加成功，限速失败不影响添加结果，但记录错误便于排查
          addResult.message = e instanceof Error ? e.message : String(e);
        }
      }

      addResult.success = true;
    } catch (e) {
      addResult.message = e instanceof Error ? e.message : String(e);
    }

    return addResult;
  }

  async getAllTorrents(): Promise<CTorrent<rawTask>[]> {
    const torrents: CTorrent[] = [];
    const { result: tasks } = await this.methodSend<[[rawTask[]], [rawTask[]], [rawTask[]]]>("system.multicall", [
      {
        methodName: "aria2.tellActive",
        params: [],
      },
      {
        methodName: "aria2.tellWaiting",
        params: [0, 1000],
      },
      {
        methodName: "aria2.tellStopped",
        params: [0, 1000],
      },
    ] as multiCallParams);

    tasks.forEach((task) => {
      task[0].forEach((rawTask) => {
        // 注意，我们只筛选bittorrent种子，对于其他类型的task，我们不做筛选
        if (rawTask.bittorrent) {
          torrents.push(this.parseRawTorrent(rawTask));
        }
      });
    });

    return torrents;
  }

  override async getTorrent(id: string): Promise<CTorrent<rawTask>> {
    const { result: task } = await this.methodSend<rawTask>("aria2.tellStatus", [id]);
    return this.parseRawTorrent(task);
  }

  async pauseTorrent(id: string): Promise<boolean> {
    await this.methodSend<string>("aria2.pause", [id]);
    return true;
  }

  async removeTorrent(id: string, removeData?: boolean): Promise<boolean> {
    // aria2.remove 只对 active/waiting/paused 的任务有效，对已完成/出错（stopped）的任务会返回错误，
    // 此处忽略其失败，统一交由 removeDownloadResult 清理（stopped 状态的任务只能用后者移出列表）
    await this.methodSend<string>("aria2.remove", [id]).catch(() => undefined);
    await this.methodSend<"OK">("aria2.removeDownloadResult", [id]);
    return true;
  }

  async resumeTorrent(id: any): Promise<boolean> {
    await this.methodSend<string>("aria2.unpause", [id]);
    return true;
  }

  async getTorrentTrackers(_torrent: CTorrent): Promise<string[]> {
    return [];
  }

  // 调整任务在队列中的位置（aria2.changePosition）
  override async moveTorrentInQueue(id: any, direction: TorrentQueueDirection): Promise<boolean> {
    const positionMap: Record<TorrentQueueDirection, [number, "POS_SET" | "POS_CUR" | "POS_END"]> = {
      top: [0, "POS_SET"],
      up: [-1, "POS_CUR"],
      down: [1, "POS_CUR"],
      bottom: [0, "POS_END"],
    };
    const [pos, how] = positionMap[direction];
    await this.methodSend<string>("aria2.changePosition", [id, pos, how]);
    return true;
  }

  // 设置单个任务的速度限制（单位 KiB/s，0 表示不限速；aria2 使用 K 后缀）
  override async setTorrentSpeedLimit(id: any, limits: TorrentSpeedLimit): Promise<boolean> {
    const options: Record<string, string> = {};
    if (typeof limits.download !== "undefined") {
      options["max-download-limit"] = limits.download > 0 ? `${limits.download}K` : "0";
    }
    if (typeof limits.upload !== "undefined") {
      options["max-upload-limit"] = limits.upload > 0 ? `${limits.upload}K` : "0";
    }
    await this.methodSend("aria2.changeOption", [id, options]);
    return true;
  }

  private parseRawTorrent(rawTask: rawTask): CTorrent<rawTask> {
    const progress = rawTask.completedLength / rawTask.totalLength || 0;
    let state = CTorrentState.unknown;
    switch (rawTask.status) {
      case "active":
        state = progress >= 100 ? CTorrentState.seeding : CTorrentState.downloading;
        break;

      case "error":
      case "removed":
        state = CTorrentState.error;
        break;

      case "complete":
      case "paused":
        state = CTorrentState.paused;
        break;

      case "waiting":
        state = CTorrentState.queued;
        break;
    }

    return {
      id: rawTask.gid,
      infoHash: rawTask.infoHash!,
      name: rawTask.bittorrent!.info.name,
      progress,
      isCompleted: progress >= 100,
      ratio: rawTask.uploadLength / rawTask.totalLength || 0,
      dateAdded: 0, // Aria2 不返回添加时间
      savePath: rawTask.dir,
      state,
      totalSize: Number(rawTask.totalLength),
      totalUploaded: Number(rawTask.uploadLength),
      totalDownloaded: Number(rawTask.completedLength),
      uploadSpeed: Number(rawTask.uploadSpeed),
      downloadSpeed: Number(rawTask.downloadSpeed),
      raw: rawTask,
      clientId: this.config.id,
    } as CTorrent<rawTask>;
  }

  // 文件列表（只读）: aria2.getFiles；aria2 无优先级概念，统一 normal
  override async getTorrentFiles(torrent: string | CTorrent): Promise<CTorrentFile[]> {
    const id = typeof torrent === "string" ? torrent : (torrent.id as string);
    const { result: files } = await this.methodSend<
      Array<{
        index: number;
        path: string;
        length: number;
        completedLength: number;
        selected: string; // "true" | "false"
      }>
    >("aria2.getFiles", [id]);

    return (files ?? []).map((file) => ({
      index: file.index,
      name: file.path.split(/[/\\]/).pop() || file.path,
      path: file.path,
      size: file.length,
      progress: file.length > 0 ? (file.completedLength / file.length) * 100 : 0,
      priority: "normal" as TorrentFilePriority,
      wanted: String(file.selected) === "true",
      raw: file,
    }));
  }
}
