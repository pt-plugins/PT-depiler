/**
 *
 * 注意：Flood目前有两个分支，且部分路由存在差异
 *  - https://github.com/Flood-UI/flood/tree/master/server/routes  (legacy)
 *  - https://github.com/jesec/flood/tree/master/server/routes/api
 *
 * 实现时应尽可能同时匹配到两个
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
import urlJoin from "url-join";
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
    "同时兼容 Flood 原版以及 jesec修改版",
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
  },
};

type FloodApiType = "legacy" | "jesec";
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

const FloodApiEndpointMap: {
  [key in FloodApiType]: {
    [key in FloodApiEndpoint]: string;
  };
} = {
  jesec: {
    verify: "/api/auth/verify",
    authenticate: "/api/auth/authenticate",
    "connection-test": "/api/client/connection-test",
    getTorrents: "/api/torrents",
    addTorrentByUrl: "/api/torrents/add-urls",
    addTorrentByFile: "/api/torrents/add-files",
    startTorrent: "/api/torrents/start",
    stopTorrent: "/api/torrents/stop",
    deleteTorrent: "/api/torrents/delete",
  },
  legacy: {
    verify: "/auth/verify",
    authenticate: "/auth/authenticate",
    "connection-test": "/api/client/connection-test",
    getTorrents: "", // Legacy使用EventSource获取，故此处留空即可
    addTorrentByUrl: "/api/client/add",
    addTorrentByFile: "/api/client/add-files",
    startTorrent: "/api/client/start",
    stopTorrent: "/api/client/stop",
    deleteTorrent: "/api/client/torrents/delete",
  },
};

// From https://github.com/Flood-UI/flood/blob/master/client/src/javascript/constants/ActionTypes.js
const legacyActivityEventType = [
  "AUTH_CREATE_USER_SUCCESS",
  "AUTH_DELETE_USER_ERROR",
  "AUTH_DELETE_USER_SUCCESS",
  "AUTH_LIST_USERS_SUCCESS",
  "AUTH_LOGIN_ERROR",
  "AUTH_LOGIN_SUCCESS",
  "AUTH_LOGOUT_ERROR",
  "AUTH_LOGOUT_SUCCESS",
  "AUTH_REGISTER_ERROR",
  "AUTH_REGISTER_SUCCESS",
  "AUTH_VERIFY_ERROR",
  "AUTH_VERIFY_SUCCESS",
  "CLIENT_ADD_TORRENT_ERROR",
  "CLIENT_ADD_TORRENT_SUCCESS",
  "CLIENT_CHECK_HASH_ERROR",
  "CLIENT_CHECK_HASH_SUCCESS",
  "DISK_USAGE_CHANGE",
  "FLOOD_CLEAR_NOTIFICATIONS_ERROR",
  "FLOOD_CLEAR_NOTIFICATIONS_SUCCESS",
  "CLIENT_CONNECTION_TEST_ERROR",
  "CLIENT_CONNECTION_TEST_SUCCESS",
  "CLIENT_CONNECTIVITY_STATUS_CHANGE",
  "CLIENT_FETCH_TORRENT_TAXONOMY_ERROR",
  "CLIENT_FETCH_TORRENT_TAXONOMY_SUCCESS",
  "CLIENT_FETCH_TORRENT_DETAILS_ERROR",
  "CLIENT_FETCH_TORRENT_DETAILS_SUCCESS",
  "CLIENT_FETCH_TRANSFER_HISTORY_ERROR",
  "CLIENT_FETCH_TRANSFER_HISTORY_SUCCESS",
  "CLIENT_MOVE_TORRENTS_SUCCESS",
  "CLIENT_MOVE_TORRENTS_ERROR",
  "CLIENT_REMOVE_TORRENT_ERROR",
  "CLIENT_REMOVE_TORRENT_SUCCESS",
  "CLIENT_SET_FILE_PRIORITY_ERROR",
  "CLIENT_SET_FILE_PRIORITY_SUCCESS",
  "CLIENT_SET_TAXONOMY_ERROR",
  "CLIENT_SET_TAXONOMY_SUCCESS",
  "CLIENT_SET_THROTTLE_ERROR",
  "CLIENT_SET_THROTTLE_SUCCESS",
  "CLIENT_SET_TORRENT_PRIORITY_ERROR",
  "CLIENT_SET_TORRENT_PRIORITY_SUCCESS",
  "CLIENT_SETTINGS_FETCH_REQUEST_ERROR",
  "CLIENT_SETTINGS_FETCH_REQUEST_SUCCESS",
  "CLIENT_SETTINGS_SAVE_ERROR",
  "CLIENT_SETTINGS_SAVE_SUCCESS",
  "CLIENT_START_TORRENT_ERROR",
  "CLIENT_START_TORRENT_SUCCESS",
  "CLIENT_STOP_TORRENT_ERROR",
  "CLIENT_STOP_TORRENT_SUCCESS",
  "FLOOD_FETCH_NOTIFICATIONS_ERROR",
  "FLOOD_FETCH_NOTIFICATIONS_SUCCESS",
  "FLOOD_FETCH_MEDIAINFO_SUCCESS",
  "NOTIFICATION_COUNT_CHANGE",
  "SETTINGS_FEED_MONITOR_FEED_ADD_ERROR",
  "SETTINGS_FEED_MONITOR_FEED_ADD_SUCCESS",
  "SETTINGS_FEED_MONITOR_FEED_MODIFY_ERROR",
  "SETTINGS_FEED_MONITOR_FEED_MODIFY_SUCCESS",
  "SETTINGS_FEED_MONITOR_FEEDS_FETCH_ERROR",
  "SETTINGS_FEED_MONITOR_FEEDS_FETCH_SUCCESS",
  "SETTINGS_FEED_MONITORS_FETCH_ERROR",
  "SETTINGS_FEED_MONITORS_FETCH_SUCCESS",
  "SETTINGS_FEED_MONITOR_REMOVE_ERROR",
  "SETTINGS_FEED_MONITOR_REMOVE_SUCCESS",
  "SETTINGS_FEED_MONITOR_RULE_ADD_ERROR",
  "SETTINGS_FEED_MONITOR_RULE_ADD_SUCCESS",
  "SETTINGS_FEED_MONITOR_RULES_FETCH_ERROR",
  "SETTINGS_FEED_MONITOR_RULES_FETCH_SUCCESS",
  "SETTINGS_FEED_MONITOR_ITEMS_FETCH_ERROR",
  "SETTINGS_FEED_MONITOR_ITEMS_FETCH_SUCCESS",
  "SETTINGS_FETCH_REQUEST_SUCCESS",
  "SETTINGS_FETCH_REQUEST_ERROR",
  "SETTINGS_SAVE_REQUEST_SUCCESS",
  "SETTINGS_SAVE_REQUEST_ERROR",
  "TAXONOMY_DIFF_CHANGE",
  "TAXONOMY_FULL_UPDATE",
  "TORRENT_LIST_DIFF_CHANGE",
  "TORRENT_LIST_FULL_UPDATE",
  "TRANSFER_HISTORY_FULL_UPDATE",
  "TRANSFER_SUMMARY_DIFF_CHANGE",
  "TRANSFER_SUMMARY_FULL_UPDATE",
  "UI_CLICK_TORRENT",
  "UI_CLICK_TORRENT_DETAILS",
  "UI_DISPLAY_MODAL",
  "UI_DISMISS_CONTEXT_MENU",
  "UI_DISPLAY_CONTEXT_MENU",
  "UI_DISPLAY_DROPDOWN_MENU",
  "UI_LATEST_TORRENT_LOCATION_REQUEST_ERROR",
  "UI_LATEST_TORRENT_LOCATION_REQUEST_SUCCESS",
  "UI_SET_TORRENT_SEARCH_FILTER",
  "UI_SET_TORRENT_SORT",
  "UI_SET_TORRENT_STATUS_FILTER",
  "UI_SET_TORRENT_TAG_FILTER",
  "UI_SET_TORRENT_TRACKER_FILTER",
  "UI_SORT_PROPS_REQUEST_SUCCESS",
  "UI_SORT_PROPS_REQUEST_ERROR",
] as const;

/**
 * 原版的种子情况需要使用 EventSource获取
 * 通过获取
 *
 * @param path
 * @param event
 */
function legacyActivityStreamWrapper(path: string, event: (typeof legacyActivityEventType)[number]): Promise<any> {
  return new Promise<any>((resolve) => {
    const sse = new EventSource(path);
    sse.addEventListener(event, (evt: any) => {
      resolve(evt.data);
      sse.close();
    });
  });
}

type TorrentStatus =
  | ""
  | "checking"
  | "seeding"
  | "complete"
  | "downloading"
  | "stopped"
  | "error"
  | "inactive"
  | "active"
  // Legacy
  | "ch"
  | "sd"
  | "p"
  | "c"
  | "d"
  | "ad"
  | "au"
  | "s"
  | "e"
  | "i"
  | "a";

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

  private apiType?: FloodApiType;

  /**
   * Flood（jesec 分支）的认证依赖登录后下发的 jwt 会话 Cookie（httpOnly, SameSite=strict），
   * 因此必须复用同一个开启 withCredentials 的 axios 实例，否则登录成功后 Cookie 无法留存，
   * 后续请求全部 401。扩展已声明全量 host permission，跨域携带 Cookie 不受 SameSite 限制。
   */
  private readonly sessionedAxios = axios.create({ withCredentials: true });

  constructor(options: Partial<TorrentClientConfig> = {}) {
    super({ ...clientConfig, ...options });
  }

  private async getEndPointType(): Promise<FloodApiType> {
    if (this.apiType == null) {
      try {
        const resp = await this.sessionedAxios.get(FloodApiEndpointMap.legacy.verify, {
          baseURL: this.config.address,
          // 探测超时单独收紧：部分 jesec 版本对不存在的 GET 路由不返回 404 而是挂起，
          // 用短超时快速失败，避免拖满全局 timeout 才进入 jesec 分支
          timeout: Math.min(this.config.timeout ?? 60e3, 10e3),
        });
        this.apiType = resp.status === 404 ? "jesec" : "legacy";
      } catch (error) {
        // 旧版未认证时 /auth/verify 返回 401，有 HTTP 响应即视为路由存在（legacy）；
        // 404 或超时/网络错误（含 jesec 对未知 GET 路由挂起的情况）归为 jesec
        const status = (error as AxiosError).response?.status;
        this.apiType = status && status !== 404 ? "legacy" : "jesec";
      }
    }
    return this.apiType as FloodApiType;
  }

  private async getEndPointUrl(endpoint: FloodApiEndpoint): Promise<string> {
    const endPointType = await this.getEndPointType();
    return FloodApiEndpointMap[endPointType][endpoint];
  }

  private async request<T>(endpoint: FloodApiEndpoint, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    const endPointUrl = await this.getEndPointUrl(endpoint);

    try {
      return await this.sessionedAxios.request<T>({
        baseURL: this.config.address,
        url: endPointUrl,
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
      // jesec 分支现为 { isConnected }（旧版为 { isConnect }），两者兼容读取
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
        const endPointType = await this.getEndPointType();
        const torrent = await getRemoteTorrentFile({
          url,
          ...(options.localDownloadOption || {}),
        });

        if (endPointType === "jesec") {
          postData.files = [torrent.metadata.base64()];
        } else {
          const formData = new FormData();

          Object.keys(postData).forEach((key) => {
            const value = postData[key];
            formData.append(key, value);
          });

          formData.append("torrents", torrent.metadata.blob(), torrent.name);
          postData = formData; // 覆写postData
        }

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
    const endPointType = await this.getEndPointType();

    let rawTorrents: TorrentList;
    if (endPointType === "legacy") {
      await this.ping();

      const r = await legacyActivityStreamWrapper(
        urlJoin(this.config.address, "/api/activity-stream"),
        "TORRENT_LIST_FULL_UPDATE",
      );

      rawTorrents = JSON.parse(r) as TorrentList; // Example: https://pastebin.com/cCNsMRdx
    } else {
      const req = await this.request<TorrentListSummaryResponse>("getTorrents");
      rawTorrents = req.data.torrents;
    }

    return Object.keys(rawTorrents).map((infoHash: string) => {
      const rawTorrent = rawTorrents[infoHash];

      const statusInclude = (judge: TorrentStatus[]): boolean => {
        return judge.some((s) => rawTorrent.status.includes(s));
      };

      let state = CTorrentState.unknown;
      if (statusInclude(["downloading", "d", "ad"])) {
        state = CTorrentState.downloading;
      } else if (statusInclude(["seeding", "sd", "au"])) {
        state = CTorrentState.seeding;
      } else if (statusInclude(["stopped", "p", "s"])) {
        state = CTorrentState.paused;
      } else if (statusInclude(["complete"])) {
        // jesec 的完成种子只带 complete 状态（不再提供 isComplete 字段），归入做种
        state = CTorrentState.seeding;
      } else if (statusInclude(["checking", "ch"])) {
        state = CTorrentState.checking;
      } else if (statusInclude(["error", "e"])) {
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
    const endPointType = await this.getEndPointType();
    const hashFieldKey = endPointType === "jesec" ? "hashes" : "hash";

    const postData: any = { deleteData: removeData };
    postData[hashFieldKey] = [id];

    await this.request("deleteTorrent", {
      method: "post",
      data: postData,
    });

    return true;
  }

  async getTorrentTrackers(_torrent: CTorrent): Promise<string[]> {
    return [];
  }
}
