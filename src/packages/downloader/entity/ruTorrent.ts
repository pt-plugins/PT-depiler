/**
 * @see https://github.com/Novik/ruTorrent/blob/master/php/addtorrent.php
 * @see https://github.com/Rhilip/PT-Plugin/blob/master/src/script/client.js#L477_L543
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
  TorrentSpeedLimit,
  CTorrentFile,
  CTorrentFileSelection,
  CTorrentPeer,
  CTorrentTracker,
  CTrackerState,
  TorrentFilePriority,
} from "../types";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getRemoteTorrentFile } from "../utils";

export const clientConfig: TorrentClientConfig = {
  type: "ruTorrent",
  name: "ruTorrent",
  address: "https://myrut.com/rutorrent",
  username: "admin",
  password: "",
  timeout: 60 * 1e3,
};

// noinspection JSUnusedGlobalSymbols
export const clientMetaData: TorrentClientMetaData = {
  description: "rTorrent 的一款基于PHP的Web前端面板",
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
    // tracker 增删需经 t.multicall 组合，边界多，暂保持只读
    TrackerManage: {
      allowed: false,
    },
  },
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
];

type statusData = [
  string, // up_total
  string, // down_total
  string, // upload_rate
  string, // download_rate
];

interface ListResponse {
  t: {
    [infoHash: string]: torrentData;
  };
  cid: number;
}

function iv(val: string | null): number {
  const v = val == null ? 0 : parseInt(val + "");
  return isNaN(v) ? 0 : v;
}

function buildRequestXML(calls: Array<[string, string[]?]>): string {
  let retXML = '<?xml version="1.0" encoding="UTF-8"?>';
  retXML += "<methodCall><methodName>system.multicall</methodName><params><param><value><array><data>";
  for (const [method, params = []] of calls) {
    retXML += "<value><struct>";
    retXML += `<member><name>methodName</name><value><string>${method}</string></value></member>`;
    retXML +=
      "<member><name>params</name><value><array><data>" +
      params.map((param) => `<value><string>${String(param)}</string></value>`).join("") +
      "</data></array></value></member>";
    retXML += "</struct></value>";
  }

  retXML += "</data></array></value></param></params></methodCall>";
  return retXML;
}

function parseResponseXML(resp: string): string[] {
  const parsedXML = new DOMParser().parseFromString(resp, "text/xml");
  // noinspection CssInvalidHtmlTagReference
  const dataNode = parsedXML.querySelectorAll("params > param > value > array > data > value > array > data > value");

  return Array.from(dataNode).map((node) => node.textContent!);
}

// XML-RPC value 通用解析（支持 string/int/i4/i8/double/boolean/array/struct）
interface XmlRpcArray extends Array<XmlRpcValue> {}
interface XmlRpcStruct {
  [key: string]: XmlRpcValue;
}
type XmlRpcValue = string | number | boolean | XmlRpcArray | XmlRpcStruct;

function parseXmlRpcValue(node: Element): XmlRpcValue {
  const typeNode = node.firstElementChild;
  if (!typeNode) {
    return node.textContent ?? "";
  }

  switch (typeNode.tagName) {
    case "array": {
      const dataNode = typeNode.querySelector(":scope > data");
      return Array.from(dataNode?.querySelectorAll(":scope > value") ?? []).map((value) => parseXmlRpcValue(value));
    }
    case "struct": {
      const result: Record<string, XmlRpcValue> = {};
      typeNode.querySelectorAll(":scope > member").forEach((member) => {
        const name = member.querySelector(":scope > name")?.textContent ?? "";
        const value = member.querySelector(":scope > value");
        result[name] = value ? parseXmlRpcValue(value) : "";
      });
      return result;
    }
    case "int":
    case "i4":
    case "i8":
      return parseInt(typeNode.textContent ?? "", 10);
    case "double":
      return parseFloat(typeNode.textContent ?? "");
    case "boolean":
      return typeNode.textContent === "1" || typeNode.textContent === "true";
    case "string":
    default:
      return typeNode.textContent ?? "";
  }
}

// 解析 XML-RPC 方法响应的第一个 param value
function parseXmlRpcResponse(xml: string): XmlRpcValue {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const valueNode = doc.querySelector("methodResponse params param value");
  return valueNode ? parseXmlRpcValue(valueNode) : [];
}

// 生成 system.multicall 请求（参数为 struct 数组），用于一次请求多个 rTorrent 调用
function buildSystemMulticallXML(calls: Array<{ methodName: string; params?: string[] }>): string {
  let retXML = '<?xml version="1.0" encoding="UTF-8"?>';
  retXML += "<methodCall><methodName>system.multicall</methodName><params><param><value><array><data>";
  for (const call of calls) {
    retXML += "<value><struct>";
    retXML += `<member><name>methodName</name><value><string>${call.methodName}</string></value></member>`;
    retXML += "<member><name>params</name><value><array><data>";
    for (const param of call.params ?? []) {
      retXML += `<value><string>${param}</string></value>`;
    }
    retXML += "</data></array></value></member>";
    retXML += "</struct></value>";
  }
  retXML += "</data></array></value></param></params></methodCall>";
  return retXML;
}

// noinspection JSUnusedGlobalSymbols
export default class RuTorrent extends AbstractBittorrentClient<TorrentClientConfig> {
  readonly version = "v0.0.1";

  constructor(options: Partial<TorrentClientConfig> = {}) {
    super({ ...clientConfig, ...options });
  }

  async request<T>(config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return await axios.request({
      baseURL: this.config.address,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      timeout: this.config.timeout,
      ...config,
    });
  }

  async requestHttpRpc<T>(data: any = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "post",
      url: "/plugins/httprpc/action.php",
      data,
    });
  }

  /**
   * 鉴于ruTorrent请求 `php/getplugins.php` 页面获取信息为js格式，不好处理，
   * 故考虑请求 `/php/getsettings.php` 页面，如果返回json格式的信息则说明可连接
   */
  async ping(): Promise<boolean> {
    try {
      await this.request({
        url: "/php/getsettings.php",
        responseType: "json",
      });
    } catch (e) {
      return false;
    }
    return true;
  }

  protected async getClientVersionFromRemote(): Promise<string> {
    const postData = buildRequestXML([["system.client_version"], ["system.api_version"]]);
    const { data: responseXML } = await this.requestHttpRpc<string>(postData);
    const versionList = parseResponseXML(responseXML);

    return versionList.join("/");
  }

  override async getClientStatus(): Promise<TorrentClientStatus> {
    const postData = new URLSearchParams({ mode: "ttl" });
    const { data } = await this.requestHttpRpc<statusData>(postData);
    const [upData, dlData, upSpeed, dlSpeed] = data.map(iv);

    return {
      upData,
      dlData,
      upSpeed,
      dlSpeed,
    };
  }

  override async getClientFreeSpace(): Promise<number | "N/A"> {
    const {
      data: { free },
    } = await this.request<{ total: number; free: number }>({
      url: "/rutorrent/plugins/diskspace/action.php",
    });
    return free;
  }

  async addTorrent(url: string, options: Partial<CAddTorrentOptions> = {}): Promise<CAddTorrentResult> {
    const addResult = { success: false } as CAddTorrentResult;

    let postData: URLSearchParams | FormData;
    if (url.startsWith("magnet:") || !options.localDownload) {
      postData = new URLSearchParams();
      postData.append("url", url);
    } else {
      postData = new FormData();

      const torrent = await getRemoteTorrentFile({
        url,
        ...(options.localDownloadOption || {}),
      });

      postData.append("torrent_file", torrent.metadata.blob(), torrent.name);
    }

    postData.append("json", "1"); // 让ruTorrent返回json
    // postData.append('fast_resume', '1') // 快速恢复，默认禁用

    if (options.savePath) {
      postData.append("dir_edit", options.savePath);
    }

    if (options.addAtPaused) {
      postData.append("torrents_start_stopped", "1");
    }

    if (options.label) {
      postData.append("label", options.label);
    }

    // Note: ruTorrent's addtorrent.php does not support upload_rate parameter
    // The uploadSpeedLimit feature is not implemented as it's not supported by the API

    const { data } = await this.request<{
      result: "Success" | "Failed" | "FailedFile";
    }>({
      method: "post",
      url: "/php/addtorrent.php",
      data: postData,
    });

    addResult.success = data.result === "Success";
    if (!addResult.success) {
      addResult.message = data;
    }

    return addResult;
  }

  async getAllTorrents(): Promise<CTorrent[]> {
    const postData = new URLSearchParams({ mode: "list" });
    const { data } = await this.requestHttpRpc<ListResponse>(postData);

    return Object.keys(data.t).map((infoHash: string) => {
      const rawTorrent = data.t[infoHash];

      const isOpen = iv(rawTorrent[0]);
      const isHashChecking = iv(rawTorrent[1]);
      const getState = iv(rawTorrent[3]);
      const getHashing = iv(rawTorrent[23]);
      const isActive = iv(rawTorrent[28]);
      const torrentMsg = rawTorrent[30];

      const chunksProcessing = isHashChecking === 0 ? iv(rawTorrent[6]) : iv(rawTorrent[24]);
      const TorrentDone = Math.floor((chunksProcessing / iv(rawTorrent[7])) * 1000);
      const isCompleted = TorrentDone >= 1000;

      const basePath = rawTorrent[25];
      const basePathPos = basePath.lastIndexOf("/");
      const savePath =
        basePath.substring(basePathPos + 1) === rawTorrent[4] ? basePath.substring(0, basePathPos) : basePath;

      let state = CTorrentState.unknown;
      if (isOpen !== 0) {
        if (getState === 0 || isActive === 0) {
          state = CTorrentState.paused;
        } else {
          // eslint-disable-next-line eqeqeq
          state = isCompleted ? CTorrentState.seeding : CTorrentState.downloading;
        }
      } else if (getHashing !== 0) {
        state = CTorrentState.queued;
      } else if (isHashChecking !== 0) {
        state = CTorrentState.checking;
      } else if (torrentMsg.length && torrentMsg !== "Tracker: [Tried all trackers.]") {
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
        totalDownloaded: iv(rawTorrent[8]),
        raw: rawTorrent,
        clientId: this.config.id,
      } as CTorrent<torrentData>;
    });
  }

  async pauseTorrent(id: any): Promise<boolean> {
    const postData = new URLSearchParams({
      mode: "pause",
      hash: id.toUpperCase(),
    });
    await this.requestHttpRpc(postData);
    return true;
  }

  async removeTorrent(id: any, removeData: boolean = false): Promise<boolean> {
    const upId = id.toUpperCase();

    let postData: string | URLSearchParams;
    if (removeData) {
      postData = buildRequestXML([
        ["d.custom5.set", [upId, 1]],
        ["d.delete_tied", [upId]],
        ["d.erase", [upId]],
      ]);
    } else {
      postData = new URLSearchParams({
        mode: "remove",
        hash: upId,
      });
    }

    await this.requestHttpRpc(postData);
    return true;
  }

  async resumeTorrent(id: string): Promise<boolean> {
    const postData = new URLSearchParams({
      mode: "post",
      hash: id.toUpperCase(),
    });
    await this.requestHttpRpc(postData);
    return true;
  }

  async getTorrentTrackers(_torrent: string | CTorrent): Promise<string[]> {
    const trackers = await this.getTorrentTrackersDetail(_torrent);
    return trackers.map((tracker) => tracker.url);
  }

  // 重新校验种子（rTorrent: d.check_hash）
  override async recheckTorrent(id: any): Promise<boolean> {
    const postData = buildRequestXML([["d.check_hash", [id.toUpperCase()]]]);
    await this.requestHttpRpc(postData);
    return true;
  }

  // 设置单个种子的速度限制（单位 KiB/s，0 表示不限速；rTorrent: d.set_upload_limit / d.set_download_limit）
  override async setTorrentSpeedLimit(id: any, limits: TorrentSpeedLimit): Promise<boolean> {
    const upId = id.toUpperCase();
    const calls: Array<[string, string[]?]> = [];

    if (typeof limits.upload !== "undefined") {
      calls.push(["d.set_upload_limit", [upId, String(limits.upload > 0 ? limits.upload : 0)]]);
    }

    if (typeof limits.download !== "undefined") {
      calls.push(["d.set_download_limit", [upId, String(limits.download > 0 ? limits.download : 0)]]);
    }

    const postData = buildRequestXML(calls);
    await this.requestHttpRpc(postData);
    return true;
  }

  // 设置单个种子的标签（rTorrent: d.custom1.set）
  override async setTorrentLabel(id: any, label: string): Promise<boolean> {
    const postData = buildRequestXML([["d.custom1.set", [id.toUpperCase(), label]]]);
    await this.requestHttpRpc(postData);
    return true;
  }

  // ─────────────────────────────────────────────
  // 文件级 / peers / tracker（rTorrent XML-RPC，经 ruTorrent httprpc 通道）
  // ─────────────────────────────────────────────

  private getTorrentHash(torrent: string | CTorrent): string {
    if (typeof torrent === "string") {
      return torrent;
    }
    return (torrent.infoHash ?? torrent.id) as string;
  }

  // 文件列表: f.multicall
  override async getTorrentFiles(torrent: string | CTorrent): Promise<CTorrentFile[]> {
    const hash = this.getTorrentHash(torrent).toUpperCase();
    const postData = buildRequestXML([
      ["f.multicall", [hash, "", "f.path=", "f.size_bytes=", "f.completed_chunks=", "f.size_chunks=", "f.priority="]],
    ]);
    const { data: responseXML } = await this.requestHttpRpc<string>(postData);
    const parsed = parseXmlRpcResponse(responseXML);
    const files = (Array.isArray(parsed) ? (parsed as XmlRpcValue[][]) : []) as XmlRpcValue[][];

    return files.map((file, index) => {
      const [path, size, completedChunks, totalChunks, priority] = file as [string, number, number, number, number];
      const filePriority = mapRtorrentFilePriority(Number(priority));
      const totalChunksNum = Number(totalChunks);

      return {
        index,
        name: String(path).split("/").pop() || String(path),
        path: String(path),
        size: Number(size),
        progress: totalChunksNum > 0 ? (Number(completedChunks) / totalChunksNum) * 100 : 0,
        priority: filePriority,
        wanted: filePriority !== "skip",
        raw: file,
      };
    });
  }

  // 文件优先级/选择（rTorrent: f.priority.set，一次 system.multicall 批量）
  override async setTorrentFilePriority(
    torrent: string | CTorrent,
    selections: CTorrentFileSelection[],
  ): Promise<boolean> {
    if (selections.length === 0) {
      return true;
    }
    const hash = this.getTorrentHash(torrent).toUpperCase();
    const calls = selections.map(({ index, priority }) => ({
      methodName: "f.priority.set",
      params: [`${hash}:f${index}`, String(mapTorrentFilePriorityToRtorrent(priority))],
    }));

    const postData = buildSystemMulticallXML(calls);
    await this.requestHttpRpc(postData);
    return true;
  }

  // peer 列表: p.multicall
  override async getTorrentPeers(torrent: string | CTorrent): Promise<CTorrentPeer[]> {
    const hash = this.getTorrentHash(torrent).toUpperCase();
    const postData = buildRequestXML([
      [
        "p.multicall",
        [
          hash,
          "",
          "p.address=",
          "p.port=",
          "p.client_version=",
          "p.completed_percent=",
          "p.down_rate=",
          "p.up_rate=",
          "p.is_incoming=",
          "p.is_encrypted=",
        ],
      ],
    ]);
    const { data: responseXML } = await this.requestHttpRpc<string>(postData);
    const parsed = parseXmlRpcResponse(responseXML);
    const peers = (Array.isArray(parsed) ? (parsed as XmlRpcValue[][]) : []) as XmlRpcValue[][];

    return peers.map((peer) => {
      const [ip, port, client, completedPercent, downRate, upRate, incoming, encrypted] = peer as [
        string,
        number,
        string,
        number,
        number,
        number,
        number,
        number,
      ];
      return {
        ip: String(ip),
        port: Number(port),
        client: String(client),
        // p.completed_percent 为千分比 0-1000
        progress: Number(completedPercent) / 10,
        downloadSpeed: Number(downRate),
        uploadSpeed: Number(upRate),
        incoming: incoming === 1,
        encrypted: encrypted === 1,
        flags: [],
        raw: peer,
      };
    });
  }

  // tracker 列表（带状态）: t.multicall
  override async getTorrentTrackersDetail(torrent: string | CTorrent): Promise<CTorrentTracker[]> {
    const hash = this.getTorrentHash(torrent).toUpperCase();
    const postData = buildRequestXML([
      [
        "t.multicall",
        [
          hash,
          "",
          "t.url=",
          "t.is_enabled=",
          "t.is_open=",
          "t.scrape_complete=",
          "t.scrape_incomplete=",
          "t.scrape_time_last=",
          "t.group=",
        ],
      ],
    ]);
    const { data: responseXML } = await this.requestHttpRpc<string>(postData);
    const parsed = parseXmlRpcResponse(responseXML);
    const trackers = (Array.isArray(parsed) ? (parsed as XmlRpcValue[][]) : []) as XmlRpcValue[][];

    return trackers.map((tracker) => {
      const [url, enabled, open, seeds, leeches, lastScrape, tier] = tracker as [
        string,
        number,
        number,
        number,
        number,
        number,
        number,
      ];
      const enabledNum = Number(enabled);
      const seedsNum = Number(seeds);
      const leechesNum = Number(leeches);
      const lastScrapeNum = Number(lastScrape);

      let status = CTrackerState.unknown;
      if (enabledNum === 0) {
        status = CTrackerState.disabled;
      } else if (Number(open) === 1) {
        status = CTrackerState.working;
      } else {
        status = CTrackerState.updating;
      }

      return {
        url: String(url),
        tier: Number(tier) || 0,
        status,
        seeds: seedsNum >= 0 ? seedsNum : undefined,
        leeches: leechesNum >= 0 ? leechesNum : undefined,
        lastAnnounce: lastScrapeNum > 0 ? lastScrapeNum : undefined,
        enabled: enabledNum === 1,
        raw: tracker,
      };
    });
  }
}

// rTorrent 文件优先级: 0=skip, 1=low, 2=normal, 3=high
function mapRtorrentFilePriority(priority: number): TorrentFilePriority {
  switch (priority) {
    case 0:
      return "skip";
    case 1:
      return "low";
    case 3:
      return "high";
    case 2:
    default:
      return "normal";
  }
}

function mapTorrentFilePriorityToRtorrent(priority: TorrentFilePriority): number {
  switch (priority) {
    case "skip":
      return 0;
    case "low":
      return 1;
    case "high":
    case "highest":
      return 3;
    case "normal":
    default:
      return 2;
  }
}
